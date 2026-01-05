// app/(site)/labs/page.tsx
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getAllLabs } from "@/lib/labs";
import ActionChip from "@/components/ActionChip";

export const metadata = { title: "labs" };
export const runtime = "nodejs";
export const revalidate = 0;

function toTs(dateStr: string): number {
  // keep this in sync with lib/labs.ts logic (lightweight version for “latest”)
  // supports: YYYY-MM-DD, MM-DD-YYYY, M/D/YYYY
  const s = String(dateStr || "").trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return Date.parse(`${s}T00:00:00Z`);

  // MM-DD-YYYY
  const mmddyyyy = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (mmddyyyy) {
    const [, mm, dd, yyyy] = mmddyyyy;
    const iso = `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
    return Date.parse(`${iso}T00:00:00Z`);
  }

  // M/D/YYYY
  const mdyyyy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdyyyy) {
    const [, m, d, y] = mdyyyy;
    const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return Date.parse(`${iso}T00:00:00Z`);
  }

  const t = Date.parse(s);
  return Number.isFinite(t) ? t : 0;
}

function formatDate(dateStr: string) {
  const ts = toTs(dateStr);
  if (!ts) return dateStr || "";
  return new Date(ts).toLocaleDateString();
}

function labelFromCategory(category: string) {
  return category.replace(/-/g, " ");
}

export default async function Labs({
  searchParams,
}: {
  searchParams?: { category?: string | string[] };
}) {
  noStore();
  const items = await getAllLabs();
  const categories = Array.from(new Set(items.map((i) => i.category))).sort((a, b) =>
    a.localeCompare(b)
  );
  const raw = typeof searchParams?.category === "string" ? searchParams.category : "all";
  const active = categories.includes(raw) ? raw : "all";
  const filtered = active === "all" ? items : items.filter((i) => i.category === active);

  // “open latest” should mean newest-by-date, not “first item in list”
  const latest =
    filtered.length > 0
      ? [...filtered].sort((a, b) => toTs(b.date) - toTs(a.date))[0]
      : null;

  return (
    <section className="space-y-6">
      <h1 className="sr-only">labs</h1>

      <header className="card p-6 md:p-7">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start md:gap-6">
          <div>
            <h2 className="font-serif leading-[1.15] text-3xl md:text-4xl">
              experiments, notes, research.
            </h2>
            <p className="muted text-base md:text-lg max-w-prose mt-2">
              hands-on writeups from ctfs, tooling trials, and small investigations — focused on what’s reproducible.
            </p>
          </div>

          {latest && (
            <Link
              href={`/labs/${latest.slug}`}
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

      <div className="flex flex-wrap gap-2">
        <ActionChip href="/labs" active={active === "all"}>
          all
        </ActionChip>
        {categories.map((c) => (
          <ActionChip
            key={c}
            href={`/labs?category=${encodeURIComponent(c)}`}
            active={active === c}
          >
            {labelFromCategory(c)}
          </ActionChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-5 sm:p-6">
          <p className="muted">
            nothing here yet — i’ll post concise writeups as i go. meanwhile, check{" "}
            <Link href="/dispatch" className="underline">
              dispatch
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((it) => (
            <li key={it.slug} className="card p-5">
              <h3 className="font-serif text-xl">
                <Link href={`/labs/${it.slug}`} className="underline" prefetch>
                  {it.title}
                </Link>
              </h3>
              {it.summary ? <p className="muted mt-1">{it.summary}</p> : null}
              <p className="muted mt-1 text-sm">{formatDate(it.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
