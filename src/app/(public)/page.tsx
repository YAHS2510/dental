import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  Smile,
  ArrowRight,
  Star,
  Award,
  CheckCircle2,
  Users,
  Building2,
} from "lucide-react";
import { Hero } from "@/components/design-system/hero";
import { SectionWrapper } from "@/components/design-system/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookNowButton } from "@/components/ui/book-now-button";
import { ClinicJsonLd } from "@/components/seo/clinic-json-ld";
import { clinicalServices } from "@/data/services-data";
import {
  getPublicApprovedReviews,
  getReviewsStoreData,
} from "@/lib/reviews-store";

export const metadata: Metadata = {
  title: "HealthSphere Clinic | Board-Certified Physicians & Same-Day Care",
  description:
    "Experience comprehensive clinical care, preventive cardiology, pediatric wellness, and gentle dental medicine. Schedule your appointment online with instant confirmation.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HealthSphere Medical Clinic - Patient-First Healthcare",
    description:
      "Modern clinical diagnostics, trusted specialists, and seamless online scheduling. Serving families with compassionate care.",
    url: "/",
    siteName: "HealthSphere Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthSphere Clinic | Modern Healthcare Centered Around You",
    description:
      "Book an appointment with board-certified physicians in primary care, cardiology, pediatrics, and dental medicine.",
  },
};

export default function HomePage() {
  const previewServices = clinicalServices.slice(0, 4);
  const reviewsData = getReviewsStoreData();
  const publicReviews = getPublicApprovedReviews();
  const googleConfig = reviewsData.googleConfig;

  const whyChooseUs = [
    {
      title: "Board-Certified Specialists",
      description:
        "Our physicians hold credentials from Harvard, Johns Hopkins, and Stanford with over a decade of clinical experience.",
      icon: Award,
    },
    {
      title: "Same-Day Diagnostic Labs",
      description:
        "On-site 12-lead ECG, blood panels, and non-invasive screenings deliver answers in hours, not weeks.",
      icon: HeartPulse,
    },
    {
      title: "Zero Waiting Room Anxiety",
      description:
        "Streamlined digital intake and tight schedule adherence ensure an average wait time under 15 minutes.",
      icon: Clock,
    },
    {
      title: "HIPAA Compliant & Secure",
      description:
        "Bank-level encryption protects your electronic medical records, lab results, and telemedicine charts.",
      icon: ShieldCheck,
    },
  ];

  return (
    <>
      <ClinicJsonLd />

      <main className="flex flex-col">
        {/* Animated Hero Component */}
        <Hero />

        {/* Clinical Services Preview Section */}
        <SectionWrapper variant="surface" id="services-preview">
          <div className="space-y-12">
            <div className="max-w-3xl space-y-4">
              <Badge variant="default">Specialized Treatments</Badge>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl">
                Comprehensive Clinical Specialties
              </h2>
              <p className="text-base text-brand-muted">
                From routine preventative wellness to advanced diagnostic
                consultations, every service is tailored to your health goals.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {previewServices.map((service) => (
                <Card
                  key={service.slug}
                  className="hover:border-brand-primary/40 group flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                        {service.category}
                      </span>
                      <span className="text-[11px] font-medium text-brand-primary">
                        {service.duration}
                      </span>
                    </div>

                    <div>
                      <h3 className="mb-2 font-heading text-lg font-bold text-brand-text transition-colors group-hover:text-brand-primary">
                        {service.name}
                      </h3>
                      <p className="line-clamp-3 text-xs leading-relaxed text-brand-muted">
                        {service.summary}
                      </p>
                    </div>

                    <div className="border-brand-border/60 flex items-center justify-between border-t pt-2 text-xs text-brand-muted">
                      <span>{service.duration}</span>
                      <span className="font-medium text-brand-text">
                        {service.leadSpecialist.split(" (")[0]}
                      </span>
                    </div>
                  </CardContent>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/services/${service.slug}`}
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1 text-xs"
                      >
                        <span>Clinical Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="pt-4 text-center">
              <Link href="/services">
                <Button variant="outline" size="lg" className="gap-2">
                  <span>View All 6 Clinical Specialties</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Why Choose Us Section */}
        <SectionWrapper variant="accent" id="why-choose-us">
          <div className="space-y-12">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <Badge variant="default">The HealthSphere Standard</Badge>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl">
                Why Patients Trust Our Medical Center
              </h2>
              <p className="text-base text-brand-muted">
                We re-engineered the outpatient clinic experience to deliver
                uncompromising medical rigor with respectful, unhurried bedside
                care.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="shadow-xs space-y-3 rounded-clinic border border-brand-border bg-brand-surface p-6"
                  >
                    <div className="bg-brand-accent/50 flex h-12 w-12 items-center justify-center rounded-clinic text-brand-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-brand-text">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-brand-muted">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionWrapper>

        {/* Patient Testimonials Section */}
        <SectionWrapper variant="surface" id="testimonials">
          <div className="space-y-12">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  Google Verified Reviews • {googleConfig.googleRating} ★ (
                  {googleConfig.totalReviewsCount}+ Reviews)
                </span>
              </div>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl">
                Trusted by Over 15,000 Community Members
              </h2>
              <p className="text-base text-brand-muted">
                Read how our preventative diagnosis, gentle procedures, and
                dedicated physicians have helped our patients.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {publicReviews.slice(0, 6).map((review) => (
                <Card
                  key={review.id}
                  className="hover:border-brand-primary/40 flex flex-col justify-between space-y-6 p-6 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(review.rating)].map((_, r) => (
                          <Star
                            key={r}
                            className="h-4 w-4 fill-current"
                            aria-hidden="true"
                          />
                        ))}
                      </div>

                      {review.source === "GOOGLE" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                          <svg className="h-3 w-3" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>Google Review</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-brand-muted">
                          Verified Patient
                        </span>
                      )}
                    </div>

                    <blockquote className="text-sm italic leading-relaxed text-brand-muted">
                      &ldquo;{review.comment}&rdquo;
                    </blockquote>
                  </div>

                  <div className="border-brand-border/60 flex items-center justify-between border-t pt-4">
                    <div>
                      <div className="font-heading text-sm font-bold text-brand-text">
                        {review.authorName}
                      </div>
                      <div className="text-xs text-brand-muted">
                        {review.treatment}
                      </div>
                    </div>
                    {review.verifiedPatient && (
                      <Badge variant="success" className="text-[10px]">
                        Verified Patient
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Google Reviews Trust Bar */}
            <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row sm:gap-6">
              <a
                href={googleConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-clinic border border-brand-border bg-brand-background px-4 py-2 text-xs font-semibold text-brand-text transition-colors hover:border-brand-primary"
              >
                <span>Read All Google Reviews</span>
                <span className="font-bold text-amber-500">
                  ★ {googleConfig.googleRating}
                </span>
              </a>
              <Link
                href="/contact"
                className="text-xs text-brand-muted underline hover:text-brand-primary"
              >
                Have you visited our clinic? Share your experience
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Final High-Converting CTA Banner */}
        <section className="relative overflow-hidden bg-brand-primary py-16 text-brand-primary-foreground sm:py-20">
          <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Ready for a Better Healthcare Experience?
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed opacity-90 sm:text-lg">
              Schedule your consultation online in under 2 minutes, or call our
              24/7 urgent care triage team for immediate guidance.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <BookNowButton href="/book" text="Book Now" size="lg" />
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 px-6 text-white hover:bg-white/10"
                >
                  <span>Contact Clinic Coordinator</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
