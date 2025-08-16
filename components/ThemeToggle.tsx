// components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const effective = (theme === "system" ? systemTheme : theme) as "light" | "dark" | undefined;
  const isDark = effective === "dark";
  const next: "light" | "dark" = isDark ? "light" : "dark";

  function apply() {
    setTheme(next); // flips .dark on <html>
    document.cookie = `theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  return (
    <button
      type="button"
      onClick={apply}
      aria-label="toggle theme"
      aria-pressed={isDark}
      role="switch"
      className={[
        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
        // neutral track so the knob color stands out
        isDark
          ? "bg-zinc-800/70 border border-zinc-700"
          : "bg-stone-200/80 border border-stone-300",
        "shadow-inner focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-stone-400/50 dark:focus-visible:ring-zinc-500/40",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-1 h-6 w-6 rounded-full transition-transform duration-200 border",
          // knob colors:
          // - dark: soft gray
          // - light: warm amber
          isDark
            ? "bg-stone-400 border-stone-500 shadow-[0_1px_4px_rgba(0,0,0,.28)]"
            : "bg-amber-300 border-amber-400 shadow-[0_1px_4px_rgba(0,0,0,.18)]",
          isDark ? "translate-x-6" : "translate-x-0",
        ].join(" ")}
    />
      <span className="sr-only">toggle theme</span>
    </button>
  );
}
