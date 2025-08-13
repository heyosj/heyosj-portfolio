import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import ShareBar from "@/components/ShareBar";

export async function generateStaticParams(){ const posts = await getAllPosts(); return posts.map(p=>({slug:p.slug})); }

export default async function PostPage({ params }:{params:{slug:string}}){
  const post = await getPostBySlug(params.slug);
  if(!post) return notFound();
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm muted">OSJ Dispatch</p>
        <h1 className="text-3xl font-serif leading-tight">{post.title}</h1>
        <p className="text-lg muted">{post.description}</p>
        <p className="text-sm muted">{new Date(post.date).toLocaleDateString()} • {post.readingTime}</p>
        <ShareBar title={post.title} />
      </header>
      <div className="prose prose-zinc max-w-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      <hr className="border-border" />
      <nav className="flex items-center justify-between text-sm">
        <Link href="/blog" className="underline">← Back to archive</Link>
        <a className="underline" href="https://x.com/heyosj" target="_blank">Follow</a>
      </nav>
    </article>
  );
}
