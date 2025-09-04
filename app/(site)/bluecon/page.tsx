// app/(site)/bluecon/page.tsx
// Blue Team Con landing: banner + airy hero + featured card + large action cards.

import type { Metadata } from "next";
import Link from "next/link";
import BlueConBanner from "../../../components/BlueConBanner";

export const metadata: Metadata = {
  title: "Blue Team Con — heyosj",
  description:
    "OJ — detection engineering & OSINT/DFIR. Practical notes, casefiles, and playbooks.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/bluecon" },
  openGraph: {
    title: "Blue Team Con — heyosj",
    description:
      "OJ — detection engineering & OSINT/DFIR. Practical notes, casefiles, and playbooks.",
    url: "/bluecon",
    siteName: "heyosj.com",
    type: "website",
  },
};

// Set in .env.local
const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/heyosj";

export default function BlueConPage() {
  return (
    <main className="relative isolate">
      {/* Full banner (desktop) / collapses on scroll (mobile) */}
      <BlueConBanner linkedinUrl={LINKEDIN_URL} />

      {/* Identity card (lighter, airy) */}
      <section className="mx-auto max-w-screen-md px-4 sm:px-6 pt-6 sm:pt-10 pb-6">
        <div
          className="rounded-2xl border border-zinc-200/70 dark:border-zinc-700/50
                     bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm
                     p-5 shadow-sm ring-1 ring-black/5 dark:ring-white/5"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-9 w-9 select-none items-center justify-center rounded-full bg-[#2563EB] text-white font-semibold">
              OJ
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                OJ — Detection Engineering & OSINT/DFIR
              </h1>
              <p className="mt-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                I build practical detections (Sentinel/KQL), ship public casefiles, and write
                lightweight playbooks teams can actually use.
              </p>

              {/* Light secondary actions only (primary Connect lives in banner) */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href="/labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                  className="inline-flex items-center gap-2 rounded-full border
                             border-zinc-300/70 dark:border-zinc-700/60
                             bg-white/60 dark:bg-zinc-900/30 px-3.5 py-2 text-sm font-medium
                             hover:bg-white/80 dark:hover:bg-zinc-900/50"
                >
                  See casefiles
                  <svg className="h-4 w-4" viewBox="0 0 20 20" aria-hidden>
                    <path
                      d="M5 10h8M10 5l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                <a
                  href="mailto:me@heyosj.com"
                  className="text-sm underline decoration-dotted underline-offset-4 hover:opacity-90"
                >
                  me@heyosj.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured full-width card (like /start, but BTC-focused) */}
      <section className="mx-auto max-w-screen-md px-4 sm:px-6 pb-4">
        <FeaturedCard
          eyebrow="Start here (Blue Team Con)"
          title="A quick path through my strongest posts"
          desc="One casefile, one detection note, one playbook — a 5-minute tour that shows how I think and work."
          href="/start"
        />
      </section>

      {/* Large card grid (3 items, no About) */}
      <section className="mx-auto max-w-screen-md px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <Card
            eyebrow="Casefiles"
            title="Read OSINT / DFIR casefiles"
            href="/labs"
            desc="Small, public investigations with repeatable steps."
          />
          <Card
            eyebrow="Notes"
            title="See detection notes"
            href="/dispatch"
            desc="KQL/Sentinel queries, patterns, and experiments."
          />
          <Card
            eyebrow="Playbooks"
            title="Use my playbooks"
            href="/playbooks"
            desc="Email auth, hop tracing, and incident helpers."
            spanTwo // make this one span full width on small screens for a strong end
          />
        </div>

        <p className="mt-10 text-xs text-zinc-500 dark:text-zinc-400">
          This page is plain HTML. No cookies, no analytics, and no scripts beyond the site framework.
        </p>
      </section>
    </main>
  );
}

/* ---------- UI helpers ---------- */

function FeaturedCard({
  eyebrow,
  title,
  desc,
  href,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
      className="group block rounded-2xl border border-zinc-200/70 dark:border-zinc-700/50
                 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm
                 p-5 sm:p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/5
                 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] opacity-80 group-hover:opacity-100" />
      </div>
      <h2 className="mt-2 text-xl sm:text-2xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      <p className="mt-1.5 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">{desc}</p>
      <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#1E40AF] dark:text-[#60A5FA]">
        <span>Open</span>
        <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 20 20" aria-hidden>
          <path
            d="M5 10h8M10 5l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}

function Card({
  eyebrow,
  title,
  desc,
  href,
  spanTwo = false,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  href: string;
  spanTwo?: boolean;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
      className={[
        "group block rounded-2xl border border-zinc-200/70 dark:border-zinc-700/50",
        "bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm",
        // bigger card surface:
        "p-5 sm:p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/5",
        "transition hover:-translate-y-0.5 hover:shadow-md",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]",
        spanTwo ? "sm:col-span-2" : "",
      ].join(" ")}
      style={{ minHeight: "148px" }} // roomier hit target; ~bigger card
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] opacity-80 group-hover:opacity-100" />
      </div>
      <h3 className="mt-1.5 text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-1 text-base text-zinc-700 dark:text-zinc-300">{desc}</p>
      <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#1E40AF] dark:text-[#60A5FA]">
        <span>Open</span>
        <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 20 20" aria-hidden>
          <path
            d="M5 10h8M10 5l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
