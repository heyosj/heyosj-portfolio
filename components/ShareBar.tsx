// components/ShareBar.tsx
"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

export default function ShareBar({ title }: { title: string }) {
  const pathname = usePathname();

  // Build an absolute URL safely on the client
  const url = useMemo(() => {
    if (typeof window === "undefined") return pathname || "/";
    try {
      return new URL(pathname || "/", window.location.origin).toString();
    } catch {
      return (window.location.origin || "") + (pathname || "/");
    }
  }, [pathname]);

  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // ignore clipboard failures silently
    }
  }

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const tweetHref = useMemo(
    () =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        title
      )}`,
    [url, title]
  );

  return (
    <div className="flex items-center gap-2 text-[13px]">
      {/* COPY CHIP */}
      <button
        onClick={onCopy}
        aria-live="polite"
        className={[
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition",
          copied
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            : "border-[var(--border)] bg-[var(--card)] text-[var(--ink)] hover:translate-x-[1px]",
        ].join(" ")}
      >
        {/* clipboard icon */}
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
          <path
            d="M6 2a2 2 0 0 0-2 2v8h2V4h7V2H6Zm3 4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H9Zm0 2h7v8H9V8Z"
            fill="currentColor"
          />
        </svg>
        {copied ? "copied" : "copy link"}
        {copied && (
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
            <path d="M7.5 13.5 4 10l1.4-1.4 2.1 2.1L14.6 3.6 16 5z" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* subtle divider */}
      <span className="muted select-none">•</span>

      {/* X SHARE CHIP (icon-only with accessible label) */}
      <a
        className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] border-[var(--border)] bg-[var(--card)] hover:translate-x-[1px] transition"
        target="_blank"
        rel="noreferrer"
        href={tweetHref}
        title="share on X"
        aria-label="share on X"
      >
        {/* simple X icon */}
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="sr-only">X</span>
      </a>
    </div>
  );
}
