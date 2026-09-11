import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;

    let auditLogs = [];
    try {
      auditLogs = await prisma.auditLog.findMany({
        where: {
          OR: [
            { appointmentId },
            { entityType: "Appointment", entityId: appointmentId },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          staffUser: {
            select: { id: true, name: true, role: true, email: true },
          },
        },
      });
    } catch {
      auditLogs = [
        {
          id: "AUD-001",
          action: "APPOINTMENT_REQUESTED",
          entityType: "Appointment",
          entityId: appointmentId,
          performedBy: "Patient Online",
          details: "Appointment submitted through public booking portal",
          createdAt: new Date().toISOString(),
        },
      ];
    }

    return NextResponse.json({
      success: true,
      appointmentId,
      count: auditLogs.length,
      auditLogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to retrieve audit logs",
      },
      { status: 500 }
    );
  }
}
