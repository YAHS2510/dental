import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { SectionWrapper } from "@/components/design-system/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Mail, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Locations | HealthSphere Medical Clinic",
  description:
    "Get in touch with HealthSphere Medical Clinic. View clinic operating hours, location details, direct telephone numbers, or submit an inquiry to our clinical team.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact HealthSphere Clinic - Location & Inquiries",
    description:
      "Connect with our clinic coordinators, review clinical hours, or call our 24/7 urgent triage line.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="py-12 sm:py-16">
      <SectionWrapper containerSize="default" className="py-0 sm:py-0 lg:py-0">
        <div className="space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <Badge variant="default">Patient Communications</Badge>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl lg:text-5xl">
              We&apos;re Here to Support Your Health
            </h1>
            <p className="text-base leading-relaxed text-brand-muted">
              Have questions about specialized treatments, lab records,
              insurance, or appointment availability? Our clinical coordination
              team is ready to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            {/* Left: Contact Info & Emergency Notice */}
            <div className="space-y-8 lg:col-span-5">
              {/* Emergency Alert Banner */}
              <div className="flex items-start gap-3 rounded-clinic border border-amber-200 bg-amber-50 p-4 text-amber-900 sm:p-5">
                <ShieldAlert
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                <div className="space-y-1 text-xs">
                  <span className="block text-sm font-bold">
                    Medical Emergency Notice
                  </span>
                  <p className="leading-relaxed">
                    If you or a loved one are experiencing life-threatening
                    symptoms such as severe chest pain, loss of consciousness,
                    or acute trauma, please dial <strong>911</strong> or visit
                    the nearest emergency room immediately.
                  </p>
                </div>
              </div>

              {/* Direct Info Card */}
              <div className="space-y-6 rounded-clinic border border-brand-border bg-brand-surface p-6 sm:p-7">
                <h2 className="font-heading text-lg font-bold text-brand-text">
                  Clinic Information
                </h2>

                <ul className="space-y-4 text-xs text-brand-muted sm:text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="block font-semibold text-brand-text">
                        Physical Address
                      </span>
                      <span>742 Evergreen Medical Way, Suite 400</span>
                      <span className="block">Metro City, NY 10001</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Phone
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="block font-semibold text-brand-text">
                        Telephone
                      </span>
                      <a
                        href="tel:8005552546"
                        className="font-medium text-brand-primary hover:underline"
                      >
                        (800) 555-CLINIC / (800) 555-2546
                      </a>
                      <span className="block text-xs text-brand-muted">
                        Toll-free 24/7 coverage
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Mail
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="block font-semibold text-brand-text">
                        Official Email
                      </span>
                      <a
                        href="mailto:contact@healthsphere.example.com"
                        className="hover:text-brand-primary"
                      >
                        contact@healthsphere.example.com
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Clock
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="block font-semibold text-brand-text">
                        Clinical Hours
                      </span>
                      <span>Mon – Fri: 8:00 AM – 7:00 PM</span>
                      <span className="block">Saturday: 9:00 AM – 4:00 PM</span>
                      <span className="block">
                        Sunday (Urgent Care): 10:00 AM – 2:00 PM
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
