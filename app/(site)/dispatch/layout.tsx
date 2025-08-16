import Link from "next/link";

export default function DispatchSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <Link href="/dispatch" className="font-serif text-2xl hover:underline">
            dispatch
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dispatch/archive" className="hover:underline">archive</Link>
            <Link href="/about" className="hover:underline">about</Link>
          </nav>
        </div>
      </div>

      {children}
    </>
  );
}
