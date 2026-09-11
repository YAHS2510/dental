"use client";

import React, { useState } from "react";
import {
  Mail,
  Smartphone,
  Monitor,
  Code,
  Send,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Shield,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
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
import {
  renderBookingRequestReceivedEmail,
  renderBookingConfirmedEmail,
  renderBookingDeclinedEmail,
  renderAppointmentReminderEmail,
  renderBookingCancelledEmail,
} from "@/lib/email-templates";

type TemplateKey =
  | "booking-confirmed"
  | "appointment-reminder"
  | "booking-received"
  | "booking-declined"
  | "booking-cancelled";

interface TemplateInfo {
  key: TemplateKey;
  name: string;
  badge: string;
  triggerEvent: string;
  description: string;
}

const TEMPLATES: TemplateInfo[] = [
  {
    key: "booking-confirmed",
    name: "Booking Confirmed",
    badge: "Most Common",
    triggerEvent: "When staff or doctor clicks 'Confirm' in Admin",
    description:
      "Includes confirmation badge, physician info, consultation fee, parking instructions, and preparation checklist.",
  },
  {
    key: "appointment-reminder",
    name: "24-Hour Reminder",
    badge: "Scheduled Cron",
    triggerEvent:
      "Triggered automatically by Vercel Cron ~24 hours before visit",
    description:
      "Action-oriented reminder with arrival directions, parking validation, and 1-click attendance confirmation.",
  },
  {
    key: "booking-received",
    name: "Request Received",
    badge: "Patient Intake",
    triggerEvent: "Immediately after patient submits online booking at /book",
    description:
      "Informs patient their request is under clinical review, showing requested slot and triage details.",
  },
  {
    key: "booking-declined",
    name: "Declined / Reschedule",
    badge: "Schedule Conflict",
    triggerEvent: "When staff declines or suggests an alternative slot",
    description:
      "Diplomatically communicates clinical reason (e.g. physician in surgery) and proposes alternative openings.",
  },
  {
    key: "booking-cancelled",
    name: "Booking Cancelled",
    badge: "Cancellation",
    triggerEvent:
      "When an appointment is cancelled by patient or clinical staff",
    description:
      "Confirms cancellation, notes policy details, and offers an easy 1-click link to re-book anytime.",
  },
];

export default function AdminEmailPreviewsPage() {
  const [activeTemplate, setActiveTemplate] =
    useState<TemplateKey>("booking-confirmed");
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile" | "code">(
    "desktop"
  );
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Sample data to preview
  const sampleData = {
    patientName: "Eleanor Pena",
    serviceName: "Comprehensive Cardiology Diagnostic Panel",
    appointmentDate: "Wednesday, September 23, 2026",
    appointmentTime: "10:30 AM",
    doctorName: "Dr. Evelyn Reed, MD",
    servicePrice: "160.00",
    durationMinutes: 45,
    reason:
      "Dr. Reed has been called into urgent interventional cardiac surgery. We apologize for the inconvenience.",
    alternativeSlot: "Thursday, September 24, 2026 at 02:00 PM",
  };

  const getRenderedEmail = () => {
    switch (activeTemplate) {
      case "booking-confirmed":
        return renderBookingConfirmedEmail(sampleData);
      case "appointment-reminder":
        return renderAppointmentReminderEmail(sampleData);
      case "booking-received":
        return renderBookingRequestReceivedEmail(sampleData);
      case "booking-declined":
        return renderBookingDeclinedEmail(sampleData);
      case "booking-cancelled":
        return renderBookingCancelledEmail(sampleData);
    }
  };

  const currentEmail = getRenderedEmail();
  const activeTemplateInfo = TEMPLATES.find((t) => t.key === activeTemplate)!;

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateType: activeTemplate,
          toEmail: testEmail,
          sampleData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestResult({
          success: true,
          message: data.sendResult?.simulated
            ? `Simulation logged for ${testEmail}. (Configure live RESEND_API_KEY to dispatch real inbox delivery).`
            : `Email sent successfully to ${testEmail}!`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.message || "Failed to dispatch test email",
        });
      }
    } catch {
      setTestResult({
        success: false,
        message: "Failed to dispatch test email",
      });
    } finally {
      setSendingTest(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentEmail.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-brand-text">
              Transactional Email Templates
            </h1>
            <Badge
              variant="secondary"
              className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
            >
              Resend Powered
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-brand-muted">
            Preview, test, and inspect responsive clinic-branded emails across
            patient booking lifecycles.
          </p>
        </div>

        {/* Device Viewport Toggle */}
        <div className="flex items-center gap-1 self-start rounded-clinic border border-brand-border bg-brand-surface p-1 sm:self-auto">
          <button
            onClick={() => setDeviceView("desktop")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              deviceView === "desktop"
                ? "bg-brand-primary text-white"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceView("mobile")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              deviceView === "mobile"
                ? "bg-brand-primary text-white"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile (375px)</span>
          </button>
          <button
            onClick={() => setDeviceView("code")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              deviceView === "code"
                ? "bg-brand-primary text-white"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">HTML Code</span>
          </button>
        </div>
      </div>

      {/* Template Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-brand-border pb-2">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.key}
            onClick={() => {
              setActiveTemplate(tmpl.key);
              setTestResult(null);
            }}
            className={`flex items-center gap-2 whitespace-nowrap rounded-clinic border px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTemplate === tmpl.key
                ? "border-brand-primary bg-brand-primary text-white shadow-sm"
                : "border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
            }`}
          >
            <span>{tmpl.name}</span>
            <span
              className={`py-0.2 rounded-full px-1.5 font-mono text-[9px] ${
                activeTemplate === tmpl.key
                  ? "bg-white/20 text-white"
                  : "bg-brand-background text-brand-muted"
              }`}
            >
              {tmpl.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Template Meta Card & Send Test Form */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-text">
                <span>{activeTemplateInfo.name}</span>
                <span className="text-[11px] font-normal text-brand-muted">
                  • {activeTemplateInfo.triggerEvent}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                {activeTemplateInfo.description}
              </p>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 self-start font-mono text-[10px] sm:self-auto"
            >
              Subject: {currentEmail.subject.slice(0, 35)}...
            </Badge>
          </div>
        </Card>

        {/* Send Test Email Card */}
        <Card className="p-4">
          <form onSubmit={handleSendTest} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-text">
              <div className="flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5 text-brand-primary" />
                <span>Send Real-World Test</span>
              </div>
              {deviceView === "code" && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-0.5 text-[10px] text-brand-primary hover:underline"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copied ? "Copied" : "Copy HTML"}</span>
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              <input
                type="email"
                required
                placeholder="clinician@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1 rounded-clinic border border-brand-border bg-brand-background px-2.5 py-1 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={sendingTest}
                className="h-7 px-2.5 text-xs"
              >
                {sendingTest ? "..." : "Send"}
              </Button>
            </div>
            {testResult && (
              <p
                className={`text-[10px] leading-tight ${
                  testResult.success
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {testResult.message}
              </p>
            )}
          </form>
        </Card>
      </div>

      {/* Preview Canvas */}
      <Card className="flex min-h-[680px] items-center justify-center overflow-hidden border-brand-border bg-zinc-900/5 p-4 sm:p-8 dark:bg-zinc-950/40">
        {deviceView === "desktop" && (
          <div className="w-full max-w-[620px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl">
            {/* Window Chrome */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100 px-4 py-2 text-xs text-zinc-600">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[11px] text-zinc-500">
                  Inbox Preview • Subject: {currentEmail.subject}
                </span>
              </div>
            </div>
            <iframe
              srcDoc={currentEmail.html}
              title={activeTemplateInfo.name}
              className="h-[620px] w-full border-0"
            />
          </div>
        )}

        {deviceView === "mobile" && (
          <div className="relative w-[375px] overflow-hidden rounded-[32px] border-[8px] border-zinc-800 bg-white shadow-2xl">
            {/* Phone Speaker Notch */}
            <div className="mx-auto flex h-5 w-36 items-center justify-center rounded-b-xl bg-zinc-800">
              <div className="h-1 w-10 rounded-full bg-zinc-700" />
            </div>
            <div className="truncate border-b border-zinc-200 bg-zinc-100 px-3 py-1 text-[10px] text-zinc-500">
              {currentEmail.subject}
            </div>
            <iframe
              srcDoc={currentEmail.html}
              title={activeTemplateInfo.name}
              className="h-[580px] w-full border-0"
            />
          </div>
        )}

        {deviceView === "code" && (
          <div className="max-h-[640px] w-full max-w-4xl overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 shadow-2xl">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {currentEmail.html}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
}
