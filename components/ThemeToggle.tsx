"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // read initial from <html> (set by the inline script)
    const html = document.documentElement;
    const dark = html.classList.contains("dark");
    setIsDark(dark);
    setMounted(true);
  }, []);

  function toggle() {
    const html = document.documentElement;
    const next = !isDark;
    setIsDark(next);
    if (next) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  if (!mounted) return null; // avoid mismatch on first render

  return (
    <button
      onClick={toggle}
      className="text-sm rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark px-2.5 py-1.5"
      aria-label="toggle theme"
    >
      {isDark ? "🌙 dark" : "🌞 light"}
    </button>
  );
}
