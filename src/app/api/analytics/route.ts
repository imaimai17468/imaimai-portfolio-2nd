import crypto from "node:crypto";
import { NextResponse } from "next/server";

let cached: { body: unknown; date: string; at: number } | null = null;
const CACHE_TTL_MS = 3_600_000;

function isAuthorized(request: Request): boolean {
  const apiKey = process.env.ANALYTICS_API_KEY;
  if (!apiKey) return true;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${apiKey}`;
}

async function getGoogleAccessToken(
  clientEmail: string,
  privateKey: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");

  const payload = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  ).toString("base64url");

  const signInput = `${header}.${payload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signInput);
  const signature = signer.sign(privateKey, "base64url");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signInput}.${signature}`,
    }),
  });

  const tokenData: unknown = await tokenRes.json();

  if (
    typeof tokenData !== "object" ||
    tokenData === null ||
    !("access_token" in tokenData) ||
    typeof tokenData.access_token !== "string"
  ) {
    throw new Error("Failed to obtain Google access token");
  }

  return tokenData.access_token;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const saKeyBase64 = process.env.GOOGLE_SA_KEY;
  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!saKeyBase64 || !propertyId) {
    return NextResponse.json(
      { error: "Missing server configuration" },
      { status: 500 }
    );
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (
    cached &&
    cached.date === yesterday &&
    Date.now() - cached.at < CACHE_TTL_MS
  ) {
    return NextResponse.json(cached.body);
  }

  let saKey: unknown;
  try {
    saKey = JSON.parse(Buffer.from(saKeyBase64, "base64").toString());
  } catch {
    return NextResponse.json(
      { error: "Invalid credentials format" },
      { status: 500 }
    );
  }

  if (
    typeof saKey !== "object" ||
    saKey === null ||
    !("client_email" in saKey) ||
    !("private_key" in saKey) ||
    typeof saKey.client_email !== "string" ||
    typeof saKey.private_key !== "string"
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 500 });
  }

  let accessToken: string;
  try {
    accessToken = await getGoogleAccessToken(
      saKey.client_email,
      saKey.private_key
    );
  } catch {
    return NextResponse.json(
      { error: "Google authentication failed" },
      { status: 500 }
    );
  }

  const apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  const dateRanges = [{ startDate: yesterday, endDate: yesterday }];

  const [pagesRes, audienceRes] = await Promise.all([
    fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "totalUsers" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
          { name: "engagementRate" },
          { name: "userEngagementDuration" },
        ],
        metricAggregations: ["TOTAL"],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        returnPropertyQuota: true,
      }),
    }),
    fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        dateRanges,
        dimensions: [
          { name: "deviceCategory" },
          { name: "sessionDefaultChannelGroup" },
          { name: "newVsReturning" },
        ],
        metrics: [
          { name: "totalUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
        ],
        metricAggregations: ["TOTAL"],
        returnPropertyQuota: true,
      }),
    }),
  ]);

  if (!pagesRes.ok || !audienceRes.ok) {
    const pagesErr: unknown = !pagesRes.ok ? await pagesRes.json() : null;
    const audienceErr: unknown = !audienceRes.ok
      ? await audienceRes.json()
      : null;
    return NextResponse.json(
      {
        error: "Analytics data unavailable",
        details: { pages: pagesErr, audience: audienceErr },
      },
      { status: 502 }
    );
  }

  const pages: unknown = await pagesRes.json();
  const audience: unknown = await audienceRes.json();
  const body = { date: yesterday, pages, audience };

  cached = { body, date: yesterday, at: Date.now() };

  return NextResponse.json(body);
}
