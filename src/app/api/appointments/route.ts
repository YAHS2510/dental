import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  createAppointmentSchema,
  appointmentQuerySchema,
} from "@/lib/validations/appointment";
import { inMemoryStore } from "@/lib/in-memory-store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { renderBookingRequestReceivedEmail } from "@/lib/email-templates";

// Rate limit: 5 requests per 60 seconds per IP on the booking endpoint
const BOOKING_RATE_LIMIT = { limit: 5, windowMs: 60000 };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryResult = appointmentQuerySchema.safeParse({
      status: searchParams.get("status") || undefined,
      date: searchParams.get("date") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      serviceId: searchParams.get("serviceId") || undefined,
      clinicSlug: searchParams.get("clinicSlug") || undefined,
      source: searchParams.get("source") || undefined,
      limit: searchParams.get("limit") || undefined,
      page: searchParams.get("page") || undefined,
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { success: false, errors: queryResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, date, startDate, endDate, serviceId, source, limit, page } =
      queryResult.data;

    // Construct Prisma where filter
    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (source && source !== "ALL") {
      where.source = source;
    }

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      where.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    } else if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    let appointments = [];
    try {
      appointments = await prisma.appointment.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { startTime: "asc" },
        include: {
          patient: true,
          service: true,
          staffUser: true,
          auditLogs: {
            take: 3,
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } catch {
      // In-memory fallback dataset
      let list = inMemoryStore.getAppointments();
      if (status && status !== "ALL") {
        list = list.filter((apt) => apt.status === status);
      }
      if (source && source !== "ALL") {
        list = list.filter((apt) => apt.source === source);
      }
      appointments = list;
    }

    return NextResponse.json({
      success: true,
      count: appointments.length,
      page,
      limit,
      appointments,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch appointments",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce rate limiting on public booking requests
    const clientIp = getClientIp(req);
    const rateLimitCheck = rateLimit(clientIp, BOOKING_RATE_LIMIT);

    if (!rateLimitCheck.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many appointment requests from this IP. Please wait before attempting another booking.",
          retryAfterSeconds: rateLimitCheck.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitCheck.resetSeconds),
            "X-RateLimit-Limit": String(rateLimitCheck.limit),
            "X-RateLimit-Remaining": String(rateLimitCheck.remaining),
          },
        }
      );
    }

    // 2. Validate input payload with Zod
    const rawBody = await req.json();
    const parseResult = createAppointmentSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed on appointment payload",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input = parseResult.data;

    // Resolve patient names based on patientType (Adult vs Child)
    const rawPatientName =
      input.patientType === "CHILD"
        ? input.childName || input.fullName || "Child Patient"
        : input.fullName ||
          `${input.firstName || ""} ${input.lastName || ""}`.trim() ||
          "Patient";

    const [derivedFirst, ...derivedLastParts] = rawPatientName.split(" ");
    const resolvedFirstName = input.firstName || derivedFirst || "Valued";
    const resolvedLastName =
      input.lastName || derivedLastParts.join(" ") || "Patient";

    const chosenServiceName =
      input.treatment ||
      input.serviceName ||
      "General Dental Consultation & Checkup";

    // Calculate requested appointment start and end times
    let scheduledDate: Date;
    if (input.startTime) {
      scheduledDate = new Date(input.startTime);
    } else if (input.preferredDate) {
      let hour = 14;
      let minute = 0;
      if (input.timeRange?.includes("Morning")) {
        hour = 10;
        minute = 30;
      } else if (input.timeRange?.includes("Afternoon")) {
        hour = 14;
        minute = 30;
      } else if (input.timeRange?.includes("Evening")) {
        hour = 17;
        minute = 30;
      }
      scheduledDate = new Date(
        `${input.preferredDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`
      );
      if (isNaN(scheduledDate.getTime())) {
        scheduledDate = new Date(Date.now() + 86400000);
      }
    } else if (input.appointmentDate) {
      scheduledDate = new Date(`${input.appointmentDate}T10:00:00Z`);
    } else {
      scheduledDate = new Date(Date.now() + 86400000); // Tomorrow
    }

    const durationMin = 30;
    const endDate = new Date(scheduledDate.getTime() + durationMin * 60000);

    const consolidatedNotes = [
      input.patientType === "CHILD" && input.guardianName
        ? `Parent/Guardian: ${input.guardianName}`
        : null,
      input.preferredDoctor &&
      input.preferredDoctor !== "Any Available Specialist"
        ? `Doctor: ${input.preferredDoctor}`
        : null,
      input.timeRange ? `Time Slot: ${input.timeRange}` : null,
      input.contactMethod ? `Contact Via: ${input.contactMethod}` : null,
      input.notes,
    ]
      .filter(Boolean)
      .join(" | ");

    const derivedSource =
      input.source && input.source !== "MANUAL"
        ? input.source
        : input.contactMethod === "WHATSAPP"
          ? "WHATSAPP"
          : "WEB_FORM";

    let createdAppointment;
    try {
      // Find or create default clinic
      let clinic = await prisma.clinic.findFirst();
      if (!clinic) {
        clinic = await prisma.clinic.create({
          data: {
            name: "VS Multispeciality Dental Clinic",
            slug: input.clinicSlug || "vs-dental-clinic",
            themeKey: "teal-serenity",
          },
        });
      }

      // Find or create service
      let service = null;
      if (input.serviceId) {
        service = await prisma.service.findUnique({
          where: { id: input.serviceId },
        });
      }
      if (!service && chosenServiceName) {
        service = await prisma.service.findFirst({
          where: { name: chosenServiceName, clinicId: clinic.id },
        });
        if (!service) {
          service = await prisma.service.create({
            data: {
              clinicId: clinic.id,
              name: chosenServiceName,
              price: 0.0,
              durationMinutes: durationMin,
            },
          });
        }
      }

      if (!service) {
        service = await prisma.service.create({
          data: {
            clinicId: clinic.id,
            name: "General Dental Consultation & Checkup",
            price: 0.0,
            durationMinutes: durationMin,
          },
        });
      }

      // Upsert patient by phone + clinicId
      let patient = await prisma.patient.findFirst({
        where: { clinicId: clinic.id, phone: input.phone },
      });

      if (!patient) {
        patient = await prisma.patient.create({
          data: {
            clinicId: clinic.id,
            firstName: resolvedFirstName,
            lastName: resolvedLastName,
            email: input.email || null,
            phone: input.phone,
            medicalNotes: consolidatedNotes,
          },
        });
      }

      // Create appointment with source and new fields
      createdAppointment = await prisma.appointment.create({
        data: {
          clinicId: clinic.id,
          patientId: patient.id,
          serviceId: service.id,
          startTime: scheduledDate,
          endTime: endDate,
          status: "PENDING",
          source: derivedSource as any,
          notes: consolidatedNotes,
          reason: input.reason || chosenServiceName,
          patientType: input.patientType || "ADULT",
          childName: input.childName || null,
          guardianName: input.guardianName || null,
          preferredDoctor: input.preferredDoctor || null,
          timeRange: input.timeRange || null,
          contactMethod: input.contactMethod || "PHONE",
          consentAgreed: input.consentAgreed ?? true,
        },
        include: {
          patient: true,
          service: true,
        },
      });

      // Log initial creation audit entry
      await prisma.auditLog.create({
        data: {
          clinicId: clinic.id,
          appointmentId: createdAppointment.id,
          action: "APPOINTMENT_REQUESTED",
          entityType: "Appointment",
          entityId: createdAppointment.id,
          performedBy:
            derivedSource === "WHATSAPP"
              ? "WhatsApp Booking Request"
              : "Patient Online Request",
          details: `Appointment requested for ${service.name} (${input.patientType || "ADULT"}) on ${scheduledDate.toISOString()} [Slot: ${input.timeRange || "Standard"}] via ${derivedSource}`,
          newValues: {
            status: "PENDING",
            source: derivedSource,
            patientType: input.patientType || "ADULT",
            timeRange: input.timeRange || null,
            contactMethod: input.contactMethod || "PHONE",
            startTime: scheduledDate.toISOString(),
          },
        },
      });
    } catch {
      // In-memory fallback if PostgreSQL is not active locally
      createdAppointment = {
        id: `APT-${Math.floor(100000 + Math.random() * 900000)}`,
        startTime: scheduledDate.toISOString(),
        endTime: endDate.toISOString(),
        status: "PENDING",
        source: derivedSource,
        notes: consolidatedNotes,
        reason: input.reason || chosenServiceName,
        patientType: input.patientType || "ADULT",
        childName: input.childName || null,
        guardianName: input.guardianName || null,
        preferredDoctor: input.preferredDoctor || null,
        timeRange: input.timeRange || null,
        contactMethod: input.contactMethod || "PHONE",
        consentAgreed: input.consentAgreed ?? true,
        patient: {
          firstName: resolvedFirstName,
          lastName: resolvedLastName,
          email: input.email,
          phone: input.phone,
        },
        service: {
          name: chosenServiceName,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.saveAppointment(createdAppointment as any);
    }

    // Dispatch Transactional Email to Patient
    if (input.email) {
      try {
        const emailContent = renderBookingRequestReceivedEmail({
          patientName: `${resolvedFirstName} ${resolvedLastName}`,
          serviceName:
            createdAppointment.service?.name ||
            chosenServiceName ||
            "General Dental Consultation",
          appointmentDate: scheduledDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          appointmentTime: scheduledDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        });

        await sendEmail({
          to: input.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
      } catch {
        // Safe fail: email errors should not block appointment reservation
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment request received successfully",
        appointment: createdAppointment,
        rateLimit: {
          remaining: rateLimitCheck.remaining,
          resetSeconds: rateLimitCheck.resetSeconds,
        },
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Limit": String(rateLimitCheck.limit),
          "X-RateLimit-Remaining": String(rateLimitCheck.remaining),
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to submit appointment request",
      },
      { status: 500 }
    );
  }
}
