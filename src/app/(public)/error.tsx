"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public Route Error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold text-brand-text">
          Unable to Load Clinical Page
        </h2>
        <p className="text-xs leading-relaxed text-brand-muted sm:text-sm">
          We experienced a temporary glitch loading this portion of our website.
          Please try refreshing or use our direct contact options.
        </p>
      </div>

      {/* Emergency Alert Box */}
      <div className="rounded-clinic border border-amber-500/20 bg-amber-500/10 p-3.5 text-left text-xs text-amber-800 dark:text-amber-300">
        <strong>⚠️ Clinical Safety Notice:</strong> If you are experiencing
        acute chest pain, severe shortness of breath, or another medical
        emergency, please call <strong>911</strong> or visit the nearest
        emergency room immediately.
      </div>

      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Button
          onClick={() => reset()}
          variant="primary"
          size="sm"
          className="h-9 w-full gap-1.5 text-xs sm:w-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Page</span>
        </Button>
        <Link href="/" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-full gap-1.5 text-xs sm:w-auto"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Clinic Homepage</span>
          </Button>
        </Link>
      </div>

      <div className="pt-2 text-xs text-brand-muted">
        Need to speak with our reception desk? Call{" "}
        <a
          href="tel:5552345678"
          className="font-semibold text-brand-primary underline"
        >
          (555) 234-5678
        </a>
      </div>
    </div>
  );
}
