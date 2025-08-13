import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import RSS from "rss";

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const feed = new RSS({ title: "OSJ Dispatch", site_url: site, feed_url: `${site}/rss.xml`, description: "Security notes by OSJ" });
  const posts = await getAllPosts();
  posts.forEach(p => feed.item({ title: p.title, url: `${site}/blog/${p.slug}`, date: p.date, description: p.description }));
  return new NextResponse(feed.xml({ indent: true }), { headers: { "Content-Type": "application/rss+xml" } });
}
