import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Global header (brand + toggle only) */}
      <header className="py-6 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">heyosj</Link>
        <div className="flex items-center gap-4 text-sm">
          <ThemeToggle />
        </div>
      </header>

      <main className="pb-24">{children}</main>
    </>
  );
}
