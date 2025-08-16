"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function PathTerminal() {
  const pathname = usePathname();               // e.g. /notgood
  const search = useSearchParams();             // e.g. ?q=foo
  const fullPath = useMemo(() => {
    const qs = search?.toString();
    return qs ? `${pathname}?${qs}` : pathname || "/";
  }, [pathname, search]);

  // Lock in a stable value so UI won’t lag behind on quick transitions
  const [displayPath, setDisplayPath] = useState(fullPath);
  useEffect(() => setDisplayPath(fullPath), [fullPath]);

  return (
    <div
      key={displayPath} // ensures full reset on each new 404 path
      className="mt-8 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4"
    >
      <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
{`> GET ${displayPath}
< 404 Not Found
diagnostics:
  - dispatch: notes
  - playbooks: scripts
  - labs: experiments in progress
`}
      </pre>
    </div>
  );
}
