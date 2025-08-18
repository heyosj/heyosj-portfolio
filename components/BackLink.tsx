// components/BackLink.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState, useCallback } from "react";

const STACK_KEY = "__route_stack__"; // maintained by the inline script in layout
const ANCHORS = new Set(["/start", "/dispatch", "/playbooks", "/labs"]);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    let stack: string[] = [];
    try {
      stack = JSON.parse(sessionStorage.getItem(STACK_KEY) || "[]");
    } catch {
      stack = [];
    }

    const prev = stack.length >= 2 ? stack[stack.length - 2] : "";
    const onAnchor = ANCHORS.has(pathname);
    const hasHistory = stack.length > 1;

    // Anchor pages:
    //  - show if the immediate previous path was "/" (Home)
    //  - OR if we returned from a child route within the same section
    //    e.g., "/dispatch/slug" → "/dispatch"
    const allowOnAnchor =
      onAnchor && (prev === "/" || prev.startsWith(pathname + "/"));

    // Non-anchor pages: show if there is in-app history
    setShouldShow(allowOnAnchor || (!onAnchor && hasHistory));
  }, [pathname]);

  const onClick = useCallback(() => {
    if (typeof window === "undefined") return;
    const before = window.location.pathname;
    router.back();

    // Fallback if history didn’t move (fresh entry)
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
