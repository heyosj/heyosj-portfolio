// app/(site)/playbooks/page.tsx
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getPlaybooksMeta, type PlaybookMeta } from "@/lib/playbooks";

export const metadata = { title: "playbooks" };
export const revalidate = 0; // ensure fresh read

function ts(m: PlaybookMeta) {
  // prefer updated if present, else date
  return +new Date((m as any).updated ?? m.date);
}

export default async function PlaybooksPage() {
  noStore();
  const items = await getPlaybooksMeta();

  // sort newest -> oldest once; reuse for button + list
  const sorted = [...items].sort((a, b) => ts(b) - ts(a));
  const latest = sorted[0];

  return (
    <section className="space-y-6">
      {/* hero — identical structure to labs, but responsive button */}
      <header className="card p-6 md:p-7">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start md:gap-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl leading-tight">scripts &amp; tools.</h1>
            <p className="muted mt-2 max-w-prose">
              when a problem repeats, i script it. when the script is useful, it lands here with
              setup, commands, and troubleshooting.
            </p>
          </div>

          {latest && (
            <Link
              href={latest.url ?? `/playbooks/${latest.slug}`}
              className="
                inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)]
                text-sm px-3 py-1.5
                w-full justify-center mt-1
                md:w-auto md:justify-normal md:mt-0
              "
              aria-label={`open latest: ${latest.title}`}
              prefetch
            >
              open latest <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </header>

      {/* list */}
      <ol className="space-y-3">
        {sorted.map((pb) => (
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
    <Link
      href={meta.url ?? `/playbooks/${meta.slug}`}
      className="block group"
      aria-label={meta.title}
      prefetch
    >
      <article className="rounded-xl border border-border bg-card p-5 shadow-sm group-hover:shadow-md transition">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">{meta.title}</h2>
          <span className="text-xs muted whitespace-nowrap">
            {new Date((meta as any).updated ?? meta.date).toLocaleDateString()}
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
