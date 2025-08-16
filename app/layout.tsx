// app/layout.tsx
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { cookies } from "next/headers";

export const metadata = {
  title: { default: "heyosj", template: "%s | heyosj" },
  description: "short, useful security essays and notes.",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const saved = cookies().get("theme")?.value; // 'light' | 'dark' | 'system'
  const initialHtmlClass = saved && saved !== "system" ? saved : "";

  return (
    <html lang="en" className={initialHtmlClass} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-5">{children}</div>
        </main>
        <footer className="py-10 text-sm text-subtext dark:text-subtext-dark">
          <div className="mx-auto max-w-3xl px-5">
            <p>© {new Date().getFullYear()} osj • security notes, no fluff.</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
