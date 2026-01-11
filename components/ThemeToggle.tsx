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
          ? "bg-[#121a35] border border-[#2a3b5f]"
          : "bg-[#f7eff8] border border-[#f3b7d7]",
        "shadow-inner focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#ff3fd3]/40 dark:focus-visible:ring-[#00fff2]/40",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-1 h-6 w-6 rounded-full transition-transform duration-200 border",
          // knob colors:
          // - dark: soft gray
          // - light: warm amber
          isDark
            ? "bg-[#00fff2] border-[#00d8cf] shadow-[0_0_10px_rgba(0,255,242,.45)]"
            : "bg-[#ff3fd3] border-[#ff1fbf] shadow-[0_0_10px_rgba(255,63,211,.35)]",
          isDark ? "translate-x-6" : "translate-x-0",
        ].join(" ")}
    />
      <span className="sr-only">toggle theme</span>
    </button>
  );
}
