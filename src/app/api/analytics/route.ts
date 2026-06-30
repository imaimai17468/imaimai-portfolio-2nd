import {
  isAnalyticsEvent,
  type AnalyticsEvent,
} from "@/entities/analytics/analyticsEvent";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: unknown = await request.json();

  if (typeof body !== "object" || body === null || !("events" in body)) {
    return NextResponse.json({ error: "Events required" }, { status: 400 });
  }

  const rawEvents: unknown = body.events;
  if (!Array.isArray(rawEvents)) {
    return NextResponse.json({ error: "Events required" }, { status: 400 });
  }

  const events = rawEvents.filter(isAnalyticsEvent);

  if (events.length === 0) {
    return NextResponse.json({ error: "No valid events" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "imaimai17468/imaimai-portfolio-2nd";

  if (!token) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const date = new Date().toISOString().slice(0, 10);
  const rows = events
    .map((e: AnalyticsEvent) =>
      e.type === "dwell"
        ? `| dwell | ${e.path} | ${e.dwell_seconds}s | |`
        : `| transition | ${e.from} | | ${e.from} → ${e.to} |`
    )
    .join("\n");

  const issueBody = `## Analytics Report — ${date}\n\n| Type | Path | Dwell | Transition |\n|------|------|-------|------------|\n${rows}\n\n---\n**Timestamp:** ${new Date().toISOString()}`;

  const listRes = await fetch(
    `https://api.github.com/repos/${repo}/issues?labels=analytics&state=open&per_page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (listRes.ok) {
    const existing: unknown = await listRes.json();
    if (
      Array.isArray(existing) &&
      existing.length > 0 &&
      typeof existing[0] === "object" &&
      existing[0] !== null &&
      "number" in existing[0]
    ) {
      await fetch(
        `https://api.github.com/repos/${repo}/issues/${String(existing[0].number)}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
          },
          body: JSON.stringify({ body: issueBody }),
        }
      );
      return NextResponse.json({ success: true, appended: true });
    }
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      title: "[Analytics] User engagement data",
      body: issueBody,
      labels: ["analytics"],
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to submit analytics" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
