// app/dispatch/page.tsx
import SubscribeCTA from "@/components/SubscribeCTA";
import PostListItem from "@/components/PostListItem";
import SubscribeInline from "@/components/SubscribeInline";
import Link from "next/link";
import { getLatestPost, getRecentPosts } from "@/lib/posts";

export const metadata = { title: "dispatch" };

export default async function Dispatch() {
  const latestPost = await getLatestPost();
  const recent = await getRecentPosts(5);

  return (
    <section className="space-y-10">
      <div className="card p-5 sm:p-6 md:p-7">
        <div className="space-y-3">
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
          ) : (
            <p className="text-xs sm:text-sm leading-6 muted">
              get new notes whenever i post ’em. no spam.
            </p>
          )}

          <h1 className="font-serif leading-[1.15] text-3xl md:text-4xl">
            security notes, simply said.
          </h1>

          <p className="muted text-base md:text-lg max-w-prose">
            short, practical essays for security engineers and analysts alike.
          </p>

          <div className="pt-2">
            <SubscribeInline />
          </div>
        </div>
      </div>

      <div className="space-y-2">
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

      <SubscribeCTA />
    </section>
  );
}
