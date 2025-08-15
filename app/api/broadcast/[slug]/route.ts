import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

// Your site palette (from Tailwind config)
const COLORS = {
  paper: "#f6f1da",
  card: "#fbf6e6",
  border: "#e6dcc4",
  ink: "#2a261f",
  sub: "#665e53",
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
  } catch {
    return url;
  }
}

// HTML email that adapts to system light/dark mode cleanly
function emailHTML(opts: {
  title: string;
  description?: string;
  canonical: string;
  slug: string;
  sections?: string[];
}) {
  const { title, description, canonical, slug, sections = [] } = opts;
  const link = withUTM(canonical, slug);

  const styles = `
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }

  .bg    { background: #ffffff !important; }
  .card  { background: ${COLORS.card} !important; border-color: ${COLORS.border} !important; }
  .txt   { color: ${COLORS.ink} !important; }
  .muted { color: ${COLORS.sub} !important; }
  .btn   { background: ${COLORS.accent} !important; border-color: ${COLORS.accent600} !important; color: #ffffff !important; }
  .link  { color: ${COLORS.accent} !important; text-decoration: none !important; }

  @media (prefers-color-scheme: dark) {
    .bg    { background: #0f0f0f !important; }
    .card  { background: #171614 !important; border-color: #2b2823 !important; }
    .txt   { color: #f4f1ea !important; }
    .muted { color: #b3ada3 !important; }
    .btn   { background: ${COLORS.accent} !important; border-color: ${COLORS.accent600} !important; color: #ffffff !important; }
    .link  { color: #f0b9a0 !important; }
  }

  /* Outlook.com auto-dark */
  [data-ogsc] .bg    { background: #0f0f0f !important; }
  [data-ogsc] .card  { background: #171614 !important; border-color: #2b2823 !important; }
  [data-ogsc] .txt   { color: #f4f1ea !important; }
  [data-ogsc] .muted { color: #b3ada3 !important; }
  [data-ogsc] .link  { color: #f0b9a0 !important; }

  /* Gmail app dark mode hack */
  u + .body .bg    { background: #0f0f0f !important; }
  u + .body .card  { background: #171614 !important; border-color: #2b2823 !important; }
  u + .body .txt   { color: #f4f1ea !important; }
  u + .body .muted { color: #b3ada3 !important; }
  u + .body .link  { color: #f0b9a0 !important; }
</style>`.trim();

  return `
<!-- meta hints -->
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">

${styles}

<!-- Gmail dark-mode trigger element -->
<u class="body" style="display:none !important; mso-hide:all;"></u>

<!-- preheader -->
<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">
  ${description || "New note on OSJ Dispatch"}
</div>

<table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="bg" style="padding:24px 0;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600"
             class="card txt"
             style="border:1px solid ${COLORS.border};border-radius:16px;padding:24px;
                    font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
        <tr>
          <td class="muted" style="font-size:12px;padding-bottom:8px;">OSJ Dispatch</td>
        </tr>
        <tr>
          <td style="font-family:Georgia,ui-serif,serif;font-size:28px;line-height:1.25;font-weight:700;padding-bottom:8px;">
            ${title}
          </td>
        </tr>
        ${description ? `
        <tr>
          <td class="muted" style="font-size:16px;line-height:1.6;padding-bottom:12px;">
            ${description}
          </td>
        </tr>` : ""}

        ${sections.length ? `
        <tr>
          <td style="padding:12px 0 8px 0;">
            <div class="muted" style="font-size:13px;margin-bottom:6px;">What’s inside</div>
            <ul style="margin:0;padding-left:18px;font-size:15px;line-height:1.6;">
              ${sections.map(s => `<li>${s}</li>`).join("")}
            </ul>
          </td>
        </tr>` : ""}

        <tr>
          <td style="padding:18px 0 8px 0;">
            <a href="${link}" class="btn"
               style="display:inline-block;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:600;border:1px solid ${COLORS.accent600};">
               Read the note →
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding-top:16px;border-top:1px solid ${COLORS.border};font-size:13px;">
            <div class="muted">— archive → <a href="https://heyosj.com/blog" class="link">heyosj.com/blog</a>
            · about → <a href="https://heyosj.com/about" class="link">heyosj.com/about</a></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<div class="muted" style="text-align:center;font-size:12px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  If the button doesn’t work: <a href="${link}" class="link">${link}</a>
</div>
`.trim();
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  return NextResponse.json({ ok: true, slug: params.slug, hint: "POST with ?key=… to send" });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const key = new URL(req.url).searchParams.get("key");
  if (!key || key !== process.env.BROADCAST_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Load post
  const post = await getPostBySlug(params.slug);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });

  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.heyosj.com").replace(/\/$/, "");
  const canonical = `${base}/blog/${post.slug}`;

  // Build HTML body in your site’s style (with H2 teasers)
  const sections = extractH2s(post.html, 3);
  const body = emailHTML({
    title: post.title,
    description: post.description,
    canonical,
    slug: post.slug,
    sections,
  });

  // Create & schedule email on Buttondown
  const subject = `new: ${post.title} — OSJ Dispatch`;
  const publish_date = new Date(Date.now() + 30_000).toISOString();

  const resp = await fetch("https://api.buttondown.com/v1/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
    },
    body: JSON.stringify({
      subject,
      body, // HTML supported
      status: "scheduled",
      publish_date,
      email_type: "public",
      canonical_url: canonical,
    }),
    cache: "no-store",
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    return NextResponse.json({ error: "buttondown create failed", detail }, { status: 502 });
  }

  const created = await resp.json();
  return NextResponse.json({
    ok: true,
    status: created.status,
    publish_date: created.publish_date,
    slug: post.slug,
  });
}
