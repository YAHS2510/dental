"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Heart,
  Activity,
  AlertTriangle,
  Pill,
  FileText,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Plus,
  CheckCircle,
  ExternalLink,
  Edit3,
  Printer,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Master patient dataset for instant interactive chart inspection
const PATIENT_DATABASE: Record<string, any> = {
  "PAT-001": {
    id: "PAT-001",
    name: "Eleanor Pena",
    dob: "1988-04-12",
    age: 38,
    gender: "Female",
    bloodType: "A+",
    email: "eleanor.pena@example.com",
    phone: "(555) 234-5678",
    address: "742 Evergreen Terrace, Springfield, OR",
    emergencyContact: "Marcus Pena (Spouse) - (555) 234-9988",
    allergies: [
      {
        allergen: "Penicillin",
        reaction: "Anaphylaxis / Hives",
        severity: "High",
      },
      {
        allergen: "Sulfa Drugs",
        reaction: "Maculopapular Rash",
        severity: "Moderate",
      },
    ],
    vitals: {
      bp: "128/82 mmHg",
      heartRate: "72 bpm",
      temp: "98.4 °F",
      spo2: "99%",
      weight: "148 lbs (67.1 kg)",
      height: "5 ft 6 in (168 cm)",
      bmi: "23.9 (Healthy)",
      lastRecorded: "Sep 18, 2026",
    },
    conditions: [
      "Hypertension Stage 1 (Managed)",
      "Seasonal Allergic Rhinitis",
    ],
    medications: [
      {
        name: "Lisinopril",
        dose: "10 mg",
        freq: "Once daily in morning",
        provider: "Dr. Evelyn Reed",
        refills: 3,
      },
      {
        name: "Fluticasone Propionate Nasal",
        dose: "50 mcg",
        freq: "1 spray each nostril daily",
        provider: "Dr. Sarah Chen",
        refills: 2,
      },
    ],
    appointments: [
      {
        id: "APT-9921",
        date: "Sep 18, 2026",
        time: "10:30 AM",
        service: "Cardiovascular Screen & ECG",
        provider: "Dr. Evelyn Reed, MD",
        status: "CONFIRMED",
        notes: "6-month routine blood pressure check and lipid review.",
      },
      {
        id: "APT-8812",
        date: "Jul 10, 2026",
        time: "02:00 PM",
        service: "General Practitioner Consultation",
        provider: "Dr. Sarah Chen, MD",
        status: "COMPLETED",
        notes:
          "Patient reported mild vertigo; labyrinthitis ruled out. Adjusted Lisinopril dosage.",
      },
      {
        id: "APT-7741",
        date: "Jan 14, 2026",
        time: "09:00 AM",
        service: "Comprehensive Annual Physical",
        provider: "Dr. Sarah Chen, MD",
        status: "COMPLETED",
        notes:
          "Routine baseline screening. CBC, BMP, and HbA1c all within normal limits.",
      },
    ],
    notes: [
      {
        id: "NOTE-1",
        date: "Sep 18, 2026",
        author: "Dr. Evelyn Reed, MD",
        title: "Cardiology Follow-Up Note (SOAP)",
        content:
          "S: Patient reports good tolerance to Lisinopril 10mg without dry cough or orthostatic dizziness.\nO: BP 128/82 mmHg, HR 72 regular, clear lungs bilaterally, no peripheral edema.\nA: Well-controlled Stage 1 Essential Hypertension.\nP: Continue current pharmacological therapy. Recheck in 6 months with fasting lipid panel.",
      },
      {
        id: "NOTE-2",
        date: "Jul 10, 2026",
        author: "Dr. Sarah Chen, MD",
        title: "Primary Care Follow-Up",
        content:
          "Patient presented with intermittent lightheadedness. Orthostatic vitals checked and stable. Advised adequate hydration (2-2.5L daily). Follow-up as needed.",
      },
    ],
  },
  "PAT-002": {
    id: "PAT-002",
    name: "Robert Fox",
    dob: "1974-08-23",
    age: 52,
    gender: "Male",
    bloodType: "O+",
    email: "robert.fox@example.com",
    phone: "(555) 345-6789",
    address: "108 Ocean Boulevard, Portland, OR",
    emergencyContact: "Diane Fox (Wife) - (555) 345-1122",
    allergies: [
      { allergen: "Latex", reaction: "Contact Dermatitis", severity: "Mild" },
    ],
    vitals: {
      bp: "138/88 mmHg",
      heartRate: "68 bpm",
      temp: "98.6 °F",
      spo2: "98%",
      weight: "185 lbs (83.9 kg)",
      height: "6 ft 0 in (183 cm)",
      bmi: "25.1 (Borderline)",
      lastRecorded: "Sep 18, 2026",
    },
    conditions: ["Coronary Artery Disease (Monitoring)", "Hyperlipidemia"],
    medications: [
      {
        name: "Atorvastatin",
        dose: "40 mg",
        freq: "Once nightly",
        provider: "Dr. Marcus Vance",
        refills: 4,
      },
      {
        name: "Aspirin 81",
        dose: "81 mg",
        freq: "Once daily with food",
        provider: "Dr. Marcus Vance",
        refills: 6,
      },
    ],
    appointments: [
      {
        id: "APT-9922",
        date: "Sep 18, 2026",
        time: "11:15 AM",
        service: "Specialist Consultation - Cardiology",
        provider: "Dr. Marcus Vance, FACC",
        status: "CONFIRMED",
        notes:
          "Post-stent 12-month echocardiogram and exercise tolerance discussion.",
      },
    ],
    notes: [
      {
        id: "NOTE-10",
        date: "Sep 18, 2026",
        author: "Dr. Marcus Vance, FACC",
        title: "Cardiology Specialist Encounter",
        content:
          "S: Robert is asymptomatic with no angina or dyspnea on exertion. Walks 3 miles daily.\nO: Heart sounds normal S1/S2 without murmurs or gallops. Resting ECG shows normal sinus rhythm.\nA: Stable ischemic heart disease.\nP: Maintain current statin regimen.",
      },
    ],
  },
  "PAT-003": {
    id: "PAT-003",
    name: "Courtney Henry",
    dob: "2018-03-15",
    age: 8,
    gender: "Female",
    bloodType: "B+",
    email: "henry.family@example.com",
    phone: "(555) 456-7890",
    address: "42 Pine Crest Rd, Beaverton, OR",
    emergencyContact: "Laura Henry (Mother) - (555) 456-7890",
    allergies: [
      { allergen: "Peanuts", reaction: "Anaphylaxis", severity: "High" },
    ],
    vitals: {
      bp: "98/62 mmHg",
      heartRate: "88 bpm",
      temp: "98.2 °F",
      spo2: "100%",
      weight: "58 lbs (26.3 kg)",
      height: "4 ft 1 in (124 cm)",
      bmi: "16.8 (Normal)",
      lastRecorded: "Sep 18, 2026",
    },
    conditions: ["Peanut Anaphylaxis (EpiPen prescribed)", "Mild Eczema"],
    medications: [
      {
        name: "Epinephrine Auto-Injector",
        dose: "0.15 mg",
        freq: "As needed for anaphylaxis",
        provider: "Dr. Sarah Chen",
        refills: 2,
      },
    ],
    appointments: [
      {
        id: "APT-9923",
        date: "Sep 18, 2026",
        time: "02:30 PM",
        service: "Pediatric Wellness & Immunization",
        provider: "Dr. Sarah Chen, MD",
        status: "CONFIRMED",
        notes: "Age 8 annual checkup and visual acuity exam.",
      },
    ],
    notes: [
      {
        id: "NOTE-20",
        date: "Sep 18, 2026",
        author: "Dr. Sarah Chen, MD",
        title: "Annual Pediatric Well-Child Exam",
        content:
          "Growth curves tracking at 65th percentile for height and 55th for weight. Up to date on all school vaccines.",
      },
    ],
  },
};

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = (params?.id as string) || "PAT-001";

  // Lookup or fallback patient
  const patient = PATIENT_DATABASE[patientId] || {
    id: patientId,
    name: "Patient Chart: " + patientId,
    dob: "1985-06-15",
    age: 41,
    gender: "Male",
    bloodType: "O+",
    email: "patient." + patientId.toLowerCase() + "@example.com",
    phone: "(555) 018-2000",
    address: "1200 Health Way, Portland, OR",
    emergencyContact: "Primary Kin - (555) 018-9999",
    allergies: [
      {
        allergen: "No Known Drug Allergies (NKDA)",
        reaction: "None",
        severity: "None",
      },
    ],
    vitals: {
      bp: "120/80 mmHg",
      heartRate: "70 bpm",
      temp: "98.6 °F",
      spo2: "99%",
      weight: "160 lbs",
      height: "5 ft 9 in",
      bmi: "23.6",
      lastRecorded: "Today",
    },
    conditions: ["Under Evaluation / Initial Intake"],
    medications: [],
    appointments: [
      {
        id: "APT-NEW",
        date: "Sep 19, 2026",
        time: "09:00 AM",
        service: "General Practitioner Consultation",
        provider: "Clinical Staff",
        status: "CONFIRMED",
        notes: "Primary diagnostic intake consultation.",
      },
    ],
    notes: [
      {
        id: "NOTE-INIT",
        date: "Today",
        author: "Clinical Triage Nurse",
        title: "Intake & Triage Summary",
        content:
          "Patient record initialized. Vitals collected and queued for clinical provider consultation.",
      },
    ],
  };

  const [activeTab, setActiveTab] = useState<
    "chart" | "appointments" | "meds" | "notes"
  >("chart");
  const [newNoteOpen, setNewNoteOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [notesList, setNotesList] = useState(patient.notes);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newEntry = {
      id: `NOTE-${Date.now()}`,
      date: "Just now",
      author: "Admin / Staff User",
      title: "Clinical Progress Encounter Note",
      content: newNoteText.trim(),
    };
    setNotesList([newEntry, ...notesList]);
    setNewNoteText("");
    setNewNoteOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/patients">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-brand-text">
                {patient.name}
              </h1>
              <Badge variant="outline" className="font-mono text-xs">
                {patient.id}
              </Badge>
              <Badge
                variant="secondary"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
              >
                Active Patient
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-brand-muted">
              DOB: {patient.dob} ({patient.age} yrs old) • {patient.gender} •
              Blood Type:{" "}
              <strong className="font-semibold text-brand-primary">
                {patient.bloodType}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print EMR Chart</span>
          </Button>
          <Link href="/admin/calendar">
            <Button size="sm" variant="primary" className="h-8 gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              <span>Book New Visit</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Left Demographics & Quick Info, Right Tabbed Clinical Data */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Demographics & Key Metrics */}
        <div className="space-y-6 lg:col-span-1">
          {/* Demographics Card */}
          <Card>
            <CardHeader className="border-brand-border/60 border-b pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <User className="h-4 w-4 text-brand-primary" />
                <span>Patient Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted" />
                <div>
                  <div className="text-[11px] text-brand-muted">
                    Primary Phone
                  </div>
                  <a
                    href={`tel:${patient.phone}`}
                    className="font-medium text-brand-text hover:text-brand-primary"
                  >
                    {patient.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted" />
                <div>
                  <div className="text-[11px] text-brand-muted">
                    Email Address
                  </div>
                  <a
                    href={`mailto:${patient.email}`}
                    className="font-medium text-brand-text hover:text-brand-primary"
                  >
                    {patient.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted" />
                <div>
                  <div className="text-[11px] text-brand-muted">
                    Home Address
                  </div>
                  <div className="font-medium text-brand-text">
                    {patient.address}
                  </div>
                </div>
              </div>

              <div className="border-brand-border/60 border-t pt-2">
                <div className="text-[11px] text-brand-muted">
                  Emergency Contact
                </div>
                <div className="mt-0.5 font-medium text-brand-text">
                  {patient.emergencyContact}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allergies & Safety Alerts Card */}
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader className="border-b border-amber-500/20 pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span>Clinical Alerts & Allergies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-4 text-xs">
              {patient.allergies.map((alg: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded border border-amber-500/30 bg-brand-surface p-2"
                >
                  <div>
                    <div className="font-semibold text-brand-text">
                      {alg.allergen}
                    </div>
                    <div className="text-[11px] text-brand-muted">
                      {alg.reaction}
                    </div>
                  </div>
                  <Badge
                    variant={
                      alg.severity === "High" ? "destructive" : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {alg.severity} Severity
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chronic Diagnoses */}
          <Card>
            <CardHeader className="border-brand-border/60 border-b pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Activity className="h-4 w-4 text-brand-primary" />
                <span>Active Diagnoses</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4 text-xs">
              {patient.conditions.map((cond: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-brand-text"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                  <span>{cond}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Vitals & Tabs (Chart, Encounters, Meds) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Latest Recorded Vitals Grid */}
          <Card>
            <CardHeader className="border-brand-border/60 flex flex-row items-center justify-between border-b pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span>Recorded Vitals</span>
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Last documented {patient.vitals.lastRecorded}
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-[11px]">
                EMR Synced
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                <div className="border-brand-border/60 rounded-lg border bg-brand-background p-3">
                  <div className="text-[11px] text-brand-muted">
                    Blood Pressure
                  </div>
                  <div className="mt-0.5 text-base font-bold text-brand-text">
                    {patient.vitals.bp}
                  </div>
                  <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Optimal
                  </div>
                </div>

                <div className="border-brand-border/60 rounded-lg border bg-brand-background p-3">
                  <div className="text-[11px] text-brand-muted">Pulse / HR</div>
                  <div className="mt-0.5 text-base font-bold text-brand-text">
                    {patient.vitals.heartRate}
                  </div>
                  <div className="text-[10px] text-brand-muted">
                    Resting Sinus
                  </div>
                </div>

                <div className="border-brand-border/60 rounded-lg border bg-brand-background p-3">
                  <div className="text-[11px] text-brand-muted">
                    Oxygen (SpO2)
                  </div>
                  <div className="mt-0.5 text-base font-bold text-brand-text">
                    {patient.vitals.spo2}
                  </div>
                  <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Normal Air
                  </div>
                </div>

                <div className="border-brand-border/60 rounded-lg border bg-brand-background p-3">
                  <div className="text-[11px] text-brand-muted">
                    Body Mass (BMI)
                  </div>
                  <div className="mt-0.5 text-base font-bold text-brand-text">
                    {patient.vitals.bmi.split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-brand-muted">
                    {patient.vitals.weight}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Navigation Tabs */}
          <div className="flex gap-2 border-b border-brand-border">
            <button
              onClick={() => setActiveTab("chart")}
              className={`flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-xs font-semibold transition-colors ${
                activeTab === "chart"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Clinical Encounter Notes ({notesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-xs font-semibold transition-colors ${
                activeTab === "appointments"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Appointment History ({patient.appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("meds")}
              className={`flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-xs font-semibold transition-colors ${
                activeTab === "meds"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              <Pill className="h-3.5 w-3.5" />
              <span>Medications ({patient.medications.length})</span>
            </button>
          </div>

          {/* TAB 1: Clinical Notes */}
          {activeTab === "chart" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-muted">
                  Physician progress entries and SOAP summaries
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-xs"
                  onClick={() => setNewNoteOpen(!newNoteOpen)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Encounter Note</span>
                </Button>
              </div>

              {/* Add Note Form */}
              {newNoteOpen && (
                <Card className="border-brand-primary/40 bg-brand-primary/5">
                  <CardContent className="space-y-3 pt-4">
                    <div className="text-xs font-semibold text-brand-text">
                      New Clinical Encounter Note
                    </div>
                    <textarea
                      rows={4}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Document SOAP progress note: Subjective, Objective, Assessment, Plan..."
                      className="w-full rounded-clinic border border-brand-border bg-brand-surface p-3 text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setNewNoteOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        className="h-7 text-xs"
                        onClick={handleAddNote}
                      >
                        Save Note to EMR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes List */}
              <div className="space-y-3">
                {notesList.map((note: any) => (
                  <Card key={note.id}>
                    <CardHeader className="border-brand-border/60 border-b pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xs font-bold text-brand-text">
                            {note.title}
                          </CardTitle>
                          <div className="mt-0.5 text-[11px] text-brand-muted">
                            Signed by {note.author} • {note.date}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px]"
                        >
                          {note.id}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <p className="bg-brand-background/60 border-brand-border/40 whitespace-pre-line rounded-lg border p-3 font-mono text-xs leading-relaxed text-brand-text">
                        {note.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Appointment History */}
          {activeTab === "appointments" && (
            <div className="space-y-3">
              {patient.appointments.map((apt: any) => (
                <Card key={apt.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-brand-text">
                            {apt.service}
                          </span>
                          <Badge
                            variant={
                              apt.status === "CONFIRMED"
                                ? "success"
                                : apt.status === "COMPLETED"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-[10px]"
                          >
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-brand-muted">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-brand-primary" />
                            <span>{apt.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-brand-primary" />
                            <span>{apt.time}</span>
                          </div>
                          <div>Provider: {apt.provider}</div>
                        </div>
                        {apt.notes && (
                          <div className="border-brand-border/50 mt-1 rounded border bg-brand-background p-2 text-xs text-brand-muted">
                            {apt.notes}
                          </div>
                        )}
                      </div>
                      <Link href="/admin/calendar">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                        >
                          <span>View on Calendar</span>
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* TAB 3: Active Medications */}
          {activeTab === "meds" && (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-brand-border bg-brand-background text-brand-muted">
                    <tr>
                      <th className="px-4 py-2.5">Medication & Dosage</th>
                      <th className="px-4 py-2.5">Administration Schedule</th>
                      <th className="px-4 py-2.5">Prescriber</th>
                      <th className="px-4 py-2.5 text-right">Refills</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {patient.medications.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-brand-muted"
                        >
                          No active prescription medications documented.
                        </td>
                      </tr>
                    ) : (
                      patient.medications.map((med: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-brand-text">
                              {med.name}
                            </div>
                            <div className="text-[11px] text-brand-primary">
                              {med.dose}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-brand-muted">
                            {med.freq}
                          </td>
                          <td className="px-4 py-3 text-brand-text">
                            {med.provider}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-medium">
                            {med.refills} refills
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
