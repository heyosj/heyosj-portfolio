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
      {/* normal header */}
      <header className="py-6 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">heyosj</Link>
      </header>

      {/* anchored, fixed toggle aligned to your container (max-w-3xl) */}
      <div className="fixed top-4 inset-x-0 z-[2147483647] pointer-events-none">
        <div className="mx-auto max-w-3xl px-5 flex justify-end">
          {/* re-enable clicks only on the button */}
          <div className="pointer-events-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <main className="pb-24">{children}</main>
    </ThemeProvider>
  );
}
