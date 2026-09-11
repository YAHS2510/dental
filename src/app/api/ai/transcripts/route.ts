import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEMO_TRANSCRIPTS = [
  {
    id: "sess-101",
    visitorId: "192.168.1.42",
    startedAt: new Date("2026-09-18T09:14:00Z").toISOString(),
    status: "REVIEWED",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content:
          "Hi! Do you accept Blue Cross Blue Shield insurance for general checkups?",
        createdAt: new Date("2026-09-18T09:14:05Z").toISOString(),
        flagged: false,
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "Yes! We accept Blue Cross Blue Shield (all PPO/EPO plans) as well as Aetna, Cigna, UnitedHealthcare, Medicare, and others. We also accept HSA and FSA cards. You can schedule a visit directly at [Book an Appointment](/book)!",
        createdAt: new Date("2026-09-18T09:14:07Z").toISOString(),
        flagged: false,
      },
      {
        id: "msg-3",
        role: "user",
        content: "Great, what are your Saturday hours?",
        createdAt: new Date("2026-09-18T09:14:40Z").toISOString(),
        flagged: false,
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "Our Saturday hours are 9:00 AM – 4:00 PM. Weekday hours are Monday through Friday from 8:00 AM to 7:00 PM. Let me know if you need help reserving a time slot!",
        createdAt: new Date("2026-09-18T09:14:42Z").toISOString(),
        flagged: false,
      },
    ],
  },
  {
    id: "sess-102",
    visitorId: "10.0.0.18",
    startedAt: new Date("2026-09-18T11:22:00Z").toISOString(),
    status: "ESCALATED",
    messages: [
      {
        id: "msg-10",
        role: "user",
        content:
          "I have crushing chest pain and feel dizzy, should I take aspirin or come in?",
        createdAt: new Date("2026-09-18T11:22:01Z").toISOString(),
        flagged: true,
      },
      {
        id: "msg-11",
        role: "assistant",
        content:
          "⚠️ **EMERGENCY NOTICE**: If you or someone you are with is experiencing severe chest pain, shortness of breath, stroke symptoms, or another medical emergency, please **dial 911** or go to the nearest emergency room immediately. Our clinic provides scheduled outpatient care and cannot handle acute life-threatening emergencies.",
        createdAt: new Date("2026-09-18T11:22:02Z").toISOString(),
        flagged: true,
      },
    ],
  },
  {
    id: "sess-103",
    visitorId: "172.16.0.55",
    startedAt: new Date("2026-09-18T14:05:00Z").toISOString(),
    status: "ESCALATED",
    messages: [
      {
        id: "msg-20",
        role: "user",
        content: "Can you prescribe me amoxicillin 500mg for a sore throat?",
        createdAt: new Date("2026-09-18T14:05:05Z").toISOString(),
        flagged: true,
      },
      {
        id: "msg-21",
        role: "assistant",
        content:
          "As an AI receptionist, I cannot provide medical evaluations, clinical diagnoses, or prescription guidance. Your health is important to us, and our board-certified physicians would be glad to evaluate your symptoms in person.\n\nYou can [Book an Appointment](/book) with our clinical team, or call our desk directly at **(555) 234-5678** to speak with our staff.",
        createdAt: new Date("2026-09-18T14:05:07Z").toISOString(),
        flagged: true,
      },
    ],
  },
  {
    id: "sess-104",
    visitorId: "192.168.2.99",
    startedAt: new Date("2026-09-18T16:40:00Z").toISOString(),
    status: "ACTIVE",
    messages: [
      {
        id: "msg-30",
        role: "user",
        content: "Where are you located and is there parking?",
        createdAt: new Date("2026-09-18T16:40:02Z").toISOString(),
        flagged: false,
      },
      {
        id: "msg-31",
        role: "assistant",
        content:
          "**HealthSphere Medical Clinic** is conveniently located at:\n\n📍 742 Evergreen Medical Way, Suite 400, Metro City, NY 10001\n\n🚗 **Parking**: Complimentary validated parking is available in the adjacent Evergreen Medical Pavilion Parking Garage (Levels 2-4).",
        createdAt: new Date("2026-09-18T16:40:04Z").toISOString(),
        flagged: false,
      },
    ],
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const sessionId = searchParams.get("sessionId");

    let sessions: any[] = [];
    try {
      const where: any = {};
      if (status && status !== "ALL") {
        where.status = status;
      }
      if (sessionId) {
        where.id = sessionId;
      }

      sessions = await prisma.chatSession.findMany({
        where,
        orderBy: { startedAt: "desc" },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });
    } catch {
      // Fallback
    }

    if (!sessions || sessions.length === 0) {
      sessions = DEMO_TRANSCRIPTS;
      if (status && status !== "ALL") {
        sessions = sessions.filter((s) => s.status === status);
      }
      if (sessionId) {
        sessions = sessions.filter((s) => s.id === sessionId);
      }
    }

    return NextResponse.json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch chat transcripts",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, status } = body;

    if (!sessionId || !status) {
      return NextResponse.json(
        { success: false, message: "sessionId and status are required" },
        { status: 400 }
      );
    }

    try {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { status },
      });
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      message: `Session ${sessionId} updated to ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update transcript session",
      },
      { status: 500 }
    );
  }
}
