// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import ShareBar from "@/components/ShareBar";

type TocItem = { id: string; text: string; index: number };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const re = /<h2([^>]*)>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(html))) {
    const attrs = m[1] || "";
    const inner = m[2] || "";
    const idMatch = attrs.match(/\sid="([^"]+)"/i);
    const id = idMatch ? idMatch[1] : slugify(inner);
    const text = inner.replace(/<[^>]+>/g, "").trim();
    items.push({ id, text, index: i++ });
  }
  return items;
}

// Ensure every <h2> has an id (matching our TOC)
function injectIdsIntoH2(html: string): string {
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    if (/\sid="/i.test(attrs)) return `<h2${attrs}>${inner}</h2>`;
    const id = slugify(inner);
    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
}

// Remove any trailing <hr> at the very end of the article HTML
function trimTrailingHr(html: string): string {
  return html.replace(/(?:<hr[^>]*>\s*)+$/i, "");
}

function pickKeySections(toc: TocItem[]) {
  const prefer = [
    /tl;?dr|summary/i,
    /goals?/i,
    /why|context|background/i,
    /how|implementation/i,
    /checklist/i,
    /conclusion/i,
  ];
  const score = (t: string) => {
    const i = prefer.findIndex((rx) => rx.test(t));
    return i === -1 ? 999 : i;
  };
  return toc
    .slice()
    .sort((a, b) => score(a.text) - score(b.text))
    .slice(0, 4)
    .sort((a, b) => a.index - b.index);
}

// ------- Metadata for SEO / link previews -------
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.heyosj.com").replace(/\/$/, "");
  const url = `${base}/dispatch/${post.slug}`;
  const title = `${post.title} – heyosj`;
  const description = post.description || "Security notes, simply said.";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      tags: post.tags,
      publishedTime: post.date,
      modifiedTime: (post as any).updated || post.date,
      siteName: "heyosj",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}
// ------------------------------------------------

import { getAllPosts as _getAllPosts } from "@/lib/posts";
export async function generateStaticParams() {
  const posts = await _getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  // Build TOC + inject ids so anchors work
  const toc = extractToc(post.html);
  const keySections = pickKeySections(toc);
  const htmlWithIds = injectIdsIntoH2(post.html);
  const htmlClean = trimTrailingHr(htmlWithIds);

  // Tags
  const tags: string[] = Array.isArray((post as any).tags) ? (post as any).tags : [];
  const isSeries = tags.map((t) => t.toLowerCase()).includes("email security");

  // -------- Prev/Next + series context --------
  const all = await getAllPosts(); // already sorted by order -> date
  let prev: typeof post | null = null;
  let next: typeof post | null = null;
  let seriesIndex: number | null = null;
  let seriesTotal: number | null = null;

  if (isSeries) {
    const series = all.filter((p) =>
      p.tags.map((t) => t.toLowerCase()).includes("email security")
    );
    const idx = series.findIndex((p) => p.slug === post.slug);
    seriesIndex = idx >= 0 ? idx + 1 : null; // 1-based
    seriesTotal = series.length;
    if (idx > 0) prev = series[idx - 1];
    if (idx >= 0 && idx < series.length - 1) next = series[idx + 1];
  } else {
    const byDate = [...all].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    const idx = byDate.findIndex((p) => p.slug === post.slug);
    if (idx > 0) prev = byDate[idx - 1];
    if (idx >= 0 && idx < byDate.length - 1) next = byDate[idx + 1];
  }
  // ---------------------------------

  // Related posts (de-dupe prev/next)
  let related = await getRelatedPosts(post.slug, 3);
  const exclude = new Set<string>();
  if (prev) exclude.add(prev.slug);
  if (next) exclude.add(next.slug);
  related = related.filter((r) => !exclude.has(r.slug));

  // -------- JSON-LD Article schema --------
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.heyosj.com";
  const url = `${base}/dispatch/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: "O. Sanchez Jr." },
    keywords: post.tags?.join(", "),
    datePublished: post.date,
    dateModified: (post as any).updated || post.date,
    url,
  };
  // ----------------------------------------

  return (
    <article className="space-y-6" id="top">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-serif leading-tight">{post.title}</h1>

        {/* Tags (link to /tags/[tag]) */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((t) => (
              <Link
                key={t}
                href={`/dispatch/tags/${encodeURIComponent(t)}`}
                className="text-[11px] px-2.5 py-0.5 rounded-full
                           border border-border dark:border-border-dark
                           bg-card dark:bg-card-dark
                           text-subtext dark:text-subtext-dark
                           hover:!bg-accent/10 hover:!border-accent hover:!text-ink dark:hover:!text-paper
                           transition-colors"
                aria-label={`View posts tagged ${t}`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        <p className="text-lg muted">{post.description}</p>
        <p className="text-sm muted">
          {new Date(post.date).toLocaleDateString()}
          {(post as any).updated && (post as any).updated !== post.date && (
            <> • Updated {new Date((post as any).updated).toLocaleDateString()}</>
          )}
          {" • "}
          {post.readingTime}
        </p>
        <ShareBar title={post.title} />

        {/* Key Sections Pills */}
        {keySections.length >= 2 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {keySections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full
                           border border-border dark:border-border-dark
                           bg-card dark:bg-card-dark
                           text-ink dark:text-ink-dark
                           hover:!bg-accent hover:!border-accent
                           hover:!text-ink dark:hover:!text-paper
                           transition-colors duration-150 cursor-pointer
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`Jump to ${s.text}`}
              >
                {s.text}
              </a>
            ))}
          </div>
        )}

        {/* Series banner (accent tint) */}
        {isSeries && seriesIndex && seriesTotal && (
          <div
            className="
              mt-3 rounded-xl border
              border-accent/30
              bg-accent/10 dark:bg-accent/15
              px-3 py-2 text-sm
            "
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-medium">Email Security</span>
                <span className="opacity-75">— Step {seriesIndex} of {seriesTotal}</span>
              </div>
              <Link
                href="/dispatch/tags/email%20security"
                className="underline underline-offset-2 hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                View the full series →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ARTICLE BODY */}
      <div
        className={[
          "prose prose-slate max-w-prose dark:prose-invert",
          "prose-headings:font-serif prose-a:font-semibold",
          "prose-a:text-accent hover:prose-a:text-accent-600",
          "prose-blockquote:border-l-border dark:prose-blockquote:border-l-border-dark",
          "prose-hr:border-border dark:prose-hr:border-border-dark",
          "prose-code:bg-card dark:prose-code:bg-card-dark",
          "prose-code:text-ink dark:prose-code:text-ink-dark",
          "prose-pre:bg-card dark:prose-pre:bg-card-dark",
          "prose-pre:border prose-pre:border-border dark:prose-pre:border-border-dark",
          "prose-headings:scroll-mt-28",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: htmlClean }}
      />

      {/* Related posts */}
      {related.length > 0 && (
        <>
          <hr className="border-border dark:border-border-dark" />
          <section className="space-y-3">
            <div className="text-xs uppercase tracking-wide opacity-60">
              Related posts
            </div>
            <ul className="grid gap-3">
              {related.map((r) => (
                <li key={r.slug} className="text-sm">
                  <Link href={`/dispatch/${r.slug}`} className="underline">
                    {r.title}
                  </Link>
                  {r.description && (
                    <div className="opacity-70">{r.description}</div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* Divider before nav */}
      <hr className="border-border dark:border-border-dark" />

      {/* Prev / Next section */}
      {(prev || next) && (
        <section className="space-y-3">
          <div className="text-xs uppercase tracking-wide opacity-60">
            {isSeries ? "In this series" : "Keep reading"}
          </div>

          <nav className="grid gap-3 sm:flex sm:items-start sm:justify-between text-sm">
            {prev ? (
              <div className="sm:max-w-[48%]">
                <div className="text-[11px] opacity-60 mb-1">
                  {isSeries ? "Previous in series" : "Previous"}
                </div>
                <Link href={`/dispatch/${prev.slug}`} className="underline">
                  ← {prev.title}
                </Link>
              </div>
            ) : (
              <span />
            )}

            {next ? (
              <div className="sm:max-w-[48%] text-left sm:text-right">
                <div className="text-[11px] opacity-60 mb-1">
                  {isSeries ? "Next in series" : "Next"}
                </div>
                <Link href={`/dispatch/${next.slug}`} className="underline">
                  {next.title} →
                </Link>
              </div>
            ) : (
              <span />
            )}
          </nav>
        </section>
      )}

      {/* Quiet footer row */}
      <hr className="border-border dark:border-border-dark" />
      <nav className="flex items-center justify-between text-sm pt-2">
        <Link href="/dispatch" className="underline">
          ← Back to archive
        </Link>
        <a
          className="underline"
          href="https://x.com/heyosj"
          target="_blank"
          rel="noreferrer"
        >
          Follow
        </a>
      </nav>
    </article>
  );
}
