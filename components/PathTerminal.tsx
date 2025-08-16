"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PathTerminal() {
  const pathname = usePathname() || "/";
  const [displayPath, setDisplayPath] = useState(pathname);

  // include query string without useSearchParams (avoids prerender issues)
  useEffect(() => {
    const qs = typeof window !== "undefined" ? window.location.search : "";
    setDisplayPath(qs ? `${pathname}${qs}` : pathname);
  }, [pathname]);

  return (
    <div className="mt-8 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4">
      <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
{`> GET ${displayPath}
< 404 Not Found
diagnostics:
  - dispatch: try the archive
  - playbooks: coming online
  - labs: experiments in progress
`}
      </pre>
    </div>
  );
}
