// components/SiteNav.tsx
"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const FROM_HOME_KEY = "__from_home__";
const ANCHORS = new Set(["/start", "/dispatch", "/playbooks", "/labs"]);

export default function SiteNav() {
  const pathname = usePathname();

  useEffect(() => {
    // Capture clicks anywhere in the document so we don't have to modify each Link.
    const onClickCapture = (e: MouseEvent) => {
      if (pathname !== "/") return; // only care when we're on Home
      const target = e.target as HTMLElement | null;
      const a = target?.closest("a") as HTMLAnchorElement | null;
      if (!a) return;

      try {
        const url = new URL(a.href, window.location.href);
        if (url.origin !== window.location.origin) return; // external link
        if (ANCHORS.has(url.pathname)) {
          sessionStorage.setItem(FROM_HOME_KEY, "1"); // one-shot signal for BackLink
        }
      } catch {
        // ignore bad URLs
      }
    };

    document.addEventListener("click", onClickCapture, { capture: true });
    return () => document.removeEventListener("click", onClickCapture, { capture: true } as any);
  }, [pathname]);

  return (
    <header className="py-4 mb-4">
      <div className="flex items-center justify-between">
        {/* left: brand + about */}
        <div className="flex items-baseline gap-2">
          <Link href="/" className="font-serif text-xl leading-none hover:underline">
            heyosj
          </Link>
          <span aria-hidden className="text-subtext">|</span>
          <Link href="/about" className="hover:underline">
            about
          </Link>
        </div>

        {/* right: theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
