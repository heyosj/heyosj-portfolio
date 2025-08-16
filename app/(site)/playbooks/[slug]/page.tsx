// app/(site)/playbooks/[slug]/page.tsx
import { getPlaybook } from '@/lib/playbooks';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// tiny helper for quiet pills (no hover)
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)]/70 px-2.5 py-0.5 text-xs">
      {children}
    </span>
  );
}

// MDX elements styled with your CSS vars
const components = {
  h2: (p: any) => <h2 className="mt-10 text-2xl font-semibold" {...p} />,
  h3: (p: any) => <h3 className="mt-8 text-xl font-semibold" {...p} />,
  p:  (p: any) => <p className="leading-relaxed" {...p} />,
  ul: (p: any) => <ul className="list-disc pl-6 space-y-2" {...p} />,
  ol: (p: any) => <ol className="list-decimal pl-6 space-y-2" {...p} />,
  blockquote: (p: any) => (
    <blockquote className="border-l-4 border-[var(--border)] pl-4 italic" {...p} />
  ),
  code: (p: any) => (
    <code
      className="rounded-md border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 text-[0.95em] text-[var(--ink)]"
      {...p}
    />
  ),
  pre: (p: any) => (
    <pre
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--ink)] overflow-x-auto p-4 text-sm"
      {...p}
    />
  ),
};

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const { meta } = getPlaybook(params.slug);
    return {
      title: `${meta.title} — Playbooks`,
      description: meta.description,
      keywords: meta.tags,
      alternates: { canonical: `/playbooks/${meta.slug}` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        type: 'article',
        url: `/playbooks/${meta.slug}`,
      },
    };
  } catch {
    return { title: 'Playbook not found' };
  }
}

export default function PlaybookPage({ params }: { params: { slug: string } }) {
  let playbook;
  try {
    playbook = getPlaybook(params.slug);
  } catch {
    notFound();
  }

  const { meta, content } = playbook!;
  const primaryTag = meta.tags?.[0];

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {/* breadcrumb / back link */}
      <nav aria-label="Breadcrumb" className="mb-1">
        <Link
          href="/playbooks"
          className="inline-flex items-center gap-1 text-sm muted hover:underline"
        >
          <span aria-hidden>←</span>
          <span>Back to playbooks</span>
        </Link>
      </nav>

      {/* HEADER CARD — separates meta from body */}
      <header className="card p-6 md:p-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif leading-tight">{meta.title}</h1>
          {meta.description && <p className="muted">{meta.description}</p>}
        </div>

        {/* quiet meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <Pill>{meta.date}</Pill>
          {primaryTag && <Pill>{primaryTag}</Pill>}

          {/* repo pill (text only; small, subtle) */}
          {meta.repo ? (
            <a
              href={meta.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs"
            >
              github repo <span aria-hidden className="ml-1">↗</span>
            </a>
          ) : null}
        </div>
      </header>

      {/* BODY */}
      <div className="space-y-6">
        <MDXRemote source={content} components={components} />
      </div>
    </article>
  );
}
