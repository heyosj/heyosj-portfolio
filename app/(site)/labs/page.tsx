// app/(site)/labs/page.tsx
import Link from "next/link";
import { getAllLabs } from "@/lib/labs";

export const metadata = { title: "labs" };
export const runtime = "nodejs";

export default async function Labs() {
  const items = await getAllLabs();

  return (
    <section className="space-y-10">
      <h1 className="sr-only">labs</h1>

      <div className="card p-5 sm:p-6 md:p-7">
        <div className="space-y-3">
          <h2 className="font-serif leading-[1.15] text-3xl md:text-4xl">
            experiments, notes, research.
          </h2>
          <p className="muted text-base md:text-lg max-w-prose">
            hands-on writeups from ctfs, tooling trials, and small investigations —
            focused on what’s reproducible.
          </p>
        </div>
      </div>

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
