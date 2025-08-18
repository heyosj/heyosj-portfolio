// components/BackLink.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState, useCallback } from "react";

function sameOriginReferrer(): boolean {
  try {
    return !!document.referrer && new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}

export default function BackLink({
  className,
  children = "← back",
  fallback = "/start",
}: {
  className?: string;
  children?: React.ReactNode;
  fallback?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldShow, setShouldShow] = useState(false);

  // Recompute on each client-side route change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const internal = sessionStorage.getItem("cameFromInternal") === "1";
    const sameRef = sameOriginReferrer();
    // Only show if we navigated inside the app OR we arrived from a same-origin page
    setShouldShow(internal || sameRef);
  }, [pathname]);

  const onClick = useCallback(() => {
    if (typeof window === "undefined") return;
    const before = window.location.pathname;
    router.back();
    setTimeout(() => {
      if (window.location.pathname === before) {
        router.push(fallback);
      }
    }, 350);
  }, [router, fallback]);

  if (!shouldShow) return null;

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
