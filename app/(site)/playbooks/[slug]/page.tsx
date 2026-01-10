// app/(site)/playbooks/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPlaybook, getPlaybooksMeta } from "@/lib/playbooks";

export async function generateStaticParams() {
  const items = await getPlaybooksMeta();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const pb = await getPlaybook(params.slug);   // ✅ await the promise
  if (!pb) return {};
  return {
    title: `${pb.meta.title} — Playbooks`,
    description: pb.meta.description,
    openGraph: {
      type: "article",
      title: pb.meta.title,
      description: pb.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: pb.meta.title,
      description: pb.meta.description,
    },
  };
}

export default async function PlaybookPage({ params }: { params: { slug: string } }) {
  const pb = await getPlaybook(params.slug);
  if (!pb) return notFound();

  return (
    <article className="space-y-6" id="top">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif leading-tight">{pb.meta.title}</h1>
        {pb.meta.description && <p className="muted">{pb.meta.description}</p>}
        <p className="text-sm muted">
          {pb.meta.date ? new Date(pb.meta.date).toLocaleDateString() : ""}
          {pb.meta.readMin ? <> • {pb.meta.readMin} min</> : null}
        </p>
      </header>

      <div className="article-content prose prose-slate max-w-prose dark:prose-invert">
        {/* Use raw content with MDXRemote (as your current page does) */}
        <MDXRemote source={pb.content} />
        {/* Or render the compiled node directly: {pb.mdx} */}
      </div>
    </article>
  );
}
