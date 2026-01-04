// app/(site)/about/page.tsx
import Link from "next/link";
import BackLink from "@/components/BackLink";
import ActionChip from "@/components/ActionChip";

export const metadata = { title: "about" };

export default function About() {
  return (
    <section className="space-y-8">
      {/* hero card */}
      <div className="card p-6 md:p-7">
        <h1 className="mt-2 text-3xl md:text-4xl font-serif leading-tight">hi — i'm oj.</h1>
        <p className="muted mt-2">
          i build detection workflows, analyze threats, and document repeatable security patterns. vendor-agnostic and ready to deploy.
        </p>

        {/* quick facts */}
        <dl className="mt-3 grid gap-y-1.5 [grid-template-columns:4.25rem_1fr] md:[grid-template-columns:5rem_1fr] text-[13px]">
          <div className="contents">
            <dt className="font-medium text-foreground">now:</dt>
            <dd className="muted">security analyst @ mls</dd>
          </div>
          <div className="contents">
            <dt className="font-medium text-foreground">focus:</dt>
            <dd className="muted">cloud forensics, threat detection, incident response</dd>
          </div>
        </dl>

        {/* contact */}
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionChip href="mailto:me@heyosj.com">email</ActionChip>
          <ActionChip href="https://www.linkedin.com/in/heyosj" external>linkedin</ActionChip>
          <ActionChip href="https://x.com/heyosj" external>x</ActionChip>
          <ActionChip href="https://github.com/heyosj" external>github</ActionChip>
        </div>
      </div>

      {/* body */}
      <article
        className={[
          "prose prose-slate max-w-prose dark:prose-invert",
          "prose-headings:font-serif prose-a:font-semibold",
          "prose-a:text-accent hover:prose-a:text-accent-600",
          "prose-blockquote:border-l-border dark:prose-blockquote:border-l-border-dark",
          "prose-hr:border-border dark:prose-hr:border-border-dark",
          "prose-code:bg-card dark:prose-code:bg-card-dark",
          "prose-code:text-ink dark:prose-code:text-ink-dark",
          "prose-pre:bg-card dark:prose-pre:bg-card-dark",
          "prose-pre:border prose-pre:border-border dark:prose-pre:border-border-dark",
          "prose-headings:mt-6 prose-headings:mb-2",
          "prose-p:my-2 prose-ul:my-3 prose-li:my-1.5 leading-relaxed",
        ].join(" ")}
      >
        <h2>what this is</h2>
        <p>
          this site documents security workflows i've built, tested, and deployed. from cloud forensics setups 
          to threat hunting playbooks to incident response patterns. everything here is practical, repeatable, 
          and grounded in real work.
        </p>
        <p>
          i write for security practitioners who need to implement something tomorrow, not read theory. 
          if you're setting up detection infrastructure, analyzing suspicious activity, or building IR workflows, 
          this is your resource.
        </p>

        <h2>how i approach it</h2>
        <ul>
          <li><strong>show the full picture.</strong> explain the context, walk through configuration, verify it works.</li>
          <li><strong>document decisions.</strong> trade-offs, gotchas, and why i chose one approach over another.</li>
          <li><strong>make it repeatable.</strong> if a teammate can't run this tomorrow, it's not ready.</li>
        </ul>

        <h2>what you'll find</h2>
        
        <p><strong>email security</strong> — authentication controls (SPF, DKIM, DMARC), phishing analysis, evidence preservation</p>
        
        <p><strong>cloud & identity</strong> — Azure forensics, container workflows, least-privilege patterns</p>
        
        <p><strong>detection engineering</strong> — honeypot setups, log aggregation pipelines, alert tuning</p>
        
        <p><strong>incident response</strong> — PCAP analysis, malware triage, repeatable investigation workflows</p>

        <p className="text-sm muted mt-4">
          most posts work standalone. when a sequence helps, i link them. every post includes 
          working examples and the reasoning behind them.
        </p>

        <h2>currently working on</h2>
        <ul>
          <li>refining detection rules to maximize signal and minimize false positives</li>
          <li>building agent-assisted IR workflows to reduce manual triage time</li>
          <li>expanding cloud forensics coverage (AWS, GCP alongside Azure)</li>
        </ul>

        <div className="not-prose rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4 my-6">
          <p className="muted leading-relaxed">
            see something wrong or have suggestions?{" "}
            <Link
              href="mailto:me@heyosj.com"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium underline underline-offset-2 decoration-accent hover:decoration-accent-600"
            >
              let me know
            </Link>
            . this site evolves as i learn.
          </p>
        </div>

      </article>

      {/* helpful links */}
      <section className="mt-2">
        <div className="rounded-xl border bg-card p-4 md:p-5">
          <ul className="text-sm leading-6 space-y-2">
            <li>
              new here?{" "}
              <Link href="/start" className="underline underline-offset-2">
                start with these three →
              </Link>
            </li>
            <li>
              want to see the code?{" "}
              <a
                href="https://github.com/heyosj/heyosj-portfolio"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                site source on github ↗
              </a>
            </li>
          </ul>
        </div>
      </section>
    </section>
  );
}