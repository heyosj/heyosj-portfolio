import Link from "next/link";

export default function PlaybooksSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <Link href="/playbooks" className="font-serif text-2xl hover:underline">
            playbooks
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/about" className="hover:underline">about</Link>
          </nav>
        </div>
      </div>

      {children}
    </>
  );
}
