// app/(site)/labs/page.tsx
import Link from "next/link";
import { getAllLabs } from "@/lib/labs";

export const metadata = { title: "labs" };
export const runtime = "nodejs";

export default async function Labs() {
  const items = await getAllLabs();
  const latest = items[0];

  return (
    <section className="space-y-6">
      <h1 className="sr-only">labs</h1>

      <header className="card p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif leading-[1.15] text-3xl md:text-4xl">
              experiments, notes, research.
            </h2>
            <p className="muted text-base md:text-lg max-w-prose mt-2">
              hands-on writeups from ctfs, tooling trials, and small investigations —
              focused on what’s reproducible.
            </p>
          </div>

          {latest && (
            <Link
              href={`/labs/${latest.slug}`}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm shrink-0"
            >
              open latest <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </header>

      {items.length === 0 ? (
        <div className="card p-5 sm:p-6">
          <p className="muted">
            nothing here yet — i’ll post concise writeups as i go. meanwhile, check{" "}
            <Link href="/dispatch" className="underline">dispatch</Link>.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {items.map((it) => (
            <li key={it.slug} className="card p-5">
              <h3 className="font-serif text-xl">
                <Link href={`/labs/${it.slug}`} className="underline">
                  {it.title}
                </Link>
              </h3>
              {it.summary ? <p className="muted mt-1">{it.summary}</p> : null}
              <p className="muted mt-1 text-sm">{new Date(it.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
