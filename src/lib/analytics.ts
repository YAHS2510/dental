export type AnalyticsEventName =
  "page_view" | "funnel_step" | "booking_completed" | "ai_chat_interaction";

export interface AnalyticsEventPayload {
  eventName: AnalyticsEventName;
  path?: string;
  step?: number;
  stepName?: string;
  serviceName?: string;
  action?: string;
  timestamp?: number;
  metadata?: Record<string, any>;
}

/**
 * Lightweight, zero-cookie, HIPAA-safe telemetry dispatcher.
 * Uses navigator.sendBeacon or fetch with keepalive to avoid blocking navigation.
 */
export function trackEvent(payload: AnalyticsEventPayload) {
  if (typeof window === "undefined") return;

  const eventData = {
    ...payload,
    path: payload.path || window.location.pathname,
    timestamp: payload.timestamp || Date.now(),
  };

  try {
    const dataString = JSON.stringify(eventData);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/events", dataString);
    } else {
      fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataString,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics failures must never interrupt user experience
  }
}

export function trackPageView(path: string) {
  trackEvent({
    eventName: "page_view",
    path,
  });
}

export function trackBookingFunnel(
  step: number,
  stepName: string,
  serviceName?: string,
  metadata?: Record<string, any>
) {
  trackEvent({
    eventName: "funnel_step",
    step,
    stepName,
    serviceName,
    metadata,
  });
}

export function trackFunnelStep(
  stepName: string,
  metadata?: Record<string, any>
) {
  trackEvent({
    eventName: "funnel_step",
    stepName,
    metadata,
  });
}
