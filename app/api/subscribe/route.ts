import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // don't cache in dev/build previews

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }

    // Simulate network work
    await new Promise((r) => setTimeout(r, 400));

    // Demo only: log to server console (remove later)
    console.log("[subscribe][demo] new signup:", email);

    return NextResponse.json({ ok: true, message: "subscribed (demo)" });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}

// Optional: quick health check
export async function GET() {
  return NextResponse.json({ ok: true });
}
