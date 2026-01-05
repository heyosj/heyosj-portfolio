// app/dispatch/page.tsx
import PostListItem from "@/components/PostListItem";
import ActionChip from "@/components/ActionChip";
import Link from "next/link";
import { getAllPosts, getLatestPost } from "@/lib/posts";

export const metadata = { title: "dispatch" };

function labelFromCategory(category: string) {
  return category.replace(/-/g, " ");
}

export default async function Dispatch({
  searchParams,
}: {
  searchParams?: { category?: string | string[] };
}) {
  const [latestPost, allPosts] = await Promise.all([getLatestPost(), getAllPosts()]);
  const categories = Array.from(new Set(allPosts.map((p) => p.category))).sort((a, b) =>
    a.localeCompare(b)
  );
  const raw = typeof searchParams?.category === "string" ? searchParams.category : "all";
  const active = categories.includes(raw) ? raw : "all";
  const filtered = active === "all" ? allPosts : allPosts.filter((p) => p.category === active);
  const recent = filtered.slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="card p-5 sm:p-6 md:p-7">
        <div className="space-y-3">
          {/* <p className="text-xs muted">
            <Link href="/" className="underline">← home</Link>
          </p> */}
          {latestPost ? (
            <p className="text-xs sm:text-sm leading-6 muted">
              latest:{" "}
              <Link
                href={`/dispatch/${latestPost.slug}`}
                className="underline underline-offset-2 decoration-accent hover:decoration-accent-600"
              >
                {latestPost.title}
              </Link>
            </p>
          ) : null}

          <h1 className="font-serif leading-[1.15] text-3xl md:text-4xl">
            security notes, simply said.
          </h1>

          <p className="muted text-base md:text-lg max-w-prose">
            short, practical essays for security engineers and analysts alike.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ActionChip href="/dispatch" active={active === "all"}>
          all
        </ActionChip>
        {categories.map((c) => (
          <ActionChip
            key={c}
            href={`/dispatch?category=${encodeURIComponent(c)}`}
            active={active === c}
          >
            {labelFromCategory(c)}
          </ActionChip>
        ))}
      </div>

      <div className="space-y-3">
        {recent.map((p) => (
          <PostListItem
            key={p.slug}
            slug={p.slug}
            title={p.title}
            description={p.description}
            date={p.date}
            readingTime={p.readingTime}
          />
        ))}
      </div>
    </section>
  );
}
