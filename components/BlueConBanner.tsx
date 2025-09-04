// components/BlueConBanner.tsx
// Full banner (always on desktop). On MOBILE ONLY, it collapses on scroll
// into a rounded pill with minimal copy. Hysteresis prevents flicker.

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = { linkedinUrl: string };

const COLLAPSE_AT = 140; // px from top where we prefer to collapse (mobile)
const HYST = 60;         // hysteresis to avoid oscillation around threshold

export default function BlueConBanner({ linkedinUrl }: Props) {
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const condensedRef = useRef(condensed);
  condensedRef.current = condensed;

  // Track viewport < 640px
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639.98px)");
    const update = () => setIsMobile(mql.matches);
    update();
    try {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    } catch {
      mql.addListener(update);
      return () => mql.removeListener(update);
    }
  }, []);

  // Scroll logic (mobile only) with hysteresis
  useEffect(() => {
    const onScroll = () => {
      if (!isMobile) {
        if (condensedRef.current) setCondensed(false);
        return;
      }
      const y = window.scrollY || 0;
      if (!condensedRef.current && y > COLLAPSE_AT + HYST) setCondensed(true);
      else if (condensedRef.current && y < COLLAPSE_AT - HYST) setCondensed(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  if (hidden) return null;

  const Gradient = "bg-gradient-to-r from-[#4F46E5] via-[#2563EB] to-[#06B6D4]";

  return (
    <div className="sticky top-0 z-40">
      {/* Expanded banner (always on desktop; on mobile when near top) */}
      {(!isMobile || !condensed) && (
        <div className={`relative ${Gradient} text-white shadow-sm`}>
          <div className="mx-auto max-w-screen-md px-4 sm:px-6 py-3 flex items-center justify-between gap-3 rounded-b-xl">
            <p className="text-[15px] leading-tight">
              <span className="font-medium">Hey Blue Team Con 👋</span>
              <span className="mx-2 hidden sm:inline"></span>
              <span className="opacity-95 hidden sm:inline">
                Thanks for scanning — quick links below.
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                aria-label="Connect on LinkedIn (opens in a new tab)"
                className="inline-flex items-center justify-center rounded-full bg-white text-[#1E40AF] px-4 py-2 text-sm font-semibold shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              >
                LinkedIn
                <svg className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" aria-hidden>
                  <path d="M5 10h8M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => setHidden(true)}
                aria-label="Hide banner"
                className="px-2 text-white/90 hover:text-white text-sm"
              >
                ×
              </button>
            </div>
          </div>
          <div
            className="absolute inset-x-0 bottom-[-12px] h-3 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"
            aria-hidden
          />
        </div>
      )}

      {/* Condensed pill (mobile only after scroll) */}
      {isMobile && condensed && (
        <div className="pt-2 pb-1">
          <div className="mx-auto max-w-screen-md px-3 sm:px-4">
            <div className={`flex items-center justify-between gap-2 rounded-full ${Gradient} text-white shadow-lg ring-1 ring-black/10 py-1.5 pl-3 pr-1.5`}>
              <p className="text-sm font-medium leading-none">Hey Blue Team Con 👋</p>
              <div className="flex items-center">
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
                  aria-label="Hide banner"
                  className="ml-1 px-2 text-white/90 hover:text-white text-sm"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
