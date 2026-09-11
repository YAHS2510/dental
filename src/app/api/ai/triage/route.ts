import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const { symptoms, patientAge, severity } = await req.json();

    if (!symptoms) {
      return NextResponse.json(
        { success: false, message: "Please provide a symptom description" },
        { status: 400 }
      );
    }

    const symptomsText = Array.isArray(symptoms)
      ? symptoms.join(" ")
      : String(symptoms).toLowerCase();

    // AI Clinical Triage Stub / Gemini Integration
    // When an AI_API_KEY is configured in production, call Google Gemini / OpenAI SDK here
    const triageEvaluation = {
      recommendedDepartment:
        symptomsText.includes("chest") || symptomsText.includes("heart")
          ? "Cardiology Department"
          : symptomsText.includes("tooth") || symptomsText.includes("dental")
            ? "Dental Prophylaxis"
            : symptomsText.includes("child") || symptomsText.includes("vaccin")
              ? "Pediatric Medicine"
              : "General Practitioner & Urgent Care",
      urgencyLevel: severity || "Standard",
      guidanceNotes:
        "Please rest, stay hydrated, and bring any current medications to your consultation.",
      modelUsed: env.AI_MODEL,
      aiApiKeyConfigured: Boolean(env.AI_API_KEY),
      disclaimer:
        "This triage analysis is generated for informational pre-screening and does not replace emergency medical care. If experiencing an emergency, dial 911 immediately.",
    };

    return NextResponse.json({
      success: true,
      triage: triageEvaluation,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to analyze symptoms",
      },
      { status: 500 }
    );
  }
}
