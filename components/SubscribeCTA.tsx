import Link from "next/link";

export default function SubscribeCTA() {
  return (
    <section className="card">
      <h3 className="font-semibold text-lg">Connect with me</h3>
      <p className="text-sm mt-1 muted">
        let’s talk security, tech, and ideas.
      </p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="https://www.linkedin.com/in/osanchezjr" target="_blank" className="btn">LinkedIn</Link>
        <Link href="https://x.com/heyosj" target="_blank" className="btn">X</Link>
        <Link href="https://github.com/heyosj" target="_blank" className="btn">GitHub</Link>
      </div>
    </section>
  );
}
