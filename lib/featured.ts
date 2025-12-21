// lib/featured.ts
import "server-only";
import { getAllLabs } from "@/lib/labs";
import { getPlaybooksMeta } from "@/lib/playbooks";

export type FeaturedItem = {
  title: string;
  summary: string;
  date: string;
  href: string;
  section: "labs" | "playbooks";
};

function dateToTs(dateStr: string): number {
  const s = String(dateStr || "").trim();
  if (!s) return 0;

  // preferred: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return Date.parse(`${s}T00:00:00Z`);

  // your format: MM-DD-YYYY
  const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (m) {
    const [, mm, dd, yyyy] = m;
    const iso = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    return Date.parse(`${iso}T00:00:00Z`);
  }

  const t = Date.parse(s);
  return Number.isFinite(t) ? t : 0;
}

export async function getFeatured(): Promise<FeaturedItem | null> {
  const [labs, playbooks] = await Promise.all([getAllLabs(), getPlaybooksMeta()]);

  const candidates: FeaturedItem[] = [
    ...labs.map((x) => ({
      title: x.title,
      summary: x.summary ?? "",
      date: x.date,
      href: `/labs/${x.slug}`,
      section: "labs" as const,
    })),
    ...playbooks.map((x: any) => ({
      title: x.title,
      summary: x.summary ?? "",
      date: x.date,
      href: `/playbooks/${x.slug}`,
      section: "playbooks" as const,
    })),
  ].filter((x) => x.title && x.date && x.href);

  if (!candidates.length) return null;

  candidates.sort((a, b) => dateToTs(b.date) - dateToTs(a.date));
  return candidates[0];
}
