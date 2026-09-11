import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inMemoryStore } from "@/lib/in-memory-store";
import { updateAppointmentStatusSchema } from "@/lib/validations/appointment";
import { sendEmail } from "@/lib/email";
import {
  renderBookingConfirmedEmail,
  renderBookingDeclinedEmail,
  renderBookingCancelledEmail,
} from "@/lib/email-templates";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;
    const body = await req.json();

    const parseResult = updateAppointmentStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed for status update",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status, staffUserId, performedBy, reason } = parseResult.data;

    let updatedAppointment;
    let auditEntry;

    try {
      const existing = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { patient: true, service: true },
      });

      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            message: `Appointment with ID ${appointmentId} not found.`,
          },
          { status: 404 }
        );
      }

      const previousStatus = existing.status;

      // Update the status
      updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status,
          staffUserId: staffUserId || existing.staffUserId,
          notes: reason
            ? `${existing.notes ? existing.notes + " | " : ""}${reason}`
            : existing.notes,
        },
        include: {
          patient: true,
          service: true,
          staffUser: true,
        },
      });

      // Track action in AuditLog
      let actionName = `APPOINTMENT_${status}`;
      if (status === "CONFIRMED") actionName = "APPOINTMENT_CONFIRMED";
      else if (status === "DECLINED") actionName = "APPOINTMENT_DECLINED";
      else if (status === "CANCELLED") actionName = "APPOINTMENT_CANCELLED";

      auditEntry = await prisma.auditLog.create({
        data: {
          clinicId: existing.clinicId,
          appointmentId: existing.id,
          staffUserId: staffUserId || null,
          action: actionName,
          entityType: "Appointment",
          entityId: existing.id,
          performedBy,
          details:
            reason ||
            `Appointment status transitioned from ${previousStatus} to ${status}.`,
          previousValues: { status: previousStatus },
          newValues: { status, reason: reason || null },
        },
      });
    } catch {
      // Fallback in dev/mock if PostgreSQL is offline
      const stored = inMemoryStore.updateAppointmentStatus(
        appointmentId,
        status as any,
        reason
      );
      updatedAppointment = stored || {
        id: appointmentId,
        status,
        updatedAt: new Date().toISOString(),
        notes: reason || "Status updated",
      };
      auditEntry = {
        action: `APPOINTMENT_${status}`,
        performedBy,
        entityType: "Appointment",
        entityId: appointmentId,
        details: reason || `Transitioned to ${status}`,
        createdAt: new Date().toISOString(),
      };
    }

    // Trigger Status-Specific Transactional Email to Patient
    const patientEmail = updatedAppointment?.patient?.email;
    if (patientEmail) {
      try {
        const appointmentTimeDate = updatedAppointment.startTime
          ? new Date(updatedAppointment.startTime)
          : new Date();

        const templateData = {
          patientName: `${updatedAppointment.patient?.firstName || "Valued"} ${
            updatedAppointment.patient?.lastName || "Patient"
          }`.trim(),
          serviceName:
            updatedAppointment.service?.name || "Clinical Consultation",
          appointmentDate: appointmentTimeDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          appointmentTime: appointmentTimeDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          doctorName:
            updatedAppointment.staffUser?.name || "Attending Physician",
          servicePrice: updatedAppointment.service?.price
            ? Number(updatedAppointment.service.price).toFixed(2)
            : "85.00",
          durationMinutes: updatedAppointment.service?.durationMinutes || 30,
          reason,
        };

        if (status === "CONFIRMED") {
          const email = renderBookingConfirmedEmail(templateData);
          await sendEmail({
            to: patientEmail,
            subject: email.subject,
            html: email.html,
            text: email.text,
          });
        } else if (status === "DECLINED") {
          const email = renderBookingDeclinedEmail(templateData);
          await sendEmail({
            to: patientEmail,
            subject: email.subject,
            html: email.html,
            text: email.text,
          });
        } else if (status === "CANCELLED") {
          const email = renderBookingCancelledEmail(templateData);
          await sendEmail({
            to: patientEmail,
            subject: email.subject,
            html: email.html,
            text: email.text,
          });
        }
      } catch {
        // Safe fail: email errors should not block database status transition
      }
    }

    return NextResponse.json({
      success: true,
      message: `Appointment successfully updated to ${status}.`,
      appointment: updatedAppointment,
      auditLog: auditEntry,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update appointment status",
      },
      { status: 500 }
    );
  }
}
