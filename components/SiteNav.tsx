// components/SiteNav.tsx
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteNav() {
  return (
    <header className="py-4 mb-4">
      <div className="flex items-center justify-between">
        {/* left: brand + about */}
        <div className="flex items-baseline gap-2">
          <Link href="/" className="font-serif text-xl leading-none hover:underline">
            heyosj
          </Link>
          <span aria-hidden className="text-subtext">|</span>
          <Link href="/about" className="hover:underline">
            about
          </Link>
        </div>

        {/* right: theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
