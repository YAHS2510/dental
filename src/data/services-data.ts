export interface ClinicalService {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  duration: string;
  price?: string;
  leadSpecialist: string;
  indications: string[];
  whatToExpect: string[];
  preparation: string[];
  faqs: { question: string; answer: string }[];
}

export const clinicalServices: ClinicalService[] = [
  {
    slug: "general-consultation",
    name: "General Practitioner Consultation",
    category: "Primary Care",
    summary:
      "Routine checkups, physicals, preventive diagnostics, and chronic care management.",
    description:
      "Our general practitioner consultation offers a thorough, patient-first examination for individuals of all ages. Whether addressing acute illness symptoms, updating prescriptions, or establishing an annual health baseline, our board-certified family physicians provide attentive, evidence-based care.",
    duration: "30 mins",
    leadSpecialist: "Dr. Sarah Vance, MD (Chief Medical Officer)",
    indications: [
      "Annual physical exams & health screening",
      "Acute illnesses (fever, cough, infections, stomach distress)",
      "Prescription management & lab renewals",
      "Chronic condition monitoring (hypertension, mild asthma)",
    ],
    whatToExpect: [
      "Comprehensive vitals evaluation (blood pressure, oxygen saturation, heart rate)",
      "Focused medical history and lifestyle review",
      "Physical examination tailored to your primary concerns",
      "Digital treatment summary and instant prescription transmission",
    ],
    preparation: [
      "Bring a current list of all prescriptions and dietary supplements",
      "Have previous bloodwork or relevant specialist reports handy if available",
      "Arrive 10 minutes prior to complete any intake updates",
    ],
    faqs: [
      {
        question: "Can I receive lab referrals during this consultation?",
        answer:
          "Yes, our doctors can write immediate digital orders for our on-site lab or your preferred diagnostic center.",
      },
      {
        question: "Is this consultation available via telehealth?",
        answer:
          "Yes, follow-up consultations and prescription reviews can be conducted via our secure patient portal.",
      },
    ],
  },
  {
    slug: "cardiology-diagnostic-panel",
    name: "Comprehensive Cardiology Diagnostic Panel",
    category: "Specialty Care",
    summary:
      "Resting 12-lead ECG, cardiovascular risk profiling, and specialist physician review.",
    description:
      "Our specialized cardiology assessment evaluates cardiovascular performance, detects early signs of coronary artery disease, and manages hypertensive disorders using gold-standard non-invasive diagnostics.",
    duration: "45 mins",
    leadSpecialist: "Dr. Marcus Chen, MD, FACC (Lead Cardiologist)",
    indications: [
      "Chest discomfort, palpitations, or shortness of breath",
      "Family history of early cardiovascular disease or heart attacks",
      "Hypertension (high blood pressure) and hyperlipidemia management",
      "Pre-operative clearance evaluations",
    ],
    whatToExpect: [
      "High-resolution 12-lead electrocardiogram (ECG)",
      "Aortic and peripheral vascular blood pressure screening",
      "Lipid panel review and Framingham 10-year risk index calculation",
      "Direct consultation with our board-certified cardiologist",
    ],
    preparation: [
      "Wear comfortable, loose two-piece clothing for electrode placement",
      "Avoid caffeine and energy drinks for 4 hours prior to the ECG",
      "Continue taking standard blood pressure medications unless instructed otherwise",
    ],
    faqs: [
      {
        question: "Does the ECG test cause any pain?",
        answer:
          "No, the resting 12-lead ECG is completely non-invasive, painless, and completed in under 10 minutes.",
      },
      {
        question: "When will I receive my diagnostic report?",
        answer:
          "Your initial results and physician interpretation are discussed during the same visit, with a detailed PDF uploaded to your patient chart.",
      },
    ],
  },
  {
    slug: "pediatric-wellness-vaccination",
    name: "Pediatric Wellness & Immunization Clinic",
    category: "Pediatrics",
    summary:
      "Developmental milestone assessments, CDC-compliant immunizations, and gentle child care.",
    description:
      "Our pediatric wellness visits are designed to keep infants, children, and adolescents thriving. We track growth trajectories, administer required immunizations in a comforting environment, and support parents with actionable nutritional and behavioral guidance.",
    duration: "40 mins",
    leadSpecialist: "Dr. Elena Rostova, MD (Pediatric Specialist)",
    indications: [
      "Well-child checks from newborn to age 18",
      "State-mandated school, daycare, and sports physicals",
      "CDC and AAP immunization schedules",
      "Nutritional, sleep, and early developmental screening",
    ],
    whatToExpect: [
      "Gentle weight, height, and head circumference charting",
      "Sensory vision and hearing checks for school readiness",
      "Age-appropriate developmental assessment",
      "Painless vaccine administration with child-friendly distractions",
    ],
    preparation: [
      "Bring your child's official state yellow immunization card or previous vaccine records",
      "Write down any feeding, sleep, or developmental questions in advance",
      "Bring a favorite toy or comfort blanket for younger toddlers",
    ],
    faqs: [
      {
        question:
          "Do you sign school and sports participation forms on the same day?",
        answer:
          "Yes, our staff will sign and stamp all required school athletic and camp physical forms during the visit.",
      },
      {
        question: "What if my child has a fear of needles?",
        answer:
          "Our pediatric nurses use cooling numbing sprays, distraction tools, and compassionate techniques to make the experience stress-free.",
      },
    ],
  },
  {
    slug: "neurology-migraine-care",
    name: "Neurology & Chronic Headache Management",
    category: "Specialty Care",
    summary:
      "Targeted diagnosis and therapeutic plans for chronic migraines, tension headaches, and neuropathy.",
    description:
      "Headache disorders and neuropathic symptoms significantly impact quality of life. Our neurology clinic provides detailed neurological exams, triggers analysis, and modern preventive therapeutic regimens tailored to your symptoms.",
    duration: "60 mins",
    leadSpecialist: "Dr. Sarah Vance, MD & Consulting Neurologists",
    indications: [
      "Frequent or debilitating migraines and cluster headaches",
      "Tension headaches unresponsive to over-the-counter therapy",
      "Peripheral numbness, tingling, or nerve pain",
      "Sleep disruptions and cognitive fog",
    ],
    whatToExpect: [
      "Comprehensive cranial nerve and reflex examination",
      "Symptom frequency and lifestyle trigger mapping",
      "Review of MRI/CT imaging or referrals if indicated",
      "Customized acute and preventive medication management plan",
    ],
    preparation: [
      "Keep a 2-week headache diary noting frequency, duration, and food/stress triggers",
      "Bring any previous CT scan or MRI brain imaging reports on a disc or portal link",
    ],
    faqs: [
      {
        question: "Do you prescribe modern CGRP migraine medications?",
        answer:
          "Yes, our clinical specialists evaluate patients for modern CGRP inhibitors, acute triptans, and preventive protocols.",
      },
    ],
  },
  {
    slug: "dental-prophylaxis-hygiene",
    name: "Comprehensive Dental Prophylaxis & Examination",
    category: "Dental Care",
    summary:
      "Ultrasonic scaling, enamel polishing, digital x-rays, and periodontal gum screening.",
    description:
      "Oral hygiene is an essential pillar of overall systemic health. Our gentle dental clinic provides advanced ultrasonic cleaning, low-radiation digital radiography, and periodontal charting in a relaxing clinical environment.",
    duration: "45 mins",
    leadSpecialist: "Dr. David Kim, DDS (Director of Dental Medicine)",
    indications: [
      "Bi-annual dental hygiene and plaque removal",
      "Bleeding gums, gingivitis, and periodontal prevention",
      "Enamel staining and surface discoloration",
      "Routine digital bitewing cavity detection",
    ],
    whatToExpect: [
      "Ultrasonic tartar removal and precision interdental scaling",
      "Enamel fluoride application and micro-abrasive polishing",
      "Digital low-radiation dental x-rays",
      "Periodontal pocket depth mapping and personalized oral hygiene advice",
    ],
    preparation: [
      "Brush and floss normally before arriving",
      "Inform the hygienist if you experience sensitive teeth or dental anxiety",
    ],
    faqs: [
      {
        question: "Is ultrasonic scaling safe for sensitive teeth?",
        answer:
          "Yes, ultrasonic water-cooled instruments are gentle and can be adjusted with topical numbing gel if you have tooth sensitivity.",
      },
    ],
  },
  {
    slug: "executive-health-concierge",
    name: "Executive Whole-Body Health Concierge",
    category: "Premium Wellness",
    summary:
      "Advanced biomarker profiling, full biometrics, and a 1-on-1 longevity physician review.",
    description:
      "A comprehensive, proactive health examination designed for executives, athletes, and individuals seeking in-depth biological profiling. Includes extended lab panels, cardiovascular biometrics, metabolic analysis, and direct clinical follow-up.",
    duration: "90 mins",
    leadSpecialist: "Multidisciplinary Clinical Board",
    indications: [
      "Comprehensive baseline biological evaluation",
      "Metabolic health, insulin resistance, and longevity profiling",
      "Cardiovascular biomarker screening (ApoB, hs-CRP, Homocysteine)",
      "Personalized preventive health roadmaps",
    ],
    whatToExpect: [
      "Comprehensive 60+ marker diagnostic blood and metabolic panel",
      "Resting ECG, spirometry lung function, and body composition analysis",
      "Extended 60-minute physician consultation",
      "Personalized 25-page Health Longevity Roadmap",
    ],
    preparation: [
      "Requires a 10-hour overnight fast for accurate fasting glucose and lipid biomarkers",
      "Water is permitted and encouraged before arrival",
    ],
    faqs: [
      {
        question: "How long until I receive the executive report?",
        answer:
          "Your consolidated Longevity Report is prepared within 48 hours following lab processing.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ClinicalService | undefined {
  return clinicalServices.find((s) => s.slug === slug);
}
