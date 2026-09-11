import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "HealthSphere Clinic Platform API",
    version: "1.0.0",
    environment: {
      databaseConfigured: Boolean(env.DATABASE_URL),
      emailProviderConfigured: Boolean(env.EMAIL_API_KEY),
      aiProviderConfigured: Boolean(env.AI_API_KEY),
      defaultClinicSlug: env.NEXT_PUBLIC_DEFAULT_CLINIC_SLUG,
      defaultTheme: env.NEXT_PUBLIC_DEFAULT_THEME,
    },
    uptimeSeconds: Math.floor(process.uptime()),
  };

  return NextResponse.json(healthData, { status: 200 });
}
