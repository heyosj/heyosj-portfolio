import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
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

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  // Build TOC + inject ids so anchors work
  const toc = extractToc(post.html);
  const keySections = pickKeySections(toc);
  const htmlWithIds = injectIdsIntoH2(post.html);

  // Optional tags support: show if present (e.g., ["email security","detection"])
  const tags: string[] = Array.isArray((post as any).tags) ? (post as any).tags : [];

  return (
    <article className="space-y-6" id="top">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-serif leading-tight">{post.title}</h1>

        {/* Tags (optional) */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2.5 py-0.5 rounded-full
                           border border-border dark:border-border-dark
                           bg-card dark:bg-card-dark
                           text-subtext dark:text-subtext-dark
                           hover:!bg-accent/10 hover:!border-accent hover:!text-ink dark:hover:!text-paper
                           transition-colors"
                aria-label={`Tag: ${t}`}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <p className="text-lg muted">{post.description}</p>
        <p className="text-sm muted">
          {new Date(post.date).toLocaleDateString()} • {post.readingTime}
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
          "prose-pre:text-ink dark:prose-pre:text-ink-dark",
          "prose-pre:border prose-pre:border-border dark:prose-pre:border-border-dark",
          // smooth jumps: make headings land below top by ~7rem
          "prose-headings:scroll-mt-28",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: htmlWithIds }}
      />

      <hr className="border-border dark:border-border-dark" />

      <nav className="flex items-center justify-between text-sm">
        <Link href="/blog" className="underline">
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
