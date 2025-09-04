// components/BottomConnectPill.tsx
// Mobile-only micro CTA that appears AFTER scrolling a bit.
// Sticks bottom-right; dismissible; anti-flicker with hysteresis.

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = { linkedinUrl: string };

const SHOW_AT = 140;   // px scrolled before showing
const HYS = 60;        // hysteresis band to avoid flicker

export default function BottomConnectPill({ linkedinUrl }: Props) {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const visRef = useRef(visible);
  visRef.current = visible;

  // Mobile detection (<640px)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639.98px)");
    const on = () => setIsMobile(mql.matches);
    on();
    try {
      mql.addEventListener("change", on);
      return () => mql.removeEventListener("change", on);
    } catch {
      mql.addListener(on);
      return () => mql.removeListener(on);
    }
  }, []);

  // Scroll logic with hysteresis
  useEffect(() => {
    const onScroll = () => {
      if (!isMobile) return setVisible(false);
      const y = window.scrollY || 0;
      if (!visRef.current && y > SHOW_AT + HYS) setVisible(true);
      else if (visRef.current && y < SHOW_AT - HYS) setVisible(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  if (hidden || !isMobile || !visible) return null;

  return (
    <div className="fixed inset-x-auto bottom-4 right-4 z-50">
      <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#3B82F6] to-[#06B6D4] text-white shadow-lg ring-1 ring-black/10 pl-3 pr-1.5 py-1.5">
        <span className="text-sm font-medium leading-none">Hey Blue Team Con 👋</span>
        <Link
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          prefetch={false}
          aria-label="Connect on LinkedIn (opens in a new tab)"
          className="inline-flex items-center justify-center rounded-full bg-white text-[#1E40AF] px-3 py-1.5 text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
        >
          Connect
          <svg className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" aria-hidden>
            <path d="M5 10h8M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label="Hide connect button"
          className="ml-0.5 px-2 text-white/90 hover:text-white text-sm"
        >
          ×
        </button>
      </div>
    </div>
  );
}
