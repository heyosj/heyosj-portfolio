// app/(site)/start/page.tsx
import Link from "next/link";
import { getPinnedPlaybooks } from "@/lib/playbooks";
import { getPinnedPosts } from "@/lib/posts";
import { getPinnedLabs } from "@/lib/labs";
import CopyEmail from "@/components/CopyEmail";
import MailLink from "@/components/MailLink";

export const metadata = { title: "start" };

// --- helpers ---
const isNew = (iso?: string, days = 14) => {
  if (!iso) return false;
  const dt = new Date(iso).getTime();
  return Number.isFinite(dt) && (Date.now() - dt) / 86400000 < days;
};
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : "");

export default async function StartPage() {
  const [playbooks, posts, labs] = await Promise.all([
    getPinnedPlaybooks(1),
    getPinnedPosts(1),
    getPinnedLabs(1),
  ]);

  const play = playbooks[0];
  const post = posts[0];
  const lab = labs[0];

  return (
    <section className="space-y-10 sm:space-y-6">
      {/* identity — short + factual */}
      <header className="card p-5 md:p-6">
        <h1 className="font-serif text-3xl md:text-[34px] leading-snug">the shortlist</h1>
        <p className="muted mt-1 text-[13.5px]">three picks: one tool, one detection, one lab</p>

        <dl className="mt-2 grid grid-cols-[5.5rem_1fr] md:grid-cols-[6rem_1fr] gap-y-1.5 text-[13px]">
          <dt className="font-medium text-foreground">now:</dt>
          <dd className="muted">security analyst @ mls • georgia tech grad student</dd>

          <dt className="font-medium text-foreground">focus:</dt>
          <dd className="muted">email &amp; cloud security, threat hunting</dd>

          <dt className="font-medium text-foreground">output:</dt>
          <dd className="muted">detections • examples • rationale</dd>
        </dl>
      </header>

      {/* floating terminal map */}
      <TerminalTree />

      {/* cards */}
      <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 items-stretch">
        {play && (
          <Card
            eyebrow="playbook"
            title={play.title}
            desc="dns-only audit cli for spf/dmarc/mta-sts/tls-rpt — fast baseline in ~60s."
            href={play.url}
            cta="try it"
            chips={[
              isNew(play.date) ? "new" : undefined,
              "dns-only",
              "cli",
              (play as any).repo ? "repo" : undefined,
            ].filter(Boolean) as string[]}
          />
        )}

        {post && (
          <Card
            eyebrow="detection"
            title={post.title}
            desc={post.description || "what tls-rpt is, why it matters, and the minimal steps to enable it."}
            href={`/dispatch/${post.slug}`}
            cta="read"
            chips={[
              isNew((post as any).updated) ? "new" : undefined,
              (post as any).readingTime,
            ].filter(Boolean) as string[]}
          />
        )}

        {lab && (
          <Card
            eyebrow="lab"
            title={lab.title}
            desc={lab.summary || "end-to-end walkthrough with artifacts; pii redacted."}
            href={`/labs/${lab.slug}`}
            cta="open"
            chips={[
              isNew(lab.date) ? "new" : undefined,
              `${fmt(lab.date)}`,
            ].filter(Boolean) as string[]}
          />
        )}
      </section>

      {/* footer — more breathing room + better wrapping */}
      <div className="muted mt-12 sm:mt-8 pt-6 border-t border-[var(--border)] space-y-3">
        <p className="leading-relaxed">
          prefer the long way around? explore{" "}
          <Link className="underline" href="/dispatch">dispatch</Link>,{" "}
          <Link className="underline" href="/playbooks">playbooks</Link>, and{" "}
          <Link className="underline" href="/labs">labs</Link>.
        </p>

        <p className="leading-relaxed">
          <span className="mr-2">say hi:</span>
          {/* wrap nicely on mobile */}
          <span className="inline-flex flex-wrap items-center gap-3">
            <MailLink />
            <CopyEmail email="me@heyosj.com" />
            <a
              className="underline"
              href="https://www.linkedin.com/in/osanchezjr"
              target="_blank"
              rel="noopener noreferrer"
              title="linkedin"
            >
              linkedin
            </a>
          </span>
        </p>
      </div>

      {/* keep space off the iOS home indicator */}
      <div className="pb-[calc(env(safe-area-inset-bottom)+16px)]" />
    </section>
  );
}

/* ---------------- local components ---------------- */

function TerminalTree() {
  return (
    <nav
      aria-label="site map"
      className="mx-auto w-full max-w-xl rounded-xl border bg-card overflow-hidden
                 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-black/30"
    >
      {/* window header */}
      <div className="border-b border-[var(--border)] px-3 py-2 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[12px] font-mono muted">terminal</span>
      </div>
      {/* body */}
      <div className="px-4 py-3 font-mono text-[13.5px] md:text-sm leading-7 tracking-tight">
        <div className="muted">$ tree -L 1</div>
        <div>
          <Link className="underline" href="/">heyosj</Link>
        </div>
        <div className="pl-4">
          ├── <Link className="underline" href="/dispatch">dispatch</Link>
          <span className="muted"> — notes & breakdowns</span>
        </div>
        <div className="pl-4">
          ├── <Link className="underline" href="/playbooks">playbooks</Link>
          <span className="muted"> — scripts & runbooks</span>
        </div>
        <div className="pl-4">
          └── <Link className="underline" href="/labs">labs</Link>
          <span className="muted"> — research, ctfs, experiments</span>
        </div>
      </div>
    </nav>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-[2px] text-[11px] leading-5">
      {children}
    </span>
  );
}

function Card({
  eyebrow, title, desc, href, cta, chips = [],
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  href: string;
  cta: string;
  chips?: string[];
}) {
  return (
    <Link href={href} className="block h-full group" aria-label={title}>
      <article className="card h-full rounded-2xl border p-5 md:p-6 transition hover:-translate-y-[1px] hover:shadow-sm flex flex-col">
        <span className="text-[11px] tracking-wide muted">{eyebrow.toLowerCase()}</span>
        <h2 className="font-serif text-lg md:text-xl mt-1 leading-snug clamp-2">{title}</h2>

        {/* slightly calmer on phones */}
        {desc && (
          <p className="muted mt-2 hidden sm:block text-sm leading-relaxed clamp-2">
            {desc}
          </p>
        )}

        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c, i) => (
              <Chip key={i}>{c}</Chip>
            ))}
          </div>
        )}

        {/* CTA: small, right-aligned, no divider */}
        <div className="mt-auto pt-3 flex justify-end">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm
                       border border-[var(--border)] bg-[var(--card)]
                       transition group-hover:translate-x-[1px]"
          >
            <span>{cta}</span>
            <span aria-hidden className="translate-y-[1px] transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </article>
    </Link>
  );
}
