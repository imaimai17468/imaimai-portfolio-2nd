export type FeedbackRequest = {
  message: string;
  page: string;
};

export const isFeedbackRequest = (v: unknown): v is FeedbackRequest =>
  typeof v === "object" &&
  v !== null &&
  "message" in v &&
  typeof v.message === "string";
