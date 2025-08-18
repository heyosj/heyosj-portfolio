'use client';

import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import BackLink from "@/components/BackLink";

function PathHistoryTracker() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    // If there was a previous in-app path, mark that we've navigated internally.
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
  const showBackRow = pathname !== "/"; // BackLink itself decides whether to render

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
          {/* left: brand | about */}
          <div className="flex items-baseline gap-2">
            <Link href="/" className="font-semibold tracking-tight">heyosj</Link>
            <span aria-hidden className="mx-1 muted">|</span>
            <Link href="/about" className="hover:underline">about</Link>
          </div>

          {/* right: theme toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* back link row (auto-hides unless there was in-app navigation or same-origin referrer) */}
      {showBackRow && (
        <div className="mx-auto max-w-3xl px-5">
          <BackLink className="mb-2 block" />
        </div>
      )}

      <main className="mx-auto max-w-3xl px-5 pb-24">{children}</main>
    </ThemeProvider>
  );
}
