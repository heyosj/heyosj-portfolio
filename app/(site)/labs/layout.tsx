import Link from "next/link";

export default function LabsSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <Link href="/labs" className="font-serif text-2xl hover:underline">
            labs
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
