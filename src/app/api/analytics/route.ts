import crypto from "node:crypto";
import { NextResponse } from "next/server";

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

export async function GET() {
  const saKeyBase64 = process.env.GOOGLE_SA_KEY;
  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!saKeyBase64 || !propertyId) {
    return NextResponse.json(
      { error: "Missing server configuration" },
      { status: 500 }
    );
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

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const reportRes = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: yesterday, endDate: yesterday }],
        dimensions: [
          { name: "pagePath" },
          { name: "sessionDefaultChannelGroup" },
        ],
        metrics: [
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "totalUsers" },
          { name: "bounceRate" },
        ],
        metricAggregations: ["TOTAL"],
      }),
    }
  );

  if (!reportRes.ok) {
    return NextResponse.json(
      { error: "Analytics data unavailable" },
      { status: 502 }
    );
  }

  const report: unknown = await reportRes.json();
  return NextResponse.json({ date: yesterday, report });
}
