// app/page.tsx
import SubscribeCTA from "@/components/SubscribeCTA";
import { getAllPosts } from "@/lib/posts";
import PostListItem from "@/components/PostListItem";
import SubscribeInline from "../components/SubscribeInline"; // relative path to components
import Link from "next/link";

export default async function Home() {
  const posts = await getAllPosts();
  const latest = posts.slice(0, 5);

  return (
    <section className="space-y-10">
      {/* HERO */}
      <div className="card p-5 sm:p-6 md:p-7">
        <div className="space-y-2 sm:space-y-3">
          {posts.length > 0 ? (
            <p className="text-xs sm:text-sm leading-6 muted">
              latest:{" "}
              <Link
                href={`/blog/${posts[0].slug}`}
                className="underline underline-offset-2 decoration-accent hover:decoration-accent-600"
              >
                {posts[0].title}
              </Link>
            </p>
          ) : (
            <p className="text-xs sm:text-sm leading-6 muted">
              new notes 1–2×/month
            </p>
          )}

          <h1 className="font-serif leading-[1.15] text-3xl md:text-4xl">
            security notes, simply said.
          </h1>

          <p className="muted text-base md:text-lg max-w-prose">
            short, practical essays for security engineers and analysts alike.
          </p>

          {/* subscribe button (expands to input on click) */}
          <div className="pt-2">
            <SubscribeInline />
          </div>
        </div>
      </div>

      {/* LATEST POSTS */}
      <div className="space-y-2">
        {latest.map((p) => (
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

      {/* SOCIAL CARD */}
      <SubscribeCTA />
    </section>
  );
}
