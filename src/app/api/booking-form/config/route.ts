import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getBookingFormConfig,
  updateBookingFormConfig,
  resetBookingFormConfig,
} from "@/lib/booking-form-store";

export async function GET() {
  try {
    const config = getBookingFormConfig();
    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("Error fetching booking form config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking form configuration." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check RBAC session: Only ADMIN (Clinic Owner) can alter form structure/fields
    const session = await getServerSession(authOptions);
    if (session?.user && session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: Clinic Owner (Admin) privileges are required to modify website structure and booking form fields. Staff members are restricted to operational views.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (body.action === "reset") {
      const resetConfig = resetBookingFormConfig();
      return NextResponse.json({
        success: true,
        message: "Booking form configuration reset to clinic defaults.",
        config: resetConfig,
      });
    }

    // Validate structure
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid configuration payload." },
        { status: 400 }
      );
    }

    const updatedConfig = updateBookingFormConfig(body);

    return NextResponse.json({
      success: true,
      message: "Booking form configuration updated successfully.",
      config: updatedConfig,
    });
  } catch (error) {
    console.error("Error updating booking form config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking form configuration." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Support both POST and PUT for flexibility
  return PUT(req);
}
