"use client";

type TocItem = { id: string; text: string };

export default function TocSelect({ toc }: { toc: TocItem[] }) {
  if (!toc || toc.length < 2) return null;

  return (
    <div className="lg:hidden">
      <label className="sr-only" htmlFor="toc-select">Jump to section</label>
      <select
        id="toc-select"
        className="text-sm rounded border border-border bg-card dark:bg-card-dark dark:border-border-dark p-2"
        defaultValue=""
        onChange={(e) => {
          const v = e.target.value;
          if (v) location.hash = v;
        }}
      >
        <option value="" disabled>Sections…</option>
        {toc.map((s) => (
          <option key={s.id} value={`#${s.id}`}>{s.text}</option>
        ))}
      </select>
    </div>
  );
}
