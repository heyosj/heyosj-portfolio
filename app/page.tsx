import SubscribeCTA from "@/components/SubscribeCTA";
import { getAllPosts } from "@/lib/posts";
import PostListItem from "@/components/PostListItem";

export default async function Home(){
  const posts = await getAllPosts();
  const latest = posts.slice(0,5);
  return (
    <section className="space-y-8">
      <div className="card">
        <p className="text-sm muted">OSJ Dispatch</p>
        <h1 className="text-3xl font-serif leading-tight mt-1">security notes, simply said.</h1>
        <p className="muted mt-2">short, practical essays for security engineers and leaders.</p>
      </div>
      <div className="space-y-2">
        {latest.map(p => (
          <PostListItem key={p.slug} slug={p.slug} title={p.title} description={p.description} date={p.date} readingTime={p.readingTime} />
        ))}
      </div>
      <SubscribeCTA />
    </section>
  );
}
