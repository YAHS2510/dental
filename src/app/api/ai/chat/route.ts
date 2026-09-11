import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  getClinicKnowledge,
  buildSystemPrompt,
  generateFallbackResponse,
  isEmergencyQuery,
  isMedicalAdviceQuery,
} from "@/lib/clinic-knowledge";

const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long"),
  sessionId: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

// Rate limit: 10 messages per 60 seconds per IP
const CHAT_RATE_LIMIT = { limit: 10, windowMs: 60000 };

export async function POST(req: NextRequest) {
  try {
    // 1. Sliding-Window Rate Limiting
    const ip = getClientIp(req);
    const rateLimitCheck = rateLimit(`ai-chat:${ip}`, CHAT_RATE_LIMIT);

    if (!rateLimitCheck.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have sent too many messages. Please wait a moment before trying again.",
          retryAfterSeconds: rateLimitCheck.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitCheck.resetSeconds),
            "X-RateLimit-Limit": String(rateLimitCheck.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Input Validation
    const body = await req.json();
    const parseResult = chatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid chat payload",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { message, sessionId: providedSessionId, history } = parseResult.data;

    // 3. Dynamic Knowledge Aggregation from DB & Config
    const clinicKnowledge = await getClinicKnowledge();
    const systemPrompt = buildSystemPrompt(clinicKnowledge);

    // 4. Clinical Safety & Emergency Detection
    const emergencyDetected = isEmergencyQuery(message);
    const medicalAdviceDetected = isMedicalAdviceQuery(message);
    let flagged = emergencyDetected || medicalAdviceDetected;

    let assistantReply = "";

    // 5. LLM Execution (Claude API via Anthropic Messages API or Grounded Engine)
    const anthropicKey =
      process.env.ANTHROPIC_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.CLAUDE_API_KEY;

    let usedClaudeApi = false;

    if (anthropicKey && !emergencyDetected) {
      try {
        const conversationMessages = [
          ...history.slice(-6).map((h) => ({
            role: h.role,
            content: h.content,
          })),
          { role: "user" as const, content: message },
        ];

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: process.env.AI_MODEL?.includes("claude")
              ? process.env.AI_MODEL
              : "claude-3-5-sonnet-20241022",
            max_tokens: 500,
            system: systemPrompt,
            messages: conversationMessages,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.content && data.content[0]?.text) {
            assistantReply = data.content[0].text;
            usedClaudeApi = true;
          }
        }
      } catch {
        // Fallback to grounded engine if external call fails
      }
    }

    // Fallback if Claude API was not called or was unavailable
    if (!assistantReply) {
      const fallbackResult = generateFallbackResponse(message, clinicKnowledge);
      assistantReply = fallbackResult.reply;
      flagged = flagged || fallbackResult.flagged;
    }

    // Additional check on assistant reply for medical safety
    if (
      assistantReply.toLowerCase().includes("emergency") ||
      assistantReply.toLowerCase().includes("911") ||
      assistantReply.toLowerCase().includes("cannot provide medical")
    ) {
      flagged = true;
    }

    // 6. Persistence: Store Chat Transcript for Quality Auditing
    let activeSessionId = providedSessionId;

    try {
      let clinic = await prisma.clinic.findFirst();

      if (!activeSessionId) {
        const newSession = await prisma.chatSession.create({
          data: {
            clinicId: clinic?.id,
            visitorId: ip,
            status: flagged ? "ESCALATED" : "ACTIVE",
          },
        });
        activeSessionId = newSession.id;
      } else {
        const existingSession = await prisma.chatSession.findUnique({
          where: { id: activeSessionId },
        });

        if (!existingSession) {
          const newSession = await prisma.chatSession.create({
            data: {
              id: activeSessionId,
              clinicId: clinic?.id,
              visitorId: ip,
              status: flagged ? "ESCALATED" : "ACTIVE",
            },
          });
          activeSessionId = newSession.id;
        } else if (flagged && existingSession.status !== "ESCALATED") {
          await prisma.chatSession.update({
            where: { id: activeSessionId },
            data: { status: "ESCALATED" },
          });
        }
      }

      // Record User Message
      await prisma.chatMessage.create({
        data: {
          sessionId: activeSessionId,
          role: "user",
          content: message,
          flagged: emergencyDetected || medicalAdviceDetected,
        },
      });

      // Record Assistant Message
      await prisma.chatMessage.create({
        data: {
          sessionId: activeSessionId,
          role: "assistant",
          content: assistantReply,
          flagged,
        },
      });
    } catch {
      // In dev fallback / in-memory session if database is unavailable
      if (!activeSessionId) {
        activeSessionId = `sess-${Date.now()}`;
      }
    }

    // Suggested contextual actions
    const suggestedActions = [];
    if (
      message.toLowerCase().includes("book") ||
      message.toLowerCase().includes("appoint") ||
      message.toLowerCase().includes("schedule") ||
      assistantReply.toLowerCase().includes("/book")
    ) {
      suggestedActions.push({
        label: "Book Appointment Online",
        href: "/book",
      });
    }

    if (
      message.toLowerCase().includes("service") ||
      message.toLowerCase().includes("price") ||
      message.toLowerCase().includes("cost")
    ) {
      suggestedActions.push({
        label: "View Services & Fees",
        href: "/services",
      });
    }

    if (flagged || message.toLowerCase().includes("contact")) {
      suggestedActions.push({ label: "Contact Front Desk", href: "/contact" });
      suggestedActions.push({
        label: "Call (555) 234-5678",
        href: "tel:5552345678",
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: activeSessionId,
      reply: assistantReply,
      flagged,
      usedClaudeApi,
      suggestedActions,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process chat message",
      },
      { status: 500 }
    );
  }
}
