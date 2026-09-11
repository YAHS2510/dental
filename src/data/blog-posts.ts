export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role: string;
    credentials: string;
  };
  tags: string[];
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "preventive-cardiology-guide",
    title:
      "Preventive Cardiology: 5 Vital Biomarkers Beyond Standard Cholesterol",
    summary:
      "Why traditional total cholesterol panels alone miss half of early cardiovascular risks, and how advanced ApoB, hs-CRP, and Lp(a) testing protects your arterial health.",
    publishedAt: "September 8, 2026",
    readTime: "6 min read",
    category: "Cardiology",
    author: {
      name: "Dr. Marcus Chen, MD, FACC",
      role: "Lead Cardiologist",
      credentials: "Johns Hopkins • Fellow American College of Cardiology",
    },
    tags: ["Heart Health", "Biomarkers", "Preventive Medicine", "Cardiology"],
    content: [
      "For decades, the standard medical baseline for evaluating heart disease risk was simple: measure total cholesterol, calculate LDL-C ('bad cholesterol') and HDL-C ('good cholesterol'), and prescribe interventions if the LDL number was elevated.",
      "However, extensive clinical research from the American College of Cardiology and European Society of Cardiology has proven that up to 50% of heart attacks occur in individuals with 'normal' standard cholesterol levels. To truly prevent vascular disease before symptoms arise, modern clinicians look deeper into specialized atherogenic particles.",
      "1. Apolipoprotein B (ApoB): Each plaque-forming particle in your bloodstream—whether LDL, VLDL, or IDL—carries exactly one molecule of ApoB. Measuring ApoB provides an exact count of arterial particles rather than just the cholesterol mass within them.",
      "2. High-Sensitivity C-Reactive Protein (hs-CRP): Atherosclerosis is fundamentally an inflammatory process. Elevated hs-CRP indicates systemic arterial vascular inflammation, helping doctors gauge plaque vulnerability.",
      "3. Lipoprotein(a) [Lp(a)]: A largely genetic variant of LDL with an added apolipoprotein(a) tail that accelerates clot formation. Testing Lp(a) even once in adulthood identifies inherited cardiovascular risk early.",
      "4. Coronary Artery Calcium (CAC) Scoring: A quick, low-radiation non-contrast CT scan that measures the actual presence of calcified plaque inside the coronary arteries, replacing statistical guesses with direct visualization.",
      "5. Fasting Insulin and HOMA-IR: Insulin resistance damages the fragile vascular endothelium long before blood glucose registers as prediabetic. Maintaining optimal insulin sensitivity preserves arterial compliance.",
      "Takeaway: If your family has a history of early heart disease, or you want a thorough vascular audit, schedule a Comprehensive Cardiology Panel to evaluate these modern biomarkers.",
    ],
  },
  {
    slug: "pediatric-vaccine-schedule-guide",
    title:
      "The Modern Pediatric Vaccine Schedule: An Evidence-Based Guide for Parents",
    summary:
      "A pediatric specialist explains how scheduled childhood immunizations work synergistically to build lifelong immune defenses safely and gently.",
    publishedAt: "September 4, 2026",
    readTime: "5 min read",
    category: "Pediatrics",
    author: {
      name: "Dr. Elena Rostova, MD",
      role: "Pediatric Specialist",
      credentials: "Stanford University School of Medicine",
    },
    tags: ["Pediatrics", "Immunizations", "Child Health", "Parenting"],
    content: [
      "Welcoming a new child brings joy, excitement, and inevitable questions about preventive care. Among the most frequent questions parents bring to our pediatric clinic is how the recommended childhood vaccine schedule protects developing immune systems.",
      "Childhood immunizations are carefully timed based on when a baby's maternal antibodies begin to decline and when their own immune system can mount the most robust, long-lasting defense against severe pathogens.",
      "Key Milestones: From birth to 18 months, routine vaccines protect infants against potentially severe respiratory and systemic illnesses including Pertussis (whooping cough), Haemophilus influenzae type b (Hib), Streptococcus pneumoniae, and Measles.",
      "Addressing Common Parent Concerns: Modern vaccines contain far fewer immunological antigens than vaccines from decades ago, despite protecting against twice as many diseases. The infant immune system safely encounters thousands of antigens daily in the environment.",
      "Gentle Clinic Experience: At HealthSphere, our pediatric team utilizes topical cooling sprays, comfort nursing techniques, and gentle bedside pacing so your child's visit remains positive, calm, and reassuring.",
    ],
  },
  {
    slug: "understanding-chronic-migraines",
    title:
      "Understanding Chronic Migraines: Beyond Over-The-Counter Painkillers",
    summary:
      "Discover the neurobiology of migraine disorders, common environmental triggers, and the revolutionary rise of targeted CGRP preventive therapies.",
    publishedAt: "August 28, 2026",
    readTime: "7 min read",
    category: "Neurology",
    author: {
      name: "Dr. Sarah Vance, MD",
      role: "Chief Medical Officer",
      credentials: "Harvard Medical School",
    },
    tags: ["Neurology", "Migraines", "Headache Relief", "Chronic Pain"],
    content: [
      "A migraine is not simply a bad headache; it is a complex, genetically influenced neurological condition characterized by waves of abnormal neuronal activity across the brain stem and trigeminal sensory system.",
      "The Role of CGRP: In recent years, neurological research identified Calcitonin Gene-Related Peptide (CGRP) as a key molecule released during migraine attacks that induces severe vasodilation and neurogenic inflammation. The development of targeted anti-CGRP medications has transformed migraine prevention.",
      "Identifying Threshold Triggers: Migraines rarely stem from a single trigger in isolation. Rather, triggers compound—such as poor sleep, dehydration, hormonal shifts, and blue light exposure combining to exceed a patient's neurological threshold.",
      "When to Seek Clinical Evaluation: If you experience headaches on more than 4 days per month, rely frequently on over-the-counter NSAIDs (which can cause medication-overuse headaches), or suffer from aura symptoms, a specialized neurological consultation can restore your quality of life.",
    ],
  },
  {
    slug: "oral-systemic-health-connection",
    title:
      "The Mouth-Body Connection: How Periodontal Health Directly Impacts Longevity",
    summary:
      "Why dentists and cardiologists now work together: exploring the direct biological link between oral bacteria, chronic systemic inflammation, and vascular disease.",
    publishedAt: "August 20, 2026",
    readTime: "5 min read",
    category: "Dental Health",
    author: {
      name: "Dr. David Kim, DDS",
      role: "Director of Dental Surgery",
      credentials: "Columbia University Dental Medicine",
    },
    tags: [
      "Dental Health",
      "Preventive Care",
      "Cardiovascular",
      "Systemic Health",
    ],
    content: [
      "For centuries, dentistry and general medicine operated in distinct silos. Today, medical science recognizes that oral health is an inseparable window into full-body systemic wellness.",
      "How Oral Bacteria Enter Circulation: Chronic periodontal disease (gum infection) breaks down the delicate epithelial barrier lining your gums. Oral pathogens like Porphyromonas gingivalis can enter the microvasculature, triggering immune cascades and contributing to arterial plaque instability.",
      "Diabetes and Gum Disease: The relationship between diabetes and periodontitis is bidirectional. Chronic gum inflammation worsens insulin resistance, while elevated blood sugar impairs the body's ability to heal oral infections.",
      "Preventive Hygiene Protocol: Routine ultrasonic dental cleanings every six months do far more than brighten your smile—they remove biofilm reservoirs that your toothbrush cannot reach, actively reducing inflammatory stress on your cardiovascular system.",
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
