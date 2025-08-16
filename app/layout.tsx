import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: { default: "heyosj", template: "%s | heyosj" },
  description: "short, useful security essays and notes.",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // DO NOT hardcode class="dark" here
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
        {/* 1) set theme BEFORE anything renders; body is valid place (no hydration error) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var t = localStorage.getItem('theme');
                  var dark = t ? (t === 'dark')
                               : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var c = document.documentElement.classList;
                  if (dark) c.add('dark'); else c.remove('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* main */}
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-5">{children}</div>
        </main>
        {/* footer */}
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
