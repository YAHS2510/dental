import prisma from "@/lib/prisma";
import { clinicalServices } from "@/data/services-data";

export interface ClinicKnowledgeData {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  parking: string;
  insurancesAccepted: string[];
  paymentMethods: string[];
  bookingPolicy: string;
  cancellationPolicy: string;
  whatToBring: string[];
  services: Array<{
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    category: string;
    description?: string;
  }>;
}

export async function getClinicKnowledge(): Promise<ClinicKnowledgeData> {
  let dbServices: Array<{
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    category: string;
    description?: string;
  }> = [];

  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    if (services && services.length > 0) {
      dbServices = services.map((s) => ({
        id: s.id,
        name: s.name,
        price: Number(s.price),
        durationMinutes: s.durationMinutes,
        category: s.category || "General Care",
        description: s.description || undefined,
      }));
    }
  } catch {
    // Database fallback
  }

  if (dbServices.length === 0) {
    dbServices = clinicalServices.map((s, idx) => ({
      id: `srv-${idx + 1}`,
      name: s.name,
      price: s.price ? parseFloat(s.price.replace("$", "")) : 0.0,
      durationMinutes: parseInt(s.duration) || 30,
      category: s.category,
      description: s.description,
    }));
  }

  return {
    clinicName: "HealthSphere Medical Clinic",
    address: "742 Evergreen Medical Way, Suite 400, Metro City, NY 10001",
    phone: "(555) 234-5678",
    email: "contact@healthsphere.example.com",
    hours: {
      weekdays: "Monday – Friday: 8:00 AM – 7:00 PM",
      saturday: "Saturday: 9:00 AM – 4:00 PM",
      sunday: "Sunday: 10:00 AM – 2:00 PM (Acute Urgent Care Only)",
    },
    parking:
      "Complimentary validated parking is available in the adjacent Evergreen Medical Pavilion Parking Garage (Levels 2-4).",
    insurancesAccepted: [
      "Blue Cross Blue Shield (all PPO/EPO plans)",
      "Aetna (Choice POS II, Select, Medicare Advantage)",
      "Cigna (Open Access Plus, PPO)",
      "UnitedHealthcare (Choice Plus, Navigate, Medicare Complete)",
      "Medicare Part B",
      "Humana PPO",
      "Oscar Health",
      "Oxford Health Plans",
      "Out-of-Network: Superbills provided for direct reimbursement (e.g. Kaiser PPO)",
    ],
    paymentMethods: [
      "Major Credit/Debit Cards (Visa, MasterCard, Amex, Discover)",
      "Health Savings Account (HSA) cards",
      "Flexible Spending Account (FSA) cards",
      "Cash / Apple Pay / Google Pay",
      "Transparent self-pay rates with zero surprise facility fees",
    ],
    bookingPolicy:
      "Patients can book appointments 24/7 online at /book. Walk-ins are also accepted based on daily triage availability.",
    cancellationPolicy:
      "We kindly request at least 24 hours notice for cancellations or rescheduling to avoid a $35 late-cancellation fee.",
    whatToBring: [
      "Government-issued photo identification (Driver's License or Passport)",
      "Primary and secondary insurance card(s)",
      "Current medication list including dosages and supplements",
      "Any recent external lab work or imaging reports if seeing a specialist",
    ],
    services: dbServices,
  };
}

export function buildSystemPrompt(clinic: ClinicKnowledgeData): string {
  const serviceListFormatted = clinic.services
    .map(
      (s) =>
        `- ${s.name} (${s.category}) | Duration: ${s.durationMinutes} mins${
          s.description ? ` | ${s.description}` : ""
        }`
    )
    .join("\n");

  const insuranceListFormatted = clinic.insurancesAccepted
    .map((ins) => `• ${ins}`)
    .join("\n");

  return `You are the AI Front-Desk Receptionist for ${clinic.clinicName}.
Your persona is warm, polite, professional, and efficient.
You ONLY answer practical/logistics questions: clinic operating hours, location/parking, how to book, services offered, doctors, insurance/billing policies.

CRITICAL PRICING GUIDELINE:
Do NOT quote specific dollar amounts or prices. If asked about cost or fees, explain that consultation fees and treatment plans are tailored to each patient's individual clinical evaluation and will be clearly provided during the appointment. Direct them to book online or call the clinic desk.

=== STRICT CLINICAL AND ETHICAL SAFETY RULES ===
1. ABSOLUTELY NO MEDICAL DIAGNOSES OR ADVICE:
   - You are an administrative receptionist, NOT a physician or triage nurse.
   - NEVER suggest a diagnosis, interpret symptoms, evaluate test results, or recommend treatments or drug dosages.
   - If a user asks for medical advice (e.g. "Do I have pneumonia?", "Should I take antibiotics for my sore throat?", "What is this rash?"):
     Politely refuse: "As an AI receptionist, I am not qualified to provide medical diagnoses or clinical advice. Our physicians would be happy to examine you in person. Would you like to schedule an appointment online or speak with our front desk?"
2. RED-FLAG EMERGENCY PROTOCOL:
   - If the user describes life-threatening or acute symptoms (severe chest pain, difficulty breathing, stroke symptoms such as facial droop or arm weakness, severe trauma, uncontrollable bleeding, or suicidal thoughts):
     Immediately respond with:
     "⚠️ EMERGENCY NOTICE: If you or someone you are with is experiencing a medical emergency, please dial 911 or proceed immediately to the nearest hospital emergency room. Do not wait for an appointment."
3. OUT OF SCOPE & UNCERTAINTY:
   - If a question cannot be confidently answered using the clinic data below, DO NOT GUESS OR HALLUCINATE.
   - Direct the user to contact the clinic team via the contact form ([Contact Form](/contact)) or by phone at ${clinic.phone}.
4. HELPFUL LOGISTICS:
   - Answer all questions regarding clinic hours, location, parking, accepted insurance plans, payment methods, fees, service duration, and appointment booking.
   - Use Markdown links when referencing clinic pages: [Book Appointment](/book), [Our Services](/services), [Contact Us](/contact).

=== AUTHORITATIVE CLINIC INFORMATION ===
- Clinic Name: ${clinic.clinicName}
- Physical Address: ${clinic.address}
- Main Telephone: ${clinic.phone}
- Clinic Email: ${clinic.email}
- Operating Hours:
  * ${clinic.hours.weekdays}
  * ${clinic.hours.saturday}
  * ${clinic.hours.sunday}
- Parking: ${clinic.parking}
- Booking Policy: ${clinic.bookingPolicy}
- Cancellation Policy: ${clinic.cancellationPolicy}
- What to Bring:
${clinic.whatToBring.map((i) => `  * ${i}`).join("\n")}

=== ACCEPTED INSURANCE PLANS ===
${insuranceListFormatted}

=== PAYMENT & SELF-PAY OPTIONS ===
${clinic.paymentMethods.map((p) => `• ${p}`).join("\n")}

=== CLINICAL SERVICES & PRICING CATALOG ===
${serviceListFormatted}
`;
}

/**
 * Emergency keyword detector to reliably tag flagged messages
 */
export function isEmergencyQuery(text: string): boolean {
  const query = text.toLowerCase();
  const emergencyKeywords = [
    "chest pain",
    "heart attack",
    "can't breathe",
    "cannot breathe",
    "shortness of breath",
    "stroke",
    "facial droop",
    "slurred speech",
    "unconscious",
    "heavy bleeding",
    "overdose",
    "suicid",
    "anaphylax",
    "choking",
  ];
  return emergencyKeywords.some((k) => query.includes(k));
}

/**
 * Clinical advice detector to flag attempts to seek medical diagnosis
 */
export function isMedicalAdviceQuery(text: string): boolean {
  const query = text.toLowerCase();
  const advicePatterns = [
    "do i have",
    "should i take",
    "what medicine",
    "how much mg",
    "prescribe me",
    "is this cancerous",
    "diagnose me",
    "what does this symptom mean",
    "am i sick",
    "what disease",
  ];
  return advicePatterns.some((p) => query.includes(p));
}

/**
 * Deterministic fallback response engine when Claude API key is not configured or during offline dev
 */
export function generateFallbackResponse(
  userQuery: string,
  clinic: ClinicKnowledgeData
): { reply: string; flagged: boolean } {
  const query = userQuery.toLowerCase().trim();

  // 1. Emergency Check
  if (isEmergencyQuery(query)) {
    return {
      reply: `⚠️ **EMERGENCY NOTICE**: If you or someone you are with is experiencing severe chest pain, shortness of breath, stroke symptoms, or another medical emergency, please **dial 911** or go to the nearest emergency room immediately. Our clinic provides scheduled outpatient care and cannot handle acute life-threatening emergencies.`,
      flagged: true,
    };
  }

  // 2. Medical Diagnosis / Prescription Request Check
  if (isMedicalAdviceQuery(query)) {
    return {
      reply: `As an AI receptionist, I cannot provide medical evaluations, clinical diagnoses, or prescription guidance. Your health is important to us, and our board-certified physicians would be glad to evaluate your symptoms in person.\n\nYou can [Book an Appointment](/book) with our clinical team, or call our desk directly at **${clinic.phone}** to speak with our staff.`,
      flagged: true,
    };
  }

  // 3. Hours Inquiry
  if (
    query.includes("hour") ||
    query.includes("open") ||
    query.includes("close") ||
    query.includes("weekend") ||
    query.includes("sunday") ||
    query.includes("saturday") ||
    query.includes("time")
  ) {
    return {
      reply: `Here are our regular operating hours at **${clinic.clinicName}**:\n\n• **${clinic.hours.weekdays}**\n• **${clinic.hours.saturday}**\n• **${clinic.hours.sunday}**\n\nYou can schedule an appointment online anytime at [Book an Appointment](/book).`,
      flagged: false,
    };
  }

  // 4. Insurance Inquiry
  if (
    query.includes("insurance") ||
    query.includes("blue cross") ||
    query.includes("aetna") ||
    query.includes("cigna") ||
    query.includes("united") ||
    query.includes("medicare") ||
    query.includes("humana") ||
    query.includes("coverage")
  ) {
    const list = clinic.insurancesAccepted.slice(0, 6).join("\n• ");
    return {
      reply: `We accept most major insurance carriers, including:\n\n• ${list}\n• And several others.\n\nWe also accept HSA and FSA cards. If you have an out-of-network plan, we provide itemized superbills for direct insurer reimbursement. For specific plan eligibility, feel free to submit an inquiry through our [Contact Form](/contact) or call **${clinic.phone}**.`,
      flagged: false,
    };
  }

  // 5. Location / Address / Parking
  if (
    query.includes("address") ||
    query.includes("where") ||
    query.includes("location") ||
    query.includes("directions") ||
    query.includes("park")
  ) {
    return {
      reply: `**${clinic.clinicName}** is conveniently located at:\n\n📍 **${clinic.address}**\n\n🚗 **Parking**: ${clinic.parking}\n\nFeel free to call us at **${clinic.phone}** if you need navigation assistance!`,
      flagged: false,
    };
  }

  // 6. Pricing / Services / Cost
  if (
    query.includes("cost") ||
    query.includes("price") ||
    query.includes("fee") ||
    query.includes("service") ||
    query.includes("cardiology") ||
    query.includes("dental") ||
    query.includes("pediatric") ||
    query.includes("checkup") ||
    query.includes("physical")
  ) {
    // Find matching service
    const matching = clinic.services.find(
      (s) =>
        query.includes(s.name.toLowerCase()) ||
        query.includes(s.category.toLowerCase())
    );

    if (matching) {
      return {
        reply: `Our **${matching.name}** (${matching.category}) includes a dedicated ${matching.durationMinutes}-minute clinical evaluation.\n\n${
          matching.description ? matching.description + "\n\n" : ""
        }Specific treatment fees are determined following your initial in-person clinical assessment. You can reserve your preferred slot directly at [Book an Appointment](/book) or call our desk at (555) 234-5678.`,
        flagged: false,
      };
    }

    const popularServices = clinic.services
      .slice(0, 4)
      .map((s) => `• **${s.name}** (${s.durationMinutes} mins)`)
      .join("\n");

    return {
      reply: `Here are our common clinical consultation offerings:\n\n${popularServices}\n\nSpecific treatment plans and fees are tailored to each patient during clinical examination. You can explore full service details on [Our Services Page](/services) or reserve your visit directly at [Book an Appointment](/book).`,
      flagged: false,
    };
  }

  // 7. Booking / Appointment
  if (
    query.includes("book") ||
    query.includes("appointment") ||
    query.includes("schedule") ||
    query.includes("reserve") ||
    query.includes("walk in") ||
    query.includes("see a doctor")
  ) {
    return {
      reply: `Booking an appointment is fast and easy! You can reserve your preferred provider and time slot 24/7 on our online scheduler:\n\n👉 [Book an Appointment Online](/book)\n\nAlternatively, you can call our front desk at **${clinic.phone}** during clinic hours. Same-day urgent care appointments are also available.`,
      flagged: false,
    };
  }

  // 8. Default Friendly Fallback
  return {
    reply: `Hello! I am the AI Front-Desk Receptionist at **${clinic.clinicName}**. I can help answer questions about our clinic hours, location, parking, accepted insurance plans, consultation fees, and how to [Book an Appointment](/book).\n\nIf you have a specific clinical question or would like to speak with our staff directly, please reach us at **${clinic.phone}** or send a message via our [Contact Form](/contact). How may I assist you today?`,
    flagged: false,
  };
}
