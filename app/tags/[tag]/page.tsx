// app/tags/[tag]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByTag } from "@/lib/posts";

export const dynamicParams = true;   // allow any /tags/:tag at runtime (no prebuild needed)
export const revalidate = 60;        // ISR: revalidate tag pages every 60s

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tagRaw = params.tag ?? "";
  const tag = decodeURIComponent(tagRaw);
  const posts = await getPostsByTag(tag);
  if (!posts.length) return notFound();

  const isSeries = tag.toLowerCase() === "email security";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">#{tag}</h1>
        {isSeries && (
          <div className="rounded-xl border border-border dark:border-border-dark p-4 text-sm">
            <strong>Suggested path:</strong> follow the posts in the order shown below.
          </div>
        )}
      </header>

      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug} className="rounded-xl border border-border dark:border-border-dark p-4">
            {/* Show "Step N" only for the series view; hide numbering for other tags */}
            {isSeries && p.order !== 999 && (
              <div className="text-xs opacity-60 mb-1">Step {p.order}</div>
            )}

            <Link href={`/blog/${p.slug}`} className="text-lg font-medium underline">
              {p.title}
            </Link>

            {!!p.description && (
              <p className="mt-1 text-sm opacity-80">{p.description}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2 text-xs opacity-70">
              {p.tags.map((t) => (
                <Link key={t} href={`/tags/${encodeURIComponent(t)}`} className="underline">
                  #{t}
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <nav className="pt-6">
        <Link href="/blog" className="underline">← Back to archive</Link>
      </nav>
    </main>
  );
}
