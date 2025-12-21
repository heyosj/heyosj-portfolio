// app/(home)/page.tsx
import Link from "next/link";
import MailLink from "@/components/MailLink";
import { getAllLabs } from "@/lib/labs";

export const metadata = { title: "home" };
export const runtime = "nodejs";
export const revalidate = 0;

export default async function Home() {
  const labs = await getAllLabs();
  const latestLab = labs?.[0];

  return (
    <section className="space-y-8">
      <div className="card p-6 md:p-7">
        <h1 className="font-serif text-3xl md:text-4xl leading-tight">hi there — i’m oj.</h1>
        <p className="muted mt-2 max-w-prose">
          i love security, and this site is where i learn in public. from cloud to threat hunting to
          incident response, i’m documenting what i study, test, and break so i keep growing and share
          along the way.
        </p>
        <p className="muted mt-3 text-[13px]">
          new here?{" "}
          <Link href="/start" className="underline underline-offset-2 hover:no-underline">
            the shortlist →
          </Link>
        </p>
      </div>

      {latestLab ? (
        <LatestSpotlight
          kind="labs"
          title={latestLab.title}
          summary={latestLab.summary}
          date={latestLab.date}
          href={`/labs/${latestLab.slug}`}
        />
      ) : null}

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
        <a className="underline" href="https://x.com/heyosj" target="_blank" rel="noopener noreferrer">
          x
        </a>{" "}
        •{" "}
        <a className="underline" href="https://github.com/heyosj" target="_blank" rel="noopener noreferrer">
          github
        </a>
      </p>
    </section>
  );
}

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
    <Link href={href} className="block" aria-label={`open latest ${kind}: ${title}`} prefetch>
      <div className="relative">
        {/* subtle aura */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-[28px] blur-2xl opacity-30 transition hover:opacity-45"
          style={{
            background:
              "radial-gradient(900px circle at 18% 10%, rgba(255,255,255,0.08), transparent 55%), radial-gradient(900px circle at 82% 35%, rgba(255,255,255,0.05), transparent 55%)",
          }}
        />

        {/* border wrapper */}
        <div
          className="relative rounded-[26px] p-[1px] transition hover:-translate-y-[1px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.12))",
          }}
        >
          <div className="card relative overflow-hidden rounded-[25px] p-6 md:p-7">
            {/* vignette / glass */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(900px circle at 22% 0%, rgba(255,255,255,0.09), transparent 58%), radial-gradient(900px circle at 78% 120%, rgba(0,0,0,0.10), transparent 60%), linear-gradient(to bottom, rgba(255,255,255,0.03), transparent 40%, rgba(0,0,0,0.06))",
              }}
            />

            {/* scanlines (subtle + thicker spacing) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 1px, transparent 1px, transparent 14px)",
              }}
            />

            <div className="relative grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide uppercase">
                  {/* badge: NO hover/transition */}
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-1 border select-none"
                    style={{
                      background: "var(--latest-badge-bg)",
                      color: "var(--latest-badge-fg)",
                      borderColor: "var(--latest-badge-border)",
                      boxShadow: `0 0 0 1px rgba(0,0,0,0.06), 0 0px 20px var(--latest-badge-glow)`,
                      transition: "none",
                      filter: "none",
                      opacity: 1,
                      transform: "none",
                      mixBlendMode: "normal",
                      isolation: "isolate",
                      willChange: "auto",
                    }}
                  >
                    latest
                  </span>

                  <span className="muted">{kind}</span>
                  <span className="muted">•</span>
                  <span className="muted">{new Date(date).toLocaleDateString()}</span>
                </div>

                <h2 className="font-serif leading-[1.1] text-3xl md:text-4xl mt-3">
                  <span className="underline underline-offset-[6px] decoration-[var(--border)]/0 hover:decoration-[var(--border)] transition">
                    {title}
                  </span>
                </h2>

                {summary ? <p className="muted mt-3 max-w-prose">{summary}</p> : null}
              </div>

              {/* affordance only; whole card is clickable */}
              <div className="flex md:justify-end">
                <span
                  className="
                    inline-flex items-center gap-2 rounded-md
                    border border-[var(--border)]
                    bg-[var(--card)]
                    px-3 py-2 text-sm
                    w-full justify-center md:w-auto
                    opacity-90
                  "
                  aria-hidden
                >
                  open latest <span aria-hidden>→</span>
                </span>
              </div>
            </div>

            <div className="relative mt-6 h-px w-full bg-[var(--border)] opacity-60" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function HomeCard({ href, title, blurb }: { href: string; title: string; blurb: string }) {
  return (
    <Link href={href} className="block h-full group" aria-label={`${title}: ${blurb}`}>
      <div className="card h-full rounded-2xl border p-5 md:p-6 transition hover:-translate-y-[1px] hover:shadow-sm flex flex-col">
        <h2 className="font-serif text-lg md:text-xl">{title}</h2>
        <p className="muted mt-2 text-sm">{blurb}</p>
        <span className="mt-auto inline-flex items-center gap-2 text-base" aria-hidden>
          <span className="translate-y-[1px] transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
