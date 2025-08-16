// app/(site)/layout.tsx
'use client';

import Link from "next/link";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
    >
      {/* header — same look, no floating pieces */}
      <header className="py-6">
        <div className="mx-auto max-w-3xl px-5 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">heyosj</Link>

          {/* keep whatever links you already render here, then the toggle */}
          <div className="flex items-center gap-4">
            {/* <Link href="/playbooks" className="muted hover:underline">playbooks</Link>
            <Link href="/labs" className="muted hover:underline">labs</Link>
            <Link href="/about" className="muted hover:underline">about</Link> */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* content container matches header width */}
      <main className="mx-auto max-w-3xl px-5 pb-24">{children}</main>
    </ThemeProvider>
  );
}
