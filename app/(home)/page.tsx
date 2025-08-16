// app/(home)/page.tsx
import Link from "next/link";

export const metadata = { title: "home" };

export default function Home() {
  return (
    <section className="space-y-8">
      <div className="card p-6 md:p-7">
        <h1 className="font-serif text-3xl md:text-4xl leading-tight">hi there — i’m oj.</h1>
        <p className="muted mt-2 max-w-prose">
          i love security, and this site is where i learn in public. from cloud to threat hunting to
          incident response, i’m documenting what i study, test, and break so i keep growing and share
          along the way.
        </p>
      </div>

      {/* stretch items so all cards are equal height */}
      <div className="grid gap-4 md:grid-cols-3 items-stretch">
        <HomeCard
          href="/dispatch"
          title="dispatch"
          blurb="personal security notes. what i’m learning, breaking down, and making sense of."
        />

        <HomeCard
          href="/playbooks"
          title="playbooks"
          blurb="repeatable scripts and workflows, with the reasoning behind when to run them."
        />

        <HomeCard
          href="/labs"
          title="labs"
          blurb="hands-on experiments, ctf writeups, and research from digging deeper."
        />
      </div>

      <p className="muted">
        say hi:{" "}
        <Link
          className="underline"
          href="https://www.linkedin.com/in/osanchezjr"
          target="_blank"
          rel="noopener noreferrer"
        >
          linkedin
        </Link>{" "}
        •{" "}
        <Link className="underline" href="https://x.com/heyosj" target="_blank" rel="noopener noreferrer">
          x
        </Link>{" "}
        •{" "}
        <Link className="underline" href="https://github.com/heyosj" target="_blank" rel="noopener noreferrer">
          github
        </Link>
      </p>
    </section>
  );
}

function HomeCard({ href, title, blurb }: { href: string; title: string; blurb: string }) {
  return (
    <Link href={href} className="block h-full group" aria-label={`${title}: ${blurb}`}>
      <div className="card h-full rounded-2xl border p-5 md:p-6 transition hover:-translate-y-[1px] hover:shadow-sm flex flex-col">
        <h2 className="font-serif text-lg md:text-xl">{title}</h2>
        <p className="muted mt-2 text-sm">{blurb}</p>

        {/* arrow pinned to bottom; aligns across all cards */}
        <span className="mt-auto inline-flex items-center gap-2 text-base" aria-hidden>
          <span className="translate-y-[1px] transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
