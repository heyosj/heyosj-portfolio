// app/api/cron/ping/route.ts
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json({ ok: true, where: "cron/ping" }); }
