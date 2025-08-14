import Link from "next/link";
export const metadata = { title: "About" };

export default function About() {
  return (
    <section className="space-y-8">
      <div className="card">
        <div className="text-3xl">👋</div>
        <h1 className="mt-2 text-3xl font-serif leading-tight">hi — i’m OJ.</h1>
        <p className="muted mt-2">
          these are my practical security notes: short write-ups i’d want to reference later. vendor-agnostic and focused on things you can actually ship.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="https://www.linkedin.com/in/osanchezjr" target="_blank" className="btn">linkedin</Link>
          <Link href="https://x.com/heyosj" target="_blank" className="btn">x</Link>
          <Link href="https://github.com/heyosj" target="_blank" className="btn">github</Link>
        </div>
      </div>

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
          "prose-pre:text-ink dark:prose-pre:text-ink-dark",
          "prose-pre:border prose-pre:border-border dark:prose-pre:border-border-dark",
          "prose-headings:mt-6 prose-headings:mb-2",
          "prose-p:my-2 prose-ul:my-2 prose-li:my-1 leading-relaxed"
        ].join(" ")}
      >
        <h2>what this is</h2>
        <p>
        an ongoing notebook. when i dig into something new, i take thorough notes: define the ask, map the problem, call out limits, then outline workable solutions. i break topics down to fundamentals as i go, because i’m learning alongside the work.
        </p>

        <div className="not-prose rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4 my-6">
          <p className="muted leading-relaxed">
            these are short write-ups plus my notes as i go deeper on a topic. if you spot anything i’ve misunderstood,
            {" "}
            <Link
              href="mailto:ojsanch@gmail.com"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium underline underline-offset-2 decoration-accent hover:decoration-accent-600"
            >
              tell me!
            </Link>
            {" "}
            i’m a lifelong student, refining my understanding as i go.
          </p>
        </div>


        <h2>focus areas</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <li><strong>cloud &amp; identity</strong> — secure defaults, least-privilege, clear boundaries.</li>
          <li><strong>email security</strong> — block spoofing and abuse while keeping good mail moving.</li>
          <li><strong>detection engineering</strong> — raise signal, reduce noise, test what we ship.</li>
          <li><strong>operational hygiene</strong> — simple guardrails, clear playbooks, steady improvements.</li>
        </ul>

        <h2>currently exploring</h2>
          <ul className="space-y-1">
            <li>refining controls so high-signal events get through and noise stays out.</li>
            <li>building metrics that show what’s working and what to fix next.</li>
            <li>designing agent-assisted (agentic) workflows to remove repetitive steps and speed response.</li>
            <li>applying omscs work to real systems: networks, security, and ml safety.</li>
          </ul>
      </article>
    </section>
  );
}
