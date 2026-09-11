"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console / observability service
    console.error("Root Application Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-background p-4 text-brand-text">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-brand-border bg-brand-surface p-8 text-center shadow-xl">
        {/* Error Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
          <AlertCircle className="h-7 w-7" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-500">
            Application Error
          </span>
          <h1 className="font-heading text-xl font-bold tracking-tight text-brand-text sm:text-2xl">
            Something went unexpectedly wrong
          </h1>
          <p className="text-xs leading-relaxed text-brand-muted sm:text-sm">
            Our clinical software encountered an unexpected issue while loading
            this page. No patient medical data has been compromised.
          </p>
          {process.env.NODE_ENV !== "production" && error.message && (
            <div className="mt-2 overflow-x-auto rounded border border-rose-500/20 bg-rose-500/5 p-3 text-left font-mono text-[11px] text-rose-600 dark:text-rose-400">
              {error.message}
            </div>
          )}
        </div>

        {/* Recovery Actions */}
        <div className="flex flex-col items-center justify-center gap-2 pt-2 sm:flex-row">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="sm"
            className="h-9 w-full gap-1.5 text-xs sm:w-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-full gap-1.5 text-xs sm:w-auto"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>

        <div className="border-t border-brand-border pt-4 text-[11px] text-brand-muted">
          For urgent clinic operations, call our front desk at{" "}
          <a
            href="tel:5552345678"
            className="font-semibold text-brand-primary hover:underline"
          >
            (555) 234-5678
          </a>
        </div>
      </div>
    </div>
  );
}
