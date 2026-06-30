export type AnalyticsEvent = {
  type: string;
  path?: string;
  from?: string;
  to?: string;
  dwell_seconds?: number;
};

export const isAnalyticsEvent = (v: unknown): v is AnalyticsEvent =>
  typeof v === "object" &&
  v !== null &&
  "type" in v &&
  typeof v.type === "string";
