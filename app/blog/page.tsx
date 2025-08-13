import { getAllPosts } from "@/lib/posts";
import PostListItem from "@/components/PostListItem";
export const metadata = { title: "Archive" };
export default async function BlogIndex(){
  const posts = await getAllPosts();
  return <section className="space-y-2">{posts.map(p => (
    <PostListItem key={p.slug} slug={p.slug} title={p.title} description={p.description} date={p.date} readingTime={p.readingTime} />
  ))}</section>;
}
