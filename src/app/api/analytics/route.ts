import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { events } = body;

  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ error: "Events required" }, { status: 400 });
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
    .map(
      (e: {
        type: string;
        path?: string;
        from?: string;
        to?: string;
        dwell_seconds?: number;
      }) =>
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
    const existing = await listRes.json();
    if (Array.isArray(existing) && existing.length > 0) {
      await fetch(
        `https://api.github.com/repos/${repo}/issues/${existing[0].number}/comments`,
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
      title: `[Analytics] User engagement data`,
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
