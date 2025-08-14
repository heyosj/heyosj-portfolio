// app/api/broadcast/[slug]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

function abs(slug: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}/blog/${slug}`;
}

async function run(req: NextRequest, slug: string) {
  // Auth: header (CRON_SECRET) OR query (?key=...)
  const auth = req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
  const keyOK = new URL(req.url).searchParams.get("key") === process.env.BROADCAST_SECRET;
  if (!auth && !keyOK) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const post = await getPostBySlug(slug);
  if (!post) return NextResponse.json({ error: "post not found" }, { status: 404 });

  const subject = `new: ${post.title} — OSJ Dispatch`;
  const canonical = abs(slug);
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

  const r = await fetch("https://api.buttondown.com/v1/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
    },
    body: JSON.stringify({
      subject,
      body,                     // markdown ok
      email_type: "public",
      canonical_url: canonical,
      status: "scheduled",      // send automatically
      publish_date: new Date(Date.now() + 30_000).toISOString(), // ~30s
    }),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    return NextResponse.json({ error: "buttondown create failed", detail }, { status: 400 });
  }

  const data = await r.json();
  return NextResponse.json({ ok: true, status: data.status, publish_date: data.publish_date });
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  return run(req, params.slug);
}
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  return run(req, params.slug);
}
