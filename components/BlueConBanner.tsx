// components/BlueConBanner.tsx
// Floating banner with a one-time entrance bounce on first visit (per tab).
// Fixed size (no collapse on scroll). Respects prefers-reduced-motion.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = { linkedinUrl: string };

const TOP_OFFSET_PX = 8; // add breathing room from the top (also respects notch)

export default function BlueConBanner({ linkedinUrl }: Props) {
  const [hidden, setHidden] = useState(false);
  const [animate, setAnimate] = useState(false);

  // One-time per-tab animation
  useEffect(() => {
    try {
      const key = "bluecon_banner_bounced_v1";
      if (!sessionStorage.getItem(key)) {
        setAnimate(true);
        const t = setTimeout(() => {
          setAnimate(false);
          sessionStorage.setItem(key, "1");
        }, 900); // keep in sync with animation duration
        return () => clearTimeout(t);
      }
    } catch {
      // ignore storage errors; just don't animate
    }
  }, []);

  if (hidden) return null;

  const Gradient =
    "bg-gradient-to-r from-[#4F46E5] via-[#3B82F6] to-[#06B6D4]";

  const topStyle = {
    top: `calc(env(safe-area-inset-top, 0px) + ${TOP_OFFSET_PX}px)`,
  } as const;

  return (
    <div className="sticky z-40 mb-3 sm:mb-4" style={topStyle}>
      <div className="pointer-events-none">
        <div className="mx-auto max-w-screen-md px-3 sm:px-4">
          <div
            className={[
              "pointer-events-auto flex items-center justify-between gap-2",
              Gradient,
              "text-white rounded-2xl shadow-xl ring-1 ring-black/10 backdrop-blur-sm",
              // compact but comfy
              "py-2 pl-3 pr-1.5 sm:py-2.5 sm:pl-4 sm:pr-2",
              animate ? "bc-bounce" : "",
            ].join(" ")}
          >
            <p className="text-[14px] sm:text-[15px] leading-tight">
              <span className="font-medium">Hey Blue Team Con 👋</span>
              <span className="mx-2 hidden sm:inline">•</span>
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
                className="inline-flex items-center justify-center rounded-full bg-white text-[#1E40AF]
                           px-3.5 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 font-semibold shadow
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              >
                LinkedIn
                <svg className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" aria-hidden>
                  <path
                    d="M5 10h8M10 5l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
        </div>
      </div>

      {/* local styles for the bounce, with reduced-motion guard */}
      {/* <style jsx>{`
        @keyframes bcFloatIn {
          0%   { transform: translateY(-16px) scale(0.98); opacity: 0; }
          60%  { transform: translateY(0) scale(1);        opacity: 1; }
          78%  { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        .bc-bounce {
          animation: bcFloatIn 0.9s cubic-bezier(.22,1,.36,1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .bc-bounce { animation: none; }
        }
      `}</style> */}
    </div>
  );
}
