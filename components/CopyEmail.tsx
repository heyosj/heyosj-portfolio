// components/CopyEmail.tsx
"use client";

import { useEffect, useState } from "react";

export default function CopyEmail({ email = "me@heyosj.com" }: { email?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(id);
  }, [copied]);

  async function onCopy() {
    try {
      await navigator.clipboard?.writeText(email);
      setCopied(true);
    } catch {
      // no-op
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)]
                 px-2 py-[1px] text-[11px] leading-5 hover:opacity-90 transition"
      aria-live="polite"
      title="copy email to clipboard"
    >
      {copied ? "copied ✓" : "copy"}
    </button>
  );
}
