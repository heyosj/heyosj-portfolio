import Link from "next/link";
export const metadata = { title: "About" };
export default function About(){
  return (
    <section className="space-y-8">
      <div className="card">
        <div className="text-3xl">👋</div>
        <h1 className="mt-2 text-3xl font-serif leading-tight">hi — i’m OJ.</h1>
        <p className="muted mt-2">
          these are my practical security notes: short write-ups i’d want to reference later. vendor-agnostic and focused on things you can actually ship.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/blog" className="btn">view the archive</Link>
          <Link href="https://www.linkedin.com/in/osanchezjr" target="_blank" className="btn">linkedin</Link>
          <Link href="https://x.com/heyosj" target="_blank" className="btn">x</Link>
          <Link href="https://github.com/heyosj" target="_blank" className="btn">github</Link>
        </div>
      </div>

      <article
        className="prose prose-zinc max-w-prose
                   prose-headings:mt-6 prose-headings:mb-2
                   prose-p:my-2 prose-ul:my-2 prose-li:my-1 leading-relaxed"
      >
        <h2>what this is</h2>
        <p>
          an ongoing notebook. i write down security patterns, checks, and lessons i encounter in work and study (including omscs). the posts are brief so they can be applied quickly.
        </p>

        <div className="not-prose rounded-lg border border-border bg-card p-4 my-6">
          <p className="muted leading-relaxed">
            these notes are working drafts, not absolute truths. they reflect my current understanding. if you spot something off,
            <Link href="https://www.linkedin.com/in/osanchezjr" target="_blank" className="underline"> i want to hear from you</Link>.
          </p>
        </div>

        <h2>focus areas</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <li>cloud &amp; identity safety</li>
          <li>email security &amp; abuse mitigation</li>
          <li>detection engineering</li>
          <li>ops hygiene</li>
        </ul>

        <h2>currently exploring</h2>
        <ul>
          <li>refining controls so the right signals get through and the noise stays out</li>
          <li>building clarity into data and metrics for better decisions</li>
          <li>experimenting with agentic workflows to cut repetitive work</li>
          <li>deep dives into omscs topics — from networks to security to ml safety</li>
        </ul>
      </article>
    </section>
  );
}
