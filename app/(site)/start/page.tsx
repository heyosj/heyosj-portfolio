// app/(site)/start/page.tsx
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getPinnedPlaybooks } from "@/lib/playbooks";
import { getPinnedPosts } from "@/lib/posts";
import { getPinnedLabs } from "@/lib/labs";
import MailLink from "@/components/MailLink";
import BackLink from "@/components/BackLink";
import BlueConBanner from "@/components/BlueConBanner";

export const metadata = { title: "start" };
export const revalidate = 0;

// --- helpers ---
const isNew = (iso?: string, days = 14) => {
  if (!iso) return false;
  const dt = new Date(iso).getTime();
  return Number.isFinite(dt) && (Date.now() - dt) / 86400000 < days;
};
const fmt = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "2-digit" }) : "";

const HIDE = new Set(["playbooks", "labs", "dispatch"]);

function firstUsefulTag(tags?: string[]) {
  if (!tags) return undefined;
  for (const t of tags) {
    if (!t) continue;
    if (HIDE.has(t.toLowerCase())) continue;
    return t;
  }
  return undefined;
}

// cap chips to N, preferring extras first, then first useful tag
function pickChips(extras: (string | undefined)[], tags?: string[], max = 2) {
  const out: string[] = [];
  for (const e of extras) {
    if (!e) continue;
    if (out.length >= max) break;
    out.push(e);
  }
  if (out.length < max) {
    const t = firstUsefulTag(tags);
    if (t) out.push(t);
  }
  return out;
}

// For the banner CTA
const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/";

export default async function StartPage({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  noStore();

  const isBlueCon = searchParams?.from === "bluecon";

  const [playbooks, posts, labs] = await Promise.all([
    getPinnedPlaybooks(1),
    getPinnedPosts(1),
    getPinnedLabs(1),
  ]);

  const play = playbooks[0];
  const post = posts[0];
  const lab = labs[0];

  return (
    <>
      {/* Personalized banner only when coming via /bluecon */}
      {isBlueCon && <BlueConBanner linkedinUrl={LINKEDIN_URL} />}

      <section className="space-y-6">
        {/* identity — short + factual */}
        <header className="card p-5 md:p-6">
          <h1 className="font-serif text-3xl md:text-[34px] leading-snug">the shortlist</h1>
          <p className="muted mt-1 text-[13.5px]">three picks: one tool, one detection, one lab</p>

          <dl className="mt-2 grid grid-cols-[5.5rem_1fr] md:grid-cols-[6rem_1fr] gap-y-1 text-[13px]">
            <dt className="font-medium text-foreground">now:</dt>
            <dd className="muted">security analyst @ mls</dd>

            <dt className="font-medium text-foreground">focus:</dt>
            <dd className="muted">email &amp; cloud security, threat hunting</dd>

            <dt className="font-medium text-foreground">overview:</dt>
            <dd className="muted">detections • examples • rationale</dd>
          </dl>
        </header>

        {/* floating terminal map */}
        <TerminalTree />

        {/* cards */}
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 md:items-stretch">
          {play && (
            <Card
              eyebrow="playbook"
              badges={[
                (play as any).pinned ? "favorite" : undefined,
                isNew((play as any).updated ?? play.date) ? "new" : undefined,
              ].filter(Boolean) as string[]}
              title={play.title}
              desc={(play as any).description || undefined}
              href={(play as any).url ?? `/playbooks/${(play as any).slug}`}
              cta="open"
              chips={pickChips([(play as any).repo ? "repo" : undefined], (play as any).tags)}
            />
          )}

          {post && (
            <Card
              eyebrow="detection"
              badges={[
                (post as any).pinned ? "favorite" : undefined,
                isNew((post as any).updated ?? post.date) ? "new" : undefined,
              ].filter(Boolean) as string[]}
              title={post.title}
              desc={post.description || undefined}
              href={`/dispatch/${post.slug}`}
              cta="read"
              chips={pickChips([(post as any).readingTime], (post as any).tags)}
            />
          )}

          {lab && (
            <Card
              eyebrow="lab"
              badges={[
                lab.pinned ? "favorite" : undefined,
                isNew((lab as any).updated ?? lab.date) ? "new" : undefined,
              ].filter(Boolean) as string[]}
              title={lab.title}
              desc={lab.summary || undefined}
              href={`/labs/${lab.slug}`}
              cta="open"
              chips={pickChips([fmt(lab.date)], lab.tags)}
            />
          )}
        </section>

        {/* footer */}
        <div className="muted mt-6 space-y-2">
          <p>
            prefer the long way around? explore{" "}
            <Link className="underline" href="/dispatch" target="_blank" rel="noopener noreferrer" prefetch={false}>
              dispatch
            </Link>
            ,{" "}
            <Link className="underline" href="/playbooks" target="_blank" rel="noopener noreferrer" prefetch={false}>
              playbooks
            </Link>
            , and{" "}
            <Link className="underline" href="/labs" target="_blank" rel="noopener noreferrer" prefetch={false}>
              labs
            </Link>
            .
          </p>

          <p className="flex flex-wrap items-center gap-2">
            <span>say hi:</span>
            <MailLink />
            <span>•</span>
            <a
              className="underline"
              href="https://www.linkedin.com/in/heyosj"
              target="_blank"
              rel="noopener noreferrer"
              title="linkedin"
            >
              linkedin
            </a>
          </p>
        </div>
      </section>
    </>
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

      {/* body — extra vertical breathing room only */}
      <div className="px-4 py-5 md:py-6 font-mono text-[13.5px] md:text-sm leading-7 tracking-tight">
        <div className="muted">$ tree -L 1</div>
        <div>
          <Link className="underline" href="/" target="_blank" rel="noopener noreferrer" prefetch={false}>
            heyosj
          </Link>
        </div>
        <div className="pl-4">
          ├──{" "}
          <Link className="underline" href="/dispatch" target="_blank" rel="noopener noreferrer" prefetch={false}>
            dispatch
          </Link>
          <span className="muted"> — notes & breakdowns</span>
        </div>
        <div className="pl-4">
          ├──{" "}
          <Link className="underline" href="/playbooks" target="_blank" rel="noopener noreferrer" prefetch={false}>
            playbooks
          </Link>
          <span className="muted"> — scripts & runbooks</span>
        </div>
        <div className="pl-4">
          └──{" "}
          <Link className="underline" href="/labs" target="_blank" rel="noopener noreferrer" prefetch={false}>
            labs
          </Link>
          <span className="muted"> — research, ctfs, experiments</span>
        </div>
      </div>
    </nav>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-1 py-px text-[10px] leading-[16px] uppercase tracking-wide">
      {children}
    </span>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-1.5 py-[1px] text-[11px] leading-[18px]">
      {children}
    </span>
  );
}

function Card({
  eyebrow, badges = [], title, desc, href, cta, chips = [],
}: {
  eyebrow: string;
  badges?: string[];    // e.g., ["favorite","new"]
  title: string;
  desc?: string;
  href: string;
  cta: string;
  chips?: string[];     // capped to 2 already
}) {
  return (
    <Link
      href={href}
      className="block group"
      aria-label={title}
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
    >
      <article
        className="
          card h-full rounded-2xl border p-5 md:p-6
          flex flex-col
          md:min-h-[260px] xl:min-h-[280px]
          transition hover:-translate-y-[1px] hover:shadow-sm
        "
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] tracking-wide muted">{eyebrow.toLowerCase()}</span>
          {badges.map((b, i) => (
            <Badge key={i}>{b}</Badge>
          ))}
        </div>

        <h2 className="font-serif text-lg md:text-xl mt-1 leading-snug clamp-2">{title}</h2>

        {desc && <p className="muted mt-1.5 text-sm clamp-2">{desc}</p>}

        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c, i) => (
              <Chip key={i}>{c}</Chip>
            ))}
          </div>
        )}

        {/* pushes CTA to bottom */}
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
