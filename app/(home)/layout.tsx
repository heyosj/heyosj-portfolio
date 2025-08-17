'use client';

import Link from "next/link";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
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

      <main className="pb-24">{children}</main>
    </ThemeProvider>
  );
}
