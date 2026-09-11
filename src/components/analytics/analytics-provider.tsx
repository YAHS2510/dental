"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const fullPath = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      trackPageView(fullPath);
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
