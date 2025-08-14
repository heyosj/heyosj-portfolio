// app/api/broadcast-daily/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const TZ = "America/Indiana/Indianapolis";

/** YYYY-MM-DD in a specific timezone */
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

/** Absolute URL to a blog post */
function absUrl(slug: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}/blog/${slug}`;
}

/** Core logic used by both GET/POST triggers */
async function runBroadcast(req: NextRequest, url: URL) {
  // --- AUTH: Vercel Cron header OR manual ?key= fallback ---
  const auth = req.headers.get("authorization");
  const headerOK = auth === `Bearer ${process.env.CRON_SECRET}`;
  const key = url.searchParams.get("key");
  const queryOK = key && key === process.env.BROADCAST_SECRET;
  if (!headerOK && !queryOK) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 1) Pick today's newest post (in local TZ)
  const posts = await getAllPosts();
  if (!posts?.length) return NextResponse.json({ ok: true, message: "no posts" });

  const today = toYMD(new Date(), TZ);
  const todaysPosts = posts
    .filter((p: any) => toYMD(new Date(p.date), TZ) === today)
    .sort((a: any, b: any) => +new Date(b.date) - +new Date(a.date));

  if (todaysPosts.length === 0) {
    return NextResponse.json({ ok: true, message: "no posts today" });
  }

  const post = todaysPosts[0];
  const canonical = absUrl(post.slug);

  // 2) Avoid duplicates (see if we've already emailed this slug)
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

  // 3) Create & schedule the email (cron runs at end of day; send now)
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

  // Schedule ~30s from now to give API a moment
  const publish_date = new Date(Date.now() + 30 * 1000).toISOString();

  const createResp = await fetch("https://api.buttondown.com/v1/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
    },
    body: JSON.stringify({
      subject,
      body,                 // Markdown supported
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

// Health check or trigger via GET (Vercel Cron uses GET)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  if (!req.headers.get("authorization") && !url.searchParams.get("key")) {
    return NextResponse.json({ ok: true, hint: "GET/POST with CRON_SECRET header or ?key=…" });
  }
  return runBroadcast(req, url);
}

// Manual trigger via POST also supported
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  return runBroadcast(req, url);
}
