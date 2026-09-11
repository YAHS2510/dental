"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Calendar,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { QuickBookingForm } from "@/components/public/quick-booking-form";
import { BookNowButton } from "@/components/ui/book-now-button";

export interface HeroProps {
  headlinePrefix?: string;
  headlineHighlight?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  phoneCtaText?: string;
  phoneCtaHref?: string;
}

export function Hero({
  headlinePrefix = "Gentle Precision Dental Care &",
  headlineHighlight = "Pediatric Dentistry",
  description = "Led by Dr. Vidhyamol (Pediatric Specialist) and Dr. Sankar (Chief Dental Surgeon), VS Multispeciality Dental Clinic delivers compassionate, advanced dental solutions in Palakkad.",
  primaryCtaText = "Book Now",
  primaryCtaHref = "#quick-booking",
  phoneCtaText = "Call +9185904 22464",
  phoneCtaHref = "tel:+918590422464",
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemFadeUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const metrics = [
    { value: "15,000+", label: "PATIENTS SERVED", isOrange: false },
    { value: "100%", label: "CLASS-B STERILE", isOrange: false },
    { value: "0 Pain", label: "ANXIETY PROTOCOL", isOrange: true },
  ];

  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-[#f0fdf9]/40 pb-16 pt-8 sm:pt-12 lg:pb-24 lg:pt-14">
      {/* Soft mint & ambient background tint */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 -z-10 h-[550px] w-[750px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #a7f3d0 0%, #ccfbf1 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start xl:gap-14">
          {/* Left Column: Clinic Introduction & Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 lg:col-span-7 lg:pt-4 xl:col-span-7"
          >
            {/* Top Brand Micro Badge */}
            <motion.div
              variants={itemFadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Multi-Speciality Care in Palakkad</span>
            </motion.div>

            {/* Main Fluid Headline matching screenshot */}
            <motion.h1
              variants={itemFadeUp}
              className="font-heading text-4xl font-extrabold leading-[1.12] tracking-tight text-[#064e3b] sm:text-5xl lg:text-[3.25rem]"
            >
              <span>{headlinePrefix}</span> <br />
              <span className="text-[#059669]">{headlineHighlight}</span>
            </motion.h1>

            {/* Subtitle description */}
            <motion.p
              variants={itemFadeUp}
              className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              {description}
            </motion.p>

            {/* 3 Metric Cards matching reference screenshot */}
            <motion.div
              variants={itemFadeUp}
              className="grid max-w-lg grid-cols-3 gap-3 pt-2 sm:gap-4"
            >
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xs rounded-2xl border border-slate-200/90 bg-white/90 p-3 text-left shadow-sm transition-transform hover:-translate-y-0.5 sm:p-4"
                >
                  <div
                    className={`font-heading text-xl font-black tracking-tight sm:text-2xl ${
                      m.isOrange ? "text-[#f97316]" : "text-slate-900"
                    }`}
                  >
                    {m.value}
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wider text-slate-500 sm:text-[11px]">
                    {m.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Action Buttons matching reference screenshot */}
            <motion.div
              variants={itemFadeUp}
              className="flex flex-wrap items-center gap-3.5 pt-3"
            >
              <BookNowButton
                href={primaryCtaHref}
                text={primaryCtaText}
                size="lg"
              />

              <a
                href="https://wa.me/918590422464?text=Hello%20VS%20Dental%20Clinic,%20I%20would%20like%20to%20book%20an%20appointment."
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-emerald-500/25 transition-all hover:bg-[#20ba59] active:scale-[0.99] sm:text-sm"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.179-.536-1.528-.627-2.515-2.172-2.592-2.273-.076-.101-.617-.824-.617-1.571 0-.747.387-1.115.526-1.268.143-.153.313-.191.419-.191.106 0 .211.002.304.007.099.005.231-.038.361.275.134.321.46 1.119.5 1.2.04.082.067.177.013.284-.053.106-.08.172-.16.265-.079.095-.167.211-.238.284-.081.082-.165.172-.072.332.094.159.418.69 0.896 1.116.615.547 1.135.717 1.295.798.16.08.254.071.35-.041.095-.112.408-.475.517-.638.11-.164.218-.137.368-.082.15.054.954.45 1.118.532.164.081.273.123.313.191.04.068.04.394-.104.799zM12.045 2C6.505 2 2 6.506 2 12.047c0 1.973.57 3.815 1.558 5.378L2 22l4.743-1.517A9.977 9.977 0 0012.045 22c5.54 0 10.045-4.505 10.045-10.047C22.09 6.506 17.585 2 12.045 2z" />
                  </svg>
                  <span>Book via WhatsApp</span>
                </button>
              </a>

              <a href={phoneCtaHref}>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#064e3b] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-emerald-950/20 transition-all hover:bg-[#065f46] active:scale-[0.99] sm:text-sm"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>{phoneCtaText}</span>
                </button>
              </a>
            </motion.div>

            {/* Clinical Trust & Safety Guarantee */}
            <motion.div
              variants={itemFadeUp}
              className="grid grid-cols-1 gap-2.5 border-t border-slate-200/80 pt-5 text-xs text-slate-500 sm:grid-cols-3"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Zero-Pain Anxiety Care</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>100% Class-B Autoclaved</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Immediate Call Confirmation</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Quick Appointment Request Card matching screenshot */}
          <div
            id="quick-booking"
            className="w-full scroll-mt-24 lg:col-span-5 xl:col-span-5"
          >
            <QuickBookingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
