// app/not-found.tsx
import Link from "next/link";
import PathTerminal from "@/components/PathTerminal";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl py-24 bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      {/* tree nav */}
      <nav className="mb-8 flex justify-center">
        <div className="font-mono text-sm text-subtext dark:text-subtext-dark">
          <div className="text-center mb-1">
            <Link href="/" className="underline underline-offset-2 hover:opacity-80">
              heyosj
            </Link>
          </div>
          <div className="grid justify-center gap-0.5">
            <div>
              <span className="opacity-50">├─ </span>
              <Link href="/dispatch" className="underline underline-offset-2 hover:opacity-80">
                dispatch
              </Link>
            </div>
            <div>
              <span className="opacity-50">├─ </span>
              <Link href="/playbooks" className="underline underline-offset-2 hover:opacity-80">
                playbooks
              </Link>
            </div>
            <div>
              <span className="opacity-50">└─ </span>
              <Link href="/labs" className="underline underline-offset-2 hover:opacity-80">
                labs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-2">
          <span className="font-mono text-sm text-subtext dark:text-subtext-dark">request</span>
          <span className="font-mono text-sm text-accent">404</span>
          <span className="font-mono text-sm text-subtext dark:text-subtext-dark">not_found</span>
        </div>

        <h1 className="mt-4 font-serif text-4xl">missing page</h1>
        <p className="muted mt-2">
          couldn’t resolve this route. maybe the slug changed or never existed.
        </p>
      </div>

      {/* terminal output */}
      <PathTerminal />
    </section>
  );
}
