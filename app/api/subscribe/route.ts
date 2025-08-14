// app/api/subscribe/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isEmail(s: string) {
  return /^\S+@\S+\.\S+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const { email, hp } = await req.json().catch(() => ({} as any));

    // Honeypot (optional): silently accept bots
    if (hp) return NextResponse.json({ ok: true });

    if (!email || !isEmail(email)) {
      return NextResponse.json({ error: "enter a valid email" }, { status: 400 });
    }

    const resp = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      },
      body: JSON.stringify({
        email_address: email,        // Buttondown expects this key
        requires_confirmation: true, // double opt-in
        // tags: ["site-hero"],       // (optional) tag the source
      }),
    });

    if (!resp.ok) {
      // Try to decode Buttondown's error payload
      let friendly = "subscribe failed";
      let status = 400;

      try {
        const data = await resp.json();
        const code = (data?.code || data?.detail || "").toString();

        if (code.includes("subscriber_suppressed")) {
          friendly =
            "this address previously unsubscribed or bounced. please re-activate it in Buttondown (or use a different email).";
        } else if (code.includes("already") || code.includes("exists")) {
          friendly = "looks like you're already on the list — check your email or try confirming again.";
        } else if (code.includes("invalid") || code.includes("email")) {
          friendly = "enter a valid email";
        } else if (resp.status === 429) {
          friendly = "too many attempts — try again in a minute.";
          status = 429;
        } else if (typeof data?.detail === "string" && data.detail.trim()) {
          friendly = data.detail;
        }
      } catch {
        // If JSON parse fails, fall back to text
        try {
          const text = await resp.text();
          if (text) friendly = text;
        } catch {}
      }

      return NextResponse.json({ error: friendly }, { status });
    }

    // Success (note: still pending until the user confirms)
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}

// Optional: quick health check
export async function GET() {
  return NextResponse.json({ ok: true });
}
