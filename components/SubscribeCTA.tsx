'use client';
import Link from "next/link";

export default function SubscribeCTA() {
  return (
    <section
      aria-labelledby="connect-title"
      className="mt-10 border-t border-black/10 dark:border-white/10 pt-3"
    >
      <h3
        id="connect-title"
        className="text-[11px] font-medium tracking-wide text-zinc-700 dark:text-zinc-400"
      >
        connect
      </h3>

      <p className="mt-1 text-[13px] text-zinc-700 dark:text-zinc-400">
        security, tech, ideas — quick ways to reach me
      </p>

      <p className="mt-2 text-[13px]">
        <Link
          href="https://www.linkedin.com/in/heyosj"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="font-medium text-zinc-900 hover:underline underline-offset-4 dark:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/40 rounded-sm"
        >
          linkedin
        </Link>
        <span className="mx-2 text-zinc-500 dark:text-zinc-500">·</span>
        <Link
          href="https://x.com/inf0stache"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          className="font-medium text-zinc-900 hover:underline underline-offset-4 dark:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/40 rounded-sm"
        >
          x
        </Link>
        <span className="mx-2 text-zinc-500 dark:text-zinc-500">·</span>
        <Link
          href="https://github.com/heyosj"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="font-medium text-zinc-900 hover:underline underline-offset-4 dark:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/40 rounded-sm"
        >
          github
        </Link>
      </p>
    </section>
  );
}
