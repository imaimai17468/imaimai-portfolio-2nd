import { isFeedbackRequest } from "@/entities/feedback/feedbackRequest";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: unknown = await request.json();

  if (!isFeedbackRequest(body)) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const { message, page } = body;

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "imaimai17468/imaimai-portfolio-2nd";

  if (!token) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const title = `[Feedback] ${message.slice(0, 50)}${message.length > 50 ? "..." : ""}`;
  const issueBody = `## User Feedback\n\n${message}\n\n---\n**Page:** ${page || "/"}\n**Date:** ${new Date().toISOString()}`;

  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      title,
      body: issueBody,
      labels: ["feedback"],
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
