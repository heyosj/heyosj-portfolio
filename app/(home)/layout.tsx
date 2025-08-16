// app/(home)/layout.tsx  (or replace your current home layout)
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
      storageKey="theme"            // matches the cookie your RootLayout reads
      disableTransitionOnChange
    >
      <header className="py-6 flex items-center justify-between relative z-50 pointer-events-auto">
        <Link href="/" className="font-semibold tracking-tight">heyosj</Link>
        <div className="flex items-center gap-4 text-sm">
          <ThemeToggle />
        </div>
      </header>

      <main className="pb-24">{children}</main>
    </ThemeProvider>
  );
}
