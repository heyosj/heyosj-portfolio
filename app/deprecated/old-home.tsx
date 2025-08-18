// app/page.tsx
import Link from "next/link";

export const metadata = { title: "heyosj" };

export default function Home() {
  return (
    <section className="space-y-8">
      {/* hero */}
      <div className="card p-6 md:p-7">
        <h1 className="font-serif text-3xl md:text-4xl leading-tight">
          hey — i’m oj.
        </h1>
        <p className="muted mt-2 max-w-prose">
          short, practical security notes — cloud, email, and incident response.
          vendor-agnostic. focused on what you can actually ship.
        </p>
      </div>

      {/* three cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <HomeCard href="/dispatch" title="dispatch" blurb="security notes & quick wins." />
        <HomeCard href="/playbooks" title="playbooks" blurb="scripts with when/why to use." />
        <HomeCard href="/labs" title="labs" blurb="experiments, ctf notes, research." />
      </div>

      {/* contact (inline, minimal) */}
      <p className="muted">
        say hi:
        {" "}
        <Link className="underline" href="https://www.linkedin.com/in/heyosj" target="_blank">linkedin</Link>
        {"  "}
        <Link className="underline" href="https://x.com/heyosj" target="_blank">x</Link>
        {"  "}
        <Link className="underline" href="https://github.com/heyosj" target="_blank">github</Link>
      </p>
    </section>
  );
}

/** lightweight card component (local) */
function HomeCard({ href, title, blurb }: { href: string; title: string; blurb: string }) {
  return (
    <Link
      href={href}
      aria-label={`${title}: ${blurb}`}
      className={[
        "card p-5 md:p-6 transition",
        "hover:-translate-y-[1px] hover:shadow-sm",
        "hover:border-accent/60 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent rounded-2xl",
        "border border-border dark:border-border-dark"
      ].join(" ")}
    >
      <h2 className="font-serif text-lg md:text-xl">{title}</h2>
      <p className="muted mt-1 text-sm">{blurb}</p>
      <span className="mt-3 inline-block" aria-hidden>→</span>
    </Link>
  );
}
