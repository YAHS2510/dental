import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, department, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide your name, email, and message.",
        },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // In production, dispatch notification via Resend/SendGrid using EMAIL_API_KEY
    const referenceId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json(
      {
        success: true,
        referenceId,
        message:
          "Thank you for reaching out. Our clinical coordinator will respond within 24 business hours.",
        received: {
          name,
          email,
          phone: phone || "Not provided",
          department: department || "General Patient Inquiries",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process inquiry.",
      },
      { status: 500 }
    );
  }
}
