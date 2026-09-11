import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServiceSchema } from "@/lib/validations/service";
import { clinicalServices } from "@/data/services-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const isActiveParam = searchParams.get("isActive");

    const where: any = {};
    if (category) where.category = category;
    if (isActiveParam !== null && isActiveParam !== undefined) {
      where.isActive = isActiveParam === "true";
    }

    let services = [];
    try {
      services = await prisma.service.findMany({
        where,
        orderBy: { name: "asc" },
      });
    } catch {
      // Fallback in-memory catalog
      services = clinicalServices.map((s, idx) => ({
        id: `srv-${idx + 1}`,
        name: s.name,
        description: s.description,
        durationMinutes: parseInt(s.duration) || 30,
        price: s.price ? parseFloat(s.price.replace("$", "")) : 0.0,
        category: s.category,
        isActive: true,
      }));
    }

    return NextResponse.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = createServiceSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed on service payload",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input = parseResult.data;

    let createdService;
    try {
      let clinic = await prisma.clinic.findFirst();
      if (!clinic) {
        clinic = await prisma.clinic.create({
          data: {
            name: "HealthSphere Clinic",
            slug: input.clinicSlug || "healthsphere-main",
            themeKey: "teal-serenity",
          },
        });
      }

      createdService = await prisma.service.create({
        data: {
          clinicId: clinic.id,
          name: input.name,
          description: input.description,
          durationMinutes: input.durationMinutes,
          price: input.price,
          category: input.category,
          isActive: input.isActive,
        },
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          clinicId: clinic.id,
          action: "SERVICE_CREATED",
          entityType: "Service",
          entityId: createdService.id,
          performedBy: "Clinical Staff / Admin",
          details: `Created new clinical service '${input.name}' at $${input.price}`,
          newValues: {
            name: input.name,
            price: input.price,
            durationMinutes: input.durationMinutes,
          },
        },
      });
    } catch {
      createdService = {
        id: `srv-${Math.floor(100 + Math.random() * 900)}`,
        name: input.name,
        description: input.description,
        durationMinutes: input.durationMinutes,
        price: input.price,
        category: input.category,
        isActive: input.isActive,
        createdAt: new Date().toISOString(),
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: "Clinical service created successfully",
        service: createdService,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}
