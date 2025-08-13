import Link from "next/link";
export default function PostListItem({ slug, title, description, date, readingTime }:{slug:string;title:string;description:string;date:string;readingTime:string;}){
  return (
    <Link href={`/blog/${slug}`} className="block group">
      <article className="rounded-xl border border-border bg-card p-5 shadow-sm group-hover:shadow-md transition">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <span className="text-xs muted whitespace-nowrap">{new Date(date).toLocaleDateString()} • {readingTime}</span>
        </div>
        <p className="muted mt-1">{description}</p>
      </article>
    </Link>
  );
}
