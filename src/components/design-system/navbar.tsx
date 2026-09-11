"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Stethoscope,
  Calendar,
  ShieldCheck,
  Phone,
  Clock,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useClinicTheme } from "@/components/theme/clinic-theme-provider";
import { Button } from "@/components/ui/button";
import { BookNowButton } from "@/components/ui/book-now-button";
import { ClinicLogo } from "@/components/ui/clinic-logo";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface NavbarProps {
  clinicName?: string;
  emergencyPhone?: string;
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Clinical Services", href: "/services" },
  { label: "Medical Specialists", href: "/doctors" },
  { label: "Book Appointment", href: "/book", badge: "Online" },
];

export function Navbar({
  clinicName = "HealthSphere",
  emergencyPhone = "(800) 555-CLINIC",
  navItems = defaultNavItems,
}: NavbarProps) {
  const pathname = usePathname();
  const { currentTheme, brandConfig } = useClinicTheme();
  const shouldReduceMotion = useReducedMotion();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Handle Escape key and focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!mobileMenuOpen) return;

      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusableElements =
          mobileMenuRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    },
    [mobileMenuOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Animation variants
  const mobileMenuVariants: Variants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.25,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: "easeOut",
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: 0.08,
      },
    },
  };

  const menuItemVariants: Variants = {
    closed: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -14,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.22,
      },
    },
  };

  return (
    <header className="bg-brand-surface/95 sticky top-0 z-50 w-full border-b border-brand-border backdrop-blur-md transition-colors">
      {/* Top Clinical Announcement Bar */}
      <div className="bg-brand-primary px-4 py-1.5 text-xs text-brand-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="truncate">
              24/7 Urgent Triage Hotline:{" "}
              <a
                href={`tel:${emergencyPhone.replace(/\D/g, "")}`}
                className="font-bold underline hover:opacity-80"
                aria-label={`Call urgent triage hotline at ${emergencyPhone}`}
              >
                {emergencyPhone}
              </a>
            </span>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-1.5 opacity-90">
              <Sparkles className="h-3 w-3" />
              <span>
                Theme: <strong>{currentTheme.name}</strong>
              </span>
            </div>
            <Link
              href="/admin/settings"
              className="text-[11px] underline transition-opacity hover:opacity-80"
              aria-label="Customize clinic theme in admin settings"
            >
              (Customize)
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-clinic focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          aria-label={`${brandConfig?.logo?.clinicDisplayName || clinicName} homepage`}
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotate: 2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
          >
            <ClinicLogo size="md" />
          </motion.div>
          <div>
            <span className="block font-heading text-lg font-bold tracking-tight text-brand-text sm:text-xl">
              {brandConfig?.logo?.clinicDisplayName || clinicName}
            </span>
            <span className="-mt-1 block text-[11px] font-medium text-brand-muted sm:text-xs">
              {brandConfig?.logo?.tagline || `${currentTheme.name} Center`}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-1 md:flex lg:gap-2"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-clinic px-3.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                  isActive
                    ? "font-semibold text-brand-primary"
                    : "hover:bg-brand-accent/20 text-brand-muted hover:text-brand-text"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 rounded-full bg-brand-accent px-1.5 py-0.5 text-[10px] font-bold text-brand-accent-foreground">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-brand-muted hover:text-brand-text"
              aria-label="Go to clinic staff and administrator portal"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Staff Portal</span>
            </Button>
          </Link>
          <BookNowButton href="/book" text="Book Now" size="md" />
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="hover:bg-brand-accent/20 inline-flex items-center justify-center rounded-clinic border border-brand-border p-2 text-brand-text transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary md:hidden"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-brand-primary" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6 text-brand-text" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Navigation (Accessible + Framer Motion) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="overflow-hidden border-t border-brand-border bg-brand-surface px-4 pb-6 pt-3 shadow-xl md:hidden"
          >
            <nav
              aria-label="Mobile navigation links"
              className="flex flex-col space-y-1"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div key={item.href} variants={menuItemVariants}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-clinic px-3.5 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-brand-primary font-semibold text-brand-primary-foreground"
                          : "hover:bg-brand-accent/20 text-brand-text"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-brand-accent text-brand-accent-foreground"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 ${isActive ? "text-white" : "text-brand-muted"}`}
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile Actions & Urgent Hotline */}
            <motion.div
              variants={menuItemVariants}
              className="mt-5 space-y-3 border-t border-brand-border pt-4"
            >
              <BookNowButton
                href="/book"
                text="Book Now"
                size="lg"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              />

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${emergencyPhone.replace(/\D/g, "")}`}
                  className="hover:border-brand-primary/40 flex items-center justify-center gap-2 rounded-clinic border border-brand-border bg-brand-background p-2.5 text-xs font-semibold text-brand-text transition-colors"
                  aria-label={`Call clinic at ${emergencyPhone}`}
                >
                  <Phone
                    className="h-3.5 w-3.5 text-brand-primary"
                    aria-hidden="true"
                  />
                  <span>Call Hotline</span>
                </a>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:border-brand-primary/40 flex items-center justify-center gap-2 rounded-clinic border border-brand-border bg-brand-background p-2.5 text-xs font-semibold text-brand-text transition-colors"
                  aria-label="Staff administration portal"
                >
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-brand-primary"
                    aria-hidden="true"
                  />
                  <span>Staff Portal</span>
                </Link>
              </div>

              <div className="bg-brand-accent/20 flex items-center justify-between rounded-clinic p-3 text-xs text-brand-muted">
                <span>
                  Active Theme: <strong>{currentTheme.name}</strong>
                </span>
                <Link
                  href="/admin/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-semibold text-brand-primary hover:underline"
                >
                  Change
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
