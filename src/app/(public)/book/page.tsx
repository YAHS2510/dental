import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { QuickBookingForm } from "@/components/public/quick-booking-form";
import { SectionWrapper } from "@/components/design-system/section-wrapper";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Book an Appointment Online | VS Multispeciality Dental Clinic",
  description:
    "Schedule your dental consultation, pediatric dental checkup, root canal, or orthodontic visit online. Select date & time range with instant confirmation.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book Dental Appointment - VS Multispeciality Dental Clinic",
    description:
      "Quick appointment request intake with flexible morning, afternoon, and evening time slots.",
    url: "/book",
  },
};

export default function BookAppointmentPage() {
  return (
    <main className="min-h-[85vh] bg-[#f0fdf9]/30 py-10 sm:py-14">
      <SectionWrapper containerSize="narrow" className="py-0 sm:py-0 lg:py-0">
        <div className="space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-brand-muted transition-colors hover:text-brand-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <div className="pt-2">
              <Badge variant="default" className="gap-1.5">
                <Sparkles className="h-3 w-3 text-brand-primary" />
                <span>Quick Appointment Request</span>
              </Badge>
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Request Your Dental Consultation
            </h1>
            <p className="max-w-xl text-sm text-slate-600">
              Select your patient type, choose your preferred doctor &amp; time
              range, and our clinical desk will follow up to confirm your slot.
            </p>
          </div>

          <div className="mx-auto max-w-xl">
            <QuickBookingForm />
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
