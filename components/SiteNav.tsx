import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle"; // client component is fine here

export default function SiteNav() {
  return (
    <header className="py-6 flex items-center justify-between">
      {/* Brand → home */}
      <Link href="/" className="font-semibold tracking-tight">
        heyosj
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        <Link href="/dispatch" className="hover:underline">dispatch</Link>
        <Link href="/dispatch/archive" className="hover:underline">archive</Link>
        <Link href="/about" className="hover:underline">about</Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
