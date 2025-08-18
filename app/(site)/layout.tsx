'use client';

import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import BackLink from "@/components/BackLink";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBack =
    pathname !== "/" &&
    pathname !== "/start";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
    >
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

      {/* global back link (hidden on / and /start) */}
      <div className="mx-auto max-w-3xl px-5">
        {showBack && <BackLink className="mb-2 block" />}
      </div>

      <main className="mx-auto max-w-3xl px-5 pb-24">{children}</main>
    </ThemeProvider>
  );
}
