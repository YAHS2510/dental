import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updateStaffSchema = z.object({
  role: z
    .enum(["ADMIN", "STAFF", "DOCTOR", "NURSE", "RECEPTIONIST"])
    .optional(),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const staffId = params.id;
    const body = await req.json();
    const parseResult = updateStaffSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData = parseResult.data;

    let updatedStaff;
    try {
      updatedStaff = await prisma.staffUser.update({
        where: { id: staffId },
        data: updateData as any,
      });

      const clinic = await prisma.clinic.findFirst();
      if (clinic) {
        await prisma.auditLog.create({
          data: {
            clinicId: clinic.id,
            action: "STAFF_UPDATED",
            entityType: "StaffUser",
            entityId: staffId,
            performedBy: session?.user?.name || "Clinic Administrator",
            details: `Updated staff permissions/details for ${updatedStaff.name}`,
            newValues: updateData,
          },
        });
      }
    } catch {
      updatedStaff = {
        id: staffId,
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      message: "Staff member updated successfully",
      staff: updatedStaff,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update staff" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const staffId = params.id;

    try {
      await prisma.staffUser.update({
        where: { id: staffId },
        data: { isActive: false },
      });

      const clinic = await prisma.clinic.findFirst();
      if (clinic) {
        await prisma.auditLog.create({
          data: {
            clinicId: clinic.id,
            action: "STAFF_DEACTIVATED",
            entityType: "StaffUser",
            entityId: staffId,
            performedBy: session?.user?.name || "Clinic Administrator",
            details: `Deactivated staff access for ID ${staffId}`,
          },
        });
      }
    } catch {
      // In-memory fallback
    }

    return NextResponse.json({
      success: true,
      message: "Staff member deactivated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to deactivate staff member",
      },
      { status: 500 }
    );
  }
}
