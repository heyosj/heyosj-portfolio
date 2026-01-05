// components/ActionChip.tsx
import Link from "next/link";

export default function ActionChip({
  href,
  children,
  external,
  active,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  active?: boolean;
}) {
  const base =
    "inline-flex items-center gap-1 rounded-full border border-[var(--border)] " +
    "bg-[var(--card)] px-2.5 py-1 text-[12.5px] leading-5 text-subtext " +
    "hover:text-foreground hover:-translate-y-[0.5px] transition";
  const state = active
    ? " text-foreground font-semibold border-[var(--accent)] bg-[var(--accent)]/10"
    : "";

  if (external) {
    return (
      <a className={base + state} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span aria-hidden className="text-[11px] translate-y-[0.5px]">↗</span>
      </a>
    );
  }
  return (
    <Link className={base + state} href={href} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
