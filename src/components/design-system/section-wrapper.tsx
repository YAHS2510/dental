"use client";

import React from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface SectionWrapperProps extends HTMLMotionProps<"section"> {
  children: React.ReactNode;
  variant?: "default" | "surface" | "accent" | "bordered";
  containerSize?: "default" | "narrow" | "wide" | "full";
  delay?: number;
}

export function SectionWrapper({
  children,
  className,
  variant = "default",
  containerSize = "default",
  delay = 0,
  ...props
}: SectionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  const variantStyles = {
    default: "bg-brand-background",
    surface: "bg-brand-surface",
    accent: "bg-brand-accent/20",
    bordered: "bg-brand-surface border-y border-brand-border",
  };

  const containerStyles = {
    default: "max-w-7xl",
    narrow: "max-w-4xl",
    wide: "max-w-8xl",
    full: "max-w-full",
  };

  const sectionVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: "easeOut",
        delay: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={sectionVariants}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          containerStyles[containerSize]
        )}
      >
        {children}
      </div>
    </motion.section>
  );
}
