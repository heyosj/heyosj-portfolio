// app/(site)/playbooks/page.tsx
import Link from "next/link";
import { getPlaybooksMeta, type PlaybookMeta } from "@/lib/playbooks";

export const metadata = { title: "playbooks" };

export default async function PlaybooksPage() {
  const items = await getPlaybooksMeta();
  const latest = items[0];

  return (
    <section className="space-y-6">
      {/* hero — identical structure to labs */}
      <header className="card p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl leading-tight">scripts &amp; tools.</h1>
            <p className="muted mt-2 max-w-prose">
              when a problem repeats, i script it. when the script is useful, it lands here with
              setup, commands, and troubleshooting.
            </p>
          </div>

          {latest && (
            <Link
              href={latest.url}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm shrink-0"
            >
              open latest <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </header>

      {/* list */}
      <ol className="space-y-3">
        {items.map((pb) => (
          <li key={pb.slug}>
            <PlaybookListItem meta={pb} />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- local ---------- */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-[2px] text-[11px] leading-5">
      {children}
    </span>
  );
}

function PlaybookListItem({ meta }: { meta: PlaybookMeta }) {
  return (
    <Link href={meta.url} className="block group" aria-label={meta.title}>
      <article className="rounded-xl border border-border bg-card p-5 shadow-sm group-hover:shadow-md transition">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">{meta.title}</h2>
          <span className="text-xs muted whitespace-nowrap">
            {new Date(meta.date).toLocaleDateString()}
          </span>
        </div>

        {meta.description && <p className="muted mt-1">{meta.description}</p>}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {meta.tags.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
          {meta.repo && <Chip>repo</Chip>}
        </div>
      </article>
    </Link>
  );
}
