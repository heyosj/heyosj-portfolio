"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function BackLink({
  className,
  children = "← back",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
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
