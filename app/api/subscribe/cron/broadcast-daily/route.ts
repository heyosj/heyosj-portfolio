import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

// Protect with a secret so only your cron can run it.
const CRON_KEY = process.env.BROADCAST_SECRET!;
const TZ = "America/Indiana/Indianapolis";

export const dynamic = "force-dynamic";

function toYMD(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

function absUrl(slug: string) {
  // Set in your env for prod: NEXT_PUBLIC_SITE_URL=https://heyosj.com
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}/blog/${slug}`;
}

async function runBroadcast(url: URL) {
  // 1) Auth
  const key = url.searchParams.get("key");
  if (!key || key !== CRON_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2) Find today's newest post (local to TZ)
  const posts = await getAllPosts();
  if (!posts?.length) return NextResponse.json({ ok: true, message: "no posts" });

  const today = toYMD(new Date(), TZ);
  const todaysPosts = posts
    .filter((p: any) => toYMD(new Date(p.date), TZ) === today)
    .sort((a: any, b: any) => +new Date(b.date) - +new Date(a.date));

  if (todaysPosts.length === 0) {
    return NextResponse.json({ ok: true, message: "no posts today" });
  }

  const post = todaysPosts[0]; // newest today
  const canonical = absUrl(post.slug);

  // 3) Check if we already emailed this slug (avoid duplicates)
  const listResp = await fetch("https://api.buttondown.com/v1/emails?limit=50", {
    headers: { Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}` },
    cache: "no-store",
  });

  if (!listResp.ok) {
    const t = await listResp.text().catch(() => "");
    return NextResponse.json({ error: "failed to list emails", detail: t }, { status: 502 });
  }

  const data = await listResp.json().catch(() => ({ results: [] as any[] }));
  const already = Array.isArray(data?.results)
    ? data.results.some(
        (e: any) =>
          (e.canonical_url && e.canonical_url === canonical) ||
          (e.subject && typeof e.subject === "string" && e.subject.includes(post.title))
      )
    : false;

  if (already) {
    return NextResponse.json({ ok: true, message: "already emailed today", slug: post.slug });
  }

  // 4) Create & schedule the email (send now; cron already runs "end of day")
  const subject = `new: ${post.title} — OSJ Dispatch`;
  const body = [
    `# ${post.title}`,
    "",
    post.description || "",
    "",
    `read the note → ${canonical}`,
    "",
    "—",
    "archive → https://heyosj.com/blog · about → https://heyosj.com/about",
  ].join("\n");

  // schedule for ~30s from now
  const publish_date = new Date(Date.now() + 30 * 1000).toISOString();

  const createResp = await fetch("https://api.buttondown.com/v1/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
    },
    body: JSON.stringify({
      subject,
      body,                 // markdown allowed
      status: "scheduled",  // "scheduled" sends at publish_date
      publish_date,         // ISO timestamp
      email_type: "public",
      canonical_url: canonical,
    }),
  });

  if (!createResp.ok) {
    const t = await createResp.text().catch(() => "");
    return NextResponse.json({ error: "buttondown create failed", detail: t }, { status: 502 });
  }

  const created = await createResp.json();
  return NextResponse.json({
    ok: true,
    scheduled: created.publish_date,
    subject: created.subject,
    slug: post.slug,
  });
}

// Health check or trigger via GET (?key=...)
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("key")) {
    return runBroadcast(url); // allow GET trigger (Vercel Cron default)
  }
  return NextResponse.json({ ok: true, hint: "GET/POST with ?key=…" });
}

// Explicit POST trigger also supported
export async function POST(req: Request) {
  const url = new URL(req.url);
  return runBroadcast(url);
}
