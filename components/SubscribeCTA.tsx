import Link from "next/link";

export default function SubscribeCTA() {
  return (
    <section className="card">
      <h3 className="font-semibold text-lg">connect with me</h3>
      <p className="text-sm mt-1 muted">
        let’s talk security, tech, ideas or exchange notes.
      </p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="https://www.linkedin.com/in/heyosj" target="_blank" className="btn">linkedin</Link>
        <Link href="https://x.com/heyosj" target="_blank" className="btn">x</Link>
        <Link href="https://github.com/heyosj" target="_blank" className="btn">github</Link>
      </div>
    </section>
  );
}
