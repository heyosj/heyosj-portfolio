// app/(site)/playbooks/layout.tsx
import Link from "next/link";

export default function PlaybooksSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <Link href="/playbooks" className="font-serif text-2xl hover:underline">
            playbooks
          </Link>
          {/* keep this empty/right-clean; global header already has “about” */}
        </div>
      </div>

      {children}
    </>
  );
}
