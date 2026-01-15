// app/(home)/page.tsx
import Link from "next/link";
import MailLink from "@/components/MailLink";
import { getAllLabs } from "@/lib/labs";
import { getLatestPost } from "@/lib/posts";
import { getPinnedPlaybooks } from "@/lib/playbooks";

export const metadata = { title: "home" };
export const runtime = "nodejs";
export const revalidate = 0;

export default async function Home() {
  const labs = await getAllLabs();
  const latestLab = labs?.[0];

  const latestDispatch = await getLatestPost();
  const [latestPlaybook] = await getPinnedPlaybooks(1);

  return (
    <section className="space-y-8">
      {/* intro */}
      <div className="card p-6 md:p-7">
        <h1 className="font-serif text-3xl md:text-4xl leading-tight">
          hi there — i’m oj.
        </h1>
        <p className="muted mt-2 max-w-prose">
          i love security, and this site is where i learn in public.
          breaking down incidents, building forensics workflows, dabbling in some malware analysis, and
          sharing the repeatable patterns that actually work.
        </p>
        <p className="muted mt-3 text-[13px]">
          new here?{" "}
          <Link
            href="/start"
            className="underline underline-offset-2 hover:no-underline"
          >
            the shortlist →
          </Link>
        </p>
      </div>

      {/* hero latest lab */}
      {latestLab && (
        <LatestSpotlight
          kind="labs"
          title={latestLab.title}
          summary={latestLab.summary}
          date={latestLab.date}
          href={`/labs/${latestLab.slug}`}
        />
      )}

      {/* recent strip */}
      {(latestDispatch || latestPlaybook) && (
        <div className="grid gap-4 md:grid-cols-2">
          {latestDispatch && (
            <MiniLatest
              kind="dispatch"
              title={latestDispatch.title}
              description={latestDispatch.description}
              date={latestDispatch.date}
              href={`/dispatch/${latestDispatch.slug}`}
            />
          )}

          {latestPlaybook && (
            <MiniLatest
              kind="playbooks"
              title={latestPlaybook.title}
              description={latestPlaybook.description}
              date={latestPlaybook.date}
              href={latestPlaybook.url}
            />
          )}
        </div>
      )}

      {/* featured project */}
      <FeaturedProject
        title="PRVIEW"
        blurb="Browser-based phishing email analysis: import .eml or raw source, parse headers/body, extract URLs, and export a clean summary."
        href="https://heyosj.github.io/prview/"
      />
      <FeaturedProject
        title="SIGNL"
        blurb="Security alerts, but intelligent — tailored to your stack, prioritized, and sent where your team already collaborates."
        href="https://heyosj.github.io/signl/"
      />

      {/* section cards */}
      <div className="grid gap-4 md:grid-cols-3">
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

      {/* footer */}
      <p className="muted">
        say hi: <MailLink /> •{" "}
        <a
          className="underline"
          href="https://www.linkedin.com/in/heyosj"
          target="_blank"
          rel="noopener noreferrer"
        >
          linkedin
        </a>{" "}
        •{" "}
        <a
          className="underline"
          href="https://x.com/heyosj"
          target="_blank"
          rel="noopener noreferrer"
        >
          x
        </a>{" "}
        •{" "}
        <a
          className="underline"
          href="https://github.com/heyosj"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* components                                                                  */
/* -------------------------------------------------------------------------- */

function LatestSpotlight({
  kind,
  title,
  summary,
  date,
  href,
}: {
  kind: "labs" | "dispatch" | "playbooks";
  title: string;
  summary?: string;
  date: string;
  href: string;
}) {
  return (
    <Link href={href} className="block" aria-label={`open latest ${kind}: ${title}`}>
      <div className="card rounded-[26px] p-6 md:p-7 transition hover:-translate-y-[1px]">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 border"
            style={{
              background: "var(--latest-badge-bg)",
              color: "var(--latest-badge-fg)",
              borderColor: "var(--latest-badge-border)",
              boxShadow: `0 0 18px var(--latest-badge-glow)`,
            }}
          >
            latest
          </span>
          <span className="muted">{kind}</span>
          <span className="muted">•</span>
          <span className="muted">
            {new Date(date).toLocaleDateString()}
          </span>
        </div>

        <h2 className="font-serif leading-[1.1] text-3xl md:text-4xl mt-3 underline underline-offset-6">
          {title}
        </h2>

        {summary && <p className="muted mt-3 max-w-prose">{summary}</p>}
      </div>
    </Link>
  );
}

function MiniLatest({
  kind,
  title,
  description,
  date,
  href,
}: {
  kind: "dispatch" | "playbooks";
  title: string;
  description?: string;
  date: string;
  href: string;
}) {
  return (
    <Link href={href} className="block h-full group">
      <div className="card h-full rounded-2xl border p-5 transition hover:-translate-y-[1px] flex flex-col">
        {/* meta */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide">
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 border select-none"
          style={{
            // translucent fill (stays “pill”, not solid)
            background: "rgba(255, 215, 128, 0.18)",
            // readable in light mode (ink, not yellow)
            color: "var(--ink)",
            // slightly warmer border so it still feels “yellow family”
            borderColor: "rgba(255, 215, 128, 0.45)",
            // tiny glow, but subtle
            boxShadow: "0 0 0 1px rgba(0,0,0,0.03), 0 0 18px rgba(255, 215, 128, 0.12)",
          }}
        >
          recent
        </span>
          <span className="muted">{kind}</span>
          <span className="muted">•</span>
          <span className="muted">
            {new Date(date).toLocaleDateString()}
          </span>
        </div>

        {/* title */}
        <h3 className="font-serif text-lg mt-3 line-clamp-2 group-hover:underline underline-offset-4">
          {title}
        </h3>

        {description && (
          <p className="muted mt-2 text-sm line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

function HomeCard({
  href,
  title,
  blurb,
}: {
  href: string;
  title: string;
  blurb: string;
}) {
  return (
    <Link href={href} className="block h-full group">
      <div className="card h-full rounded-2xl border p-5 md:p-6 transition hover:-translate-y-[1px] hover:shadow-sm flex flex-col">
        <h2 className="font-serif text-lg md:text-xl">{title}</h2>
        <p className="muted mt-2 text-sm">{blurb}</p>
        <span className="mt-auto inline-flex items-center gap-2 text-base">
          <span className="translate-y-[1px] transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

function FeaturedProject({
  title,
  blurb,
  href,
}: {
  title: string;
  blurb: string;
  href: string;
}) {
  return (
    <div className="card rounded-2xl border px-5 py-4 md:px-6 md:py-5">
      <div className="flex flex-wrap items-center gap-3 md:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wide">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 border select-none"
            style={{
              background: "var(--featured-badge-bg)",
              color: "var(--featured-badge-fg)",
              borderColor: "var(--featured-badge-border)",
              boxShadow: "0 0 18px var(--featured-badge-glow)",
            }}
          >
            featured
          </span>
          <span className="muted">{title} • project</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <a
            className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-wide transition hover:-translate-y-[1px]"
            style={{
              background: "var(--paper)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            open app →
          </a>
        </div>
      </div>
      <h3 className="font-serif text-lg md:text-xl mt-2 leading-snug">{title}</h3>
      <p className="muted mt-2 max-w-2xl text-sm">{blurb}</p>
    </div>
  );
}
