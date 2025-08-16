// app/(site)/playbooks/page.tsx
import { getPlaybooksMeta } from '@/lib/playbooks';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'playbooks | heyosj',
  description:
    'Short, vendor-agnostic implementation notes you can roll out quickly.',
  openGraph: {
    title: 'playbooks | heyosj',
    description:
      'Short, vendor-agnostic implementation notes you can roll out quickly.',
    type: 'website',
    url: '/playbooks',
  },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)]/70 px-2.5 py-0.5 text-xs"
      // keep them “quiet”
      style={{ pointerEvents: 'none' }}
    >
      {children}
    </span>
  );
}

export default function PlaybooksPage() {
  const items = getPlaybooksMeta(); // server-only

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      {/* Hero / intro */}
      <div className="card p-6 md:p-8">
        <h1 className="text-4xl font-serif leading-tight">playbooks.</h1>
        <p className="muted mt-2">
          crisp, practical guides focused on rollouts — less theory, more shipping.
          each note spells out what to check, why it matters, and the minimum steps
          to implement.
        </p>
        <div className="mt-3 text-sm muted">
          {items.length} playbook{items.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* List */}
      <ul className="space-y-4">
        {items.map((p) => {
          const primaryTag = p.tags?.[0] ?? null;
          return (
            <li key={p.slug} className="card p-4">
              <div className="space-y-2">
                <Link
                  href={p.url}
                  className="text-lg font-semibold hover:underline"
                >
                  {p.title}
                </Link>
                <p className="muted">{p.description}</p>

                {/* meta row: date pill + (optional) single tag pill */}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Pill>{p.date}</Pill>
                  {primaryTag && <Pill>{primaryTag}</Pill>}
                </div>
              </div>
            </li>
          );
        })}

        {!items.length && (
          <li className="muted">no playbooks yet — check back soon.</li>
        )}
      </ul>
    </section>
  );
}
