// app/api/broadcast/[slug]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getPostBySlug } from "@/lib/posts";

// Colors from your Tailwind palette
const COLORS = {
  paper:  "#f6f1da",
  card:   "#fbf6e6",
  border: "#e6dcc4",
  ink:    "#2a261f",
  sub:    "#665e53",
  accent: "#c77d54",
  accent600: "#a9653e",
};

function extractH2s(html: string, max = 3): string[] {
  const out: string[] = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && out.length < max) {
    out.push(m[1].replace(/<[^>]+>/g, "").trim());
  }
  return out;
}

function withUTM(url: string, slug: string) {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "dispatch");
    u.searchParams.set("utm_medium", "email");
    u.searchParams.set("utm_campaign", slug);
    return u.toString();
  } catch { return url; }
}

function emailHTML(opts: {
  title: string;
  description?: string;
  canonical: string;
  slug: string;
  sections?: string[];
}) {
  const { title, description, canonical, slug, sections = [] } = opts;
  const link = withUTM(canonical, slug);

  // email-safe 600px layout (table), inline CSS only
  return `
<!-- preheader (hidden in most clients) -->
<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">
  ${description || "New note on OSJ Dispatch"}
</div>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${COLORS.paper};padding:24px 0;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background:${COLORS.card};color:${COLORS.ink};border:1px solid ${COLORS.border};border-radius:16px;padding:24px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
        <tr>
          <td style="font-size:12px;color:${COLORS.sub};padding-bottom:8px;">OSJ Dispatch</td>
        </tr>
        <tr>
          <td style="font-family:Georgia,ui-serif,serif;font-size:28px;line-height:1.25;font-weight:700;padding-bottom:8px;">
            ${title}
          </td>
        </tr>
        ${description ? `
        <tr>
          <td style="font-size:16px;line-height:1.6;color:${COLORS.sub};padding-bottom:12px;">
            ${description}
          </td>
        </tr>` : ""}

        ${sections.length ? `
        <tr>
          <td style="padding:12px 0 8px 0;">
            <div style="font-size:13px;color:${COLORS.sub};margin-bottom:6px;">What’s inside</div>
            <ul style="margin:0;padding-left:18px;font-size:15px;line-height:1.6;">
              ${sections.map(s => `<li>${s}</li>`).join("")}
            </ul>
          </td>
        </tr>` : ""}

        <tr>
          <td style="padding:18px 0 8px 0;">
            <a href="${link}"
               style="display:inline-block;padding:12px 18px;border-radius:999px;background:${COLORS.accent};color:#fff;text-decoration:none;font-weight:600;border:1px solid ${COLORS.accent600}">
               Read the note →
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding-top:16px;border-top:1px solid ${COLORS.border};font-size:13px;color:${COLORS.sub}">
            <div>— archive → <a href="https://heyosj.com/blog" style="color:${COLORS.accent};text-decoration:none;">heyosj.com/blog</a>
            · about → <a href="https://heyosj.com/about" style="color:${COLORS.accent};text-decoration:none;">heyosj.com/about</a></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- plain fallback link -->
<div style="text-align:center;font-size:12px;color:${COLORS.sub};font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  If the button above doesn’t work: <a href="${link}" style="color:${COLORS.accent}">${link}</a>
</div>
`.trim();
}

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST with ?key=… to send" });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const key = new URL(req.url).searchParams.get("key");
  if (!key || key !== process.env.BROADCAST_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 1) Load post
  const post = await getPostBySlug(params.slug);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.heyosj.com";
  const canonical = `${base}/blog/${post.slug}`;

  // 2) Nice HTML body in your site’s style
  const sections = extractH2s(post.html, 3);
  const body = emailHTML({
    title: post.title,
    description: post.description,
    canonical,
    slug: post.slug,
    sections,
  });

  // 3) Create & schedule on Buttondown
  const subject = `new: ${post.title} — OSJ Dispatch`;
  const publish_date = new Date(Date.now() + 30 * 1000).toISOString();

  const resp = await fetch("https://api.buttondown.com/v1/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
    },
    body: JSON.stringify({
      subject,
      body,                 // raw HTML is allowed in Buttondown Markdown body
      status: "scheduled",
      publish_date,
      email_type: "public",
      canonical_url: canonical,
    }),
    cache: "no-store",
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    return NextResponse.json({ error: "buttondown create failed", detail: t }, { status: 502 });
  }

  const created = await resp.json();
  return NextResponse.json({
    ok: true,
    status: created.status,
    publish_date: created.publish_date,
  });
}
