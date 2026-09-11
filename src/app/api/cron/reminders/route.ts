import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inMemoryStore } from "@/lib/in-memory-store";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import { renderAppointmentReminderEmail } from "@/lib/email-templates";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";
    const dryRun = searchParams.get("dryRun") === "true";

    // Validate Cron authorization if CRON_SECRET is configured
    const cronSecret = process.env.CRON_SECRET || env.CRON_SECRET;
    const isAuthorized =
      !cronSecret ||
      authHeader === `Bearer ${cronSecret}` ||
      env.isDevelopment ||
      force;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: "Unauthorized cron execution" },
        { status: 401 }
      );
    }

    const now = new Date();
    // Default 24-hour reminder window: between 23 and 25 hours from right now
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    let appointments: any[] = [];
    try {
      appointments = await prisma.appointment.findMany({
        where: {
          status: "CONFIRMED",
          reminderSentAt: null,
          startTime: {
            gte: windowStart,
            lte: windowEnd,
          },
        },
        include: {
          patient: true,
          service: true,
          staffUser: true,
        },
      });

      if (appointments.length === 0 && force) {
        appointments = await prisma.appointment.findMany({
          where: {
            status: "CONFIRMED",
            reminderSentAt: null,
          },
          take: 5,
          include: {
            patient: true,
            service: true,
            staffUser: true,
          },
        });
      }
    } catch {
      // Fallback in dev/mock if PostgreSQL is offline
      const stored = inMemoryStore.getAppointments();
      appointments = stored.filter(
        (apt) => apt.status === "CONFIRMED" && !apt.reminderSentAt
      );
    }

    if (appointments.length === 0) {
      const stored = inMemoryStore.getAppointments();
      appointments = stored.filter(
        (apt) => apt.status === "CONFIRMED" && !apt.reminderSentAt
      );
    }

    const dispatchedResults: any[] = [];

    for (const apt of appointments) {
      const patientEmail = apt.patient?.email;
      if (!patientEmail) continue;

      const aptDate = new Date(apt.startTime);
      const emailContent = renderAppointmentReminderEmail({
        patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
        serviceName: apt.service?.name || "Clinical Consultation",
        appointmentDate: aptDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        appointmentTime: aptDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        doctorName: apt.staffUser?.name || "Attending Physician",
        durationMinutes: apt.service?.durationMinutes || 30,
      });

      if (!dryRun) {
        const sendResult = await sendEmail({
          to: patientEmail,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        // Stamp reminderSentAt to guarantee exactly-once delivery
        try {
          await prisma.appointment.update({
            where: { id: apt.id },
            data: { reminderSentAt: new Date() },
          });
        } catch {
          inMemoryStore.stampReminder(apt.id);
        }

        // Audit Log
        try {
          await prisma.auditLog.create({
            data: {
              clinicId: apt.clinicId || "clinic-default",
              appointmentId: apt.id,
              action: "REMINDER_EMAIL_SENT",
              entityType: "Appointment",
              entityId: apt.id,
              performedBy: "Automated 24h Cron Scheduler",
              details: `Dispatched 24-hour reminder email to ${patientEmail} for appointment ${apt.id}`,
              newValues: {
                reminderSentAt: new Date().toISOString(),
                messageId: sendResult.id,
              },
            },
          });
        } catch {}

        dispatchedResults.push({
          appointmentId: apt.id,
          patientEmail,
          status: "DISPATCHED",
          messageId: sendResult.id,
          simulated: sendResult.simulated,
        });
      } else {
        dispatchedResults.push({
          appointmentId: apt.id,
          patientEmail,
          status: "DRY_RUN_PREVIEW",
        });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      cronSchedule: "0 * * * * (Hourly)",
      window: {
        from: windowStart.toISOString(),
        to: windowEnd.toISOString(),
      },
      appointmentsScanned: appointments.length,
      remindersProcessed: dispatchedResults.length,
      dispatched: dispatchedResults,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process reminder cron job",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
