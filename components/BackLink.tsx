"use client";

import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";

function sameOrigin(ref: string) {
  try {
    return new URL(ref).origin === window.location.origin;
  } catch {
    return false;
  }
}

export default function BackLink({
  className,
  children = "← back",
  fallback = "/start",
  hideOn = ["/", "/start"], // don't show on home-like pages
}: {
  className?: string;
  children?: React.ReactNode;
  fallback?: string;
  hideOn?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasHistory = window.history.length > 1;
    const okRef = document.referrer && sameOrigin(document.referrer);
    setCanGoBack(Boolean(hasHistory && okRef));
  }, []);

  if (hideOn.includes(pathname)) return null;

  const onClick = () => {
    if (canGoBack) router.back();
    else router.push(fallback);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "text-sm text-subtext hover:text-ink transition-colors underline underline-offset-2",
        className
      )}
      aria-label="Go back"
    >
      {children}
    </button>
  );
}
