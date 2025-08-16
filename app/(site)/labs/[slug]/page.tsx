// app/(site)/labs/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllLabs, getLabBySlug } from "@/lib/labs";

export const runtime = "nodejs";

export async function generateStaticParams() {
  const items = await getAllLabs();
  return items.map((it) => ({ slug: it.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const lab = await getLabBySlug(params.slug);
  if (!lab) return { title: "Lab not found" };
  return {
    title: lab.meta.title,
    description: lab.meta.description,
    openGraph: { title: lab.meta.title, description: lab.meta.description, type: "article" },
  };
}

export default async function LabPage({ params }: { params: { slug: string } }) {
  const [lab, all] = await Promise.all([getLabBySlug(params.slug), getAllLabs()]);
  if (!lab) return notFound();

  const i = all.findIndex((x) => x.slug === params.slug);
  const prev = i > 0 ? all[i - 1] : null;
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null;

  return (
    <article className="prose dark:prose-invert">
      {/* breadcrumb with back */}
      <nav aria-label="breadcrumb" className="mb-2 text-sm flex items-center min-w-0">
        <Link href="/labs" className="inline-flex items-center gap-1 underline shrink-0">
          <span aria-hidden>←</span> labs
        </Link>
        <span className="mx-1.5 muted shrink-0">/</span>
        <span className="truncate" aria-current="page">{lab.meta.title}</span>
      </nav>

      <h1 className="font-serif">{lab.meta.title}</h1>

      {/* meta strip: date + read time */}
      {(lab.meta.date || lab.meta.readMin) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {lab.meta.date && (
            <span className="rounded-full border border-border/60 dark:border-border-dark/60 px-2 py-0.5">
              {new Date(lab.meta.date).toLocaleDateString()}
            </span>
          )}
          {lab.meta.readMin && (
            <span className="rounded-full border border-border/60 dark:border-border-dark/60 px-2 py-0.5">
              {lab.meta.readMin} min read
            </span>
          )}
        </div>
      )}

      <div className="mt-4" />
      {lab.mdx}

      <hr className="my-10 border-border dark:border-border-dark" />

      {/* bottom pager */}
      <nav aria-label="lab pagination" className="grid grid-cols-3 items-center text-sm">
        <div className="min-w-0">
          {prev && (
            <Link href={`/labs/${prev.slug}`} rel="prev" className="underline block truncate">
              ← {prev.title}
            </Link>
          )}
        </div>
        <div className="text-center">
          <Link href="/labs" className="underline">back to labs</Link>
        </div>
        <div className="min-w-0 text-right">
          {next && (
            <Link href={`/labs/${next.slug}`} rel="next" className="underline block truncate">
              {next.title} →
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
