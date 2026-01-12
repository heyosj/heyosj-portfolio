// app/(site)/labs/[slug]/page.tsx
import { getLabBySlug } from '@/lib/labs';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)]/70 px-2.5 py-0.5 text-xs">
      {children}
    </span>
  );
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const lab = await getLabBySlug(params.slug);
  if (!lab) return { title: 'Lab not found' };

  const { meta } = lab;
  return {
    title: `${meta.title} — labs`,
    description: meta.description,
    keywords: meta.tags,
    alternates: { canonical: `/labs/${params.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      url: `/labs/${params.slug}`,
    },
  };
}

export default async function LabPage({ params }: { params: { slug: string } }) {
  const lab = await getLabBySlug(params.slug);
  if (!lab) notFound();

  const { meta, mdx } = lab;
  const primaryTag = meta.tags?.[0];
  const formattedDate = meta.date
    ? new Date(`${meta.date}T00:00:00Z`).toLocaleDateString("en-US")
    : "";

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-1">
        {/* <Link
          href="/labs"
          className="inline-flex items-center gap-1 text-sm muted hover:underline"
        >
          <span aria-hidden>←</span>
          <span>Back to labs</span>
        </Link> */}
      </nav>

      {/* HEADER CARD */}
      <header className="card space-y-4 p-5 sm:p-6 md:p-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif leading-tight">{meta.title}</h1>
          {meta.description && <p className="muted text-sm sm:text-base">{meta.description}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {formattedDate && <Pill>{formattedDate}</Pill>}
          {meta.readMin > 0 && <Pill>{meta.readMin} min read</Pill>}
        </div>
      </header>

      {/* BODY (already compiled to a React node) */}
      <div className="article-content space-y-6">
        {mdx}
      </div>
    </article>
  );
}
