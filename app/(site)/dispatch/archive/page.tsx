// app/dispatch/archive/page.tsx
import { getAllPosts } from "@/lib/posts";
import PostListItem from "@/components/PostListItem";
import ActionChip from "@/components/ActionChip";

export const metadata = { title: "Archive · dispatch" };

function labelFromCategory(category: string) {
  return category.replace(/-/g, " ");
}

export default async function DispatchArchive({
  searchParams,
}: {
  searchParams?: { category?: string | string[] };
}) {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category))).sort((a, b) =>
    a.localeCompare(b)
  );
  const raw = typeof searchParams?.category === "string" ? searchParams.category : "all";
  const active = categories.includes(raw) ? raw : "all";
  const filtered = active === "all" ? posts : posts.filter((p) => p.category === active);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif">archive</h1>
        <p className="muted">every post, newest first.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <ActionChip href="/dispatch/archive" active={active === "all"}>
          all
        </ActionChip>
        {categories.map((c) => (
          <ActionChip
            key={c}
            href={`/dispatch/archive?category=${encodeURIComponent(c)}`}
            active={active === c}
          >
            {labelFromCategory(c)}
          </ActionChip>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
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
