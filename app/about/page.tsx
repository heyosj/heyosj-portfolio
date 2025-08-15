import Link from "next/link";

export const metadata = { title: "About" };

export default function About() {
  return (
    <section className="space-y-8">
      {/* Hero card */}
      <div className="card">
        <div className="text-3xl">👋</div>
        <h1 className="mt-2 text-3xl font-serif leading-tight">hi — i’m OJ.</h1>
        <p className="muted mt-2">
          i write short, practical security notes to show how i learn, reason, and ship.
          vendor-agnostic, focused on things you can actually roll out.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="https://www.linkedin.com/in/osanchezjr" target="_blank" className="btn">
            linkedin
          </Link>
          <Link href="https://x.com/heyosj" target="_blank" className="btn">
            x
          </Link>
          <Link href="https://github.com/heyosj" target="_blank" className="btn">
            github
          </Link>
          {/* <Link href="mailto:me@heyosj.com" className="btn">
            email
          </Link> */}
        </div>
      </div>

      {/* Body */}
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
          // slightly looser list spacing so the bottom breathes
          "prose-p:my-2 prose-ul:my-3 prose-li:my-1.5 leading-relaxed",
        ].join(" ")}
      >
        <h2>why this exists</h2>
        <ul>
          <li><strong>clarity first.</strong> explain security concepts the way i use them at work.</li>
          <li><strong>trace my thinking.</strong> decisions, trade-offs, and gotchas — not just the happy path.</li>
          <li><strong>grow over time.</strong> add posts as i learn; mark updates when i revisit topics.</li>
        </ul>

        <h2>what you’ll find</h2>
        <ul>
          <li>
            <strong>notes across domains.</strong> email security, cloud &amp; identity, detection engineering,
            incident response, and operational hygiene — wherever i’m currently digging.
          </li>
          <li>
            <strong>standalone posts, with optional paths.</strong> most notes work on their own; when a sequence helps,
            i group them into a loose series with prev/next.
          </li>
          <li>
            <strong>practical artifacts.</strong> configs, checks, and tiny checklists you can drop into real work.
          </li>
          <li>
            <strong>tags to jump around.</strong> use tags to explore; some tags (like “email security”) have a rough order
            if you’re starting fresh.
          </li>
        </ul>

        <div className="not-prose rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4 my-6">
          <p className="muted leading-relaxed">
            if you spot anything off,{" "}
            <Link
              href="mailto:ojsanch@gmail.com"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium underline underline-offset-2 decoration-accent hover:decoration-accent-600"
            >
              tell me
            </Link>
            . i’m a lifelong student, refining my understanding as i go.
          </p>
        </div>

        <h2>objectives</h2>
        <ul>
          <li>make it easy to learn a thing end-to-end without fluff.</li>
          <li>write like i’m handing this to a teammate to run tomorrow.</li>
          <li>keep notes maintained (published + updated dates on every post).</li>
        </ul>

        <h2>focus areas</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <li><strong>email security</strong> — block spoofing/abuse while keeping good mail moving.</li>
          <li><strong>cloud &amp; identity</strong> — secure defaults, least-privilege, clear boundaries.</li>
          <li><strong>detection engineering</strong> — raise signal, reduce noise, test what we ship.</li>
          <li><strong>operational hygiene</strong> — simple guardrails, clear playbooks, steady improvements.</li>
        </ul>

        <h2>currently exploring</h2>
        <ul className="space-y-2">
          <li>refining controls so high-signal events get through and noise stays out.</li>
          <li>metrics that show what’s working and what to fix next.</li>
          <li>agent-assisted workflows to remove repetitive steps and speed response.</li>
          <li>applying omscs work to real systems: networks, security, and ml safety.</li>
        </ul>
      </article>

      {/* low-key repo link; delete if you want to keep it private */}
      <div className="not-prose mt-2 text-xs opacity-70">
        curious how this site works?{" "}
        <Link
          href="https://github.com/heyosj/heyosj-portfolio"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 decoration-accent hover:decoration-accent-600"
        >
          see the code on GitHub
        </Link>
        .
      </div>
    </section>
  );
}
