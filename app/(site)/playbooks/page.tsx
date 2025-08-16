import Link from "next/link";

export const metadata = { title: "playbooks" };

export default function Playbooks() {
  const items: Array<{ title: string; blurb: string; href: string }> = [];

  return (
    <section className="space-y-10">
      {/* keep a semantic section title for SEO/a11y */}
      <h1 className="sr-only">playbooks</h1>

      {/* HERO (matches dispatch card sizing) */}
      <div className="card p-5 sm:p-6 md:p-7">
        <div className="space-y-3">
          <h2 className="font-serif leading-[1.15] text-3xl md:text-4xl">
            concise playbooks, ready to run.
          </h2>
          <p className="muted text-base md:text-lg max-w-prose">
            guides, checklists, and repeatable workflows. each one pairs a script with
            when/why to use it and how to verify it worked.
          </p>
        </div>
      </div>

      {/* LIST / EMPTY STATE */}
      {items.length === 0 ? (
        <div className="card p-5 sm:p-6">
          <p className="muted">
            nothing here yet — i’ll add actionable guides soon. for now, see{" "}
            <Link href="/dispatch" className="underline">dispatch</Link>.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {items.map((it) => (
            <li key={it.title} className="card p-5">
              <h3 className="font-serif text-xl">
                <Link href={it.href} className="underline">{it.title}</Link>
              </h3>
              <p className="muted mt-1">{it.blurb}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
