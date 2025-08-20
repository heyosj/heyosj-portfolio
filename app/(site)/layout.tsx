"use client";

import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import BackLink from "@/components/BackLink";
import ConnectGate from "@/components/ConnectGate"; // ✅ import the gate (not the CTA)

/** Track in-app navigation so BackLink can decide when to show */
function PathHistoryTracker() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (prev.current && prev.current !== pathname) {
      try {
        sessionStorage.setItem("cameFromInternal", "1");
      } catch {}
    }
    prev.current = pathname;
  }, [pathname]);

  return null;
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBackRow = pathname !== "/";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
    >
      <PathHistoryTracker />

      <header className="py-6">
        <div className="mx-auto max-w-3xl px-5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <Link href="/" className="font-semibold tracking-tight">heyosj</Link>
            <span aria-hidden className="mx-1 muted">|</span>
            <Link href="/about" className="hover:underline">about</Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {showBackRow && (
        <div className="mx-auto max-w-3xl px-5">
          <BackLink className="mb-2 block" />
        </div>
      )}

      <main className="mx-auto max-w-3xl px-5 pb-16">{children}</main>

      {/* CTA shows only on /dispatch, /labs, /playbooks via ConnectGate */}
      <footer className="pb-24">
        <ConnectGate />
      </footer>
    </ThemeProvider>
  );
}
