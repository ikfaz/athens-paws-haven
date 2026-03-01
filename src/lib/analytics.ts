type AnalyticsValue = string | number | boolean | null | undefined;

declare global {
  interface Window {
    dataLayer?: Record<string, AnalyticsValue>[];
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, AnalyticsValue>
    ) => void;
  }
}

export const trackEvent = (eventName: string, params: Record<string, AnalyticsValue> = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer?.push({ event: eventName, ...params });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  if (import.meta.env.DEV) {
    // Keep a visible analytics trail in local testing without external integrations.
    console.info(`[analytics] ${eventName}`, params);
  }
};

