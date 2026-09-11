import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  Check,
  Sparkles,
  Stethoscope,
  HeartPulse,
  Baby,
  Brain,
  Smile,
  Bone,
} from "lucide-react";
import { SectionWrapper } from "@/components/design-system/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookNowButton } from "@/components/ui/book-now-button";
import { clinicalServices } from "@/data/services-data";

export const metadata: Metadata = {
  title: "Clinical Services & Pricing | HealthSphere Medical Clinic",
  description:
    "Explore our complete directory of clinical treatments, pricing, durations, and diagnostic panels. Board-certified physicians in primary care, cardiology, pediatrics, and dental medicine.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Clinical Services & Transparent Pricing | HealthSphere Clinic",
    description:
      "Review clinical treatments, consultation durations, procedure details, and transparent pricing with same-day scheduling.",
    url: "/services",
  },
};

export default function ServicesCatalogPage() {
  const serviceIcons: Record<string, any> = {
    "general-consultation": Stethoscope,
    "cardiology-diagnostic-panel": HeartPulse,
    "pediatric-wellness-vaccination": Baby,
    "neurology-migraine-care": Brain,
    "dental-prophylaxis-hygiene": Smile,
    "executive-health-concierge": Sparkles,
  };

  return (
    <main className="py-12 sm:py-16">
      <SectionWrapper containerSize="default" className="py-0 sm:py-0 lg:py-0">
        <div className="space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <Badge variant="default">Medical Directory</Badge>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl lg:text-5xl">
              Clinical Services & Transparent Pricing
            </h1>
            <p className="text-base leading-relaxed text-brand-muted">
              We believe patients deserve clear pricing, predictable appointment
              durations, and direct access to board-certified specialists.
              Select any clinical specialty below for detailed indications and
              preparation guidelines.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {clinicalServices.map((service) => {
              const Icon = serviceIcons[service.slug] || Stethoscope;
              return (
                <Card
                  key={service.slug}
                  className="hover:border-brand-primary/40 group flex flex-col justify-between transition-all duration-200 hover:shadow-lg"
                >
                  <CardContent className="space-y-5 p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <div className="bg-brand-accent/50 flex h-12 w-12 items-center justify-center rounded-clinic text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-brand-primary-foreground">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>

                    <div>
                      <h2 className="mb-2 font-heading text-xl font-bold text-brand-text transition-colors group-hover:text-brand-primary">
                        <Link href={`/services/${service.slug}`}>
                          {service.name}
                        </Link>
                      </h2>
                      <p className="line-clamp-3 text-xs leading-relaxed text-brand-muted sm:text-sm">
                        {service.summary}
                      </p>
                    </div>

                    {/* Indications bullets */}
                    <div className="border-brand-border/60 space-y-2 border-t pt-2">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-brand-text">
                        Common Indications:
                      </span>
                      <ul className="space-y-1.5 text-xs text-brand-muted">
                        {service.indications.slice(0, 3).map((ind, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary"
                              aria-hidden="true"
                            />
                            <span className="line-clamp-1">{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <div className="border-brand-border/60 mt-4 flex items-center justify-between border-t p-6 pt-0 sm:p-7">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                        <Clock
                          className="h-3.5 w-3.5 text-brand-primary"
                          aria-hidden="true"
                        />
                        <span>{service.duration}</span>
                      </div>
                      <div className="font-heading text-xs font-semibold text-brand-primary">
                        {service.category}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/services/${service.slug}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          Details
                        </Button>
                      </Link>
                      <BookNowButton
                        href={`/book?service=${encodeURIComponent(service.name)}`}
                        text="Book Now"
                        size="sm"
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
