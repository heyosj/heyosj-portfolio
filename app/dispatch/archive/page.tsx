// app/dispatch/archive/page.tsx
import { getAllPosts } from "@/lib/posts";
import PostListItem from "@/components/PostListItem";

export const metadata = { title: "Archive · dispatch" };

export default async function DispatchArchive() {
  const posts = await getAllPosts();
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif">archive</h1>
        <p className="muted">every post, newest first.</p>
      </header>

      <div className="space-y-2">
        {posts.map((p) => (
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
