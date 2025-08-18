// lib/playbooks.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

const dir = path.join(process.cwd(), "content", "playbooks");

const Slug = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/, { message: "use lowercase letters, numbers, and dashes" });

const FM = z.object({
  title: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  slug: Slug.optional(),
  url: z.string().optional(),
  repo: z.string().optional(),
  order: z.coerce.number().optional().default(999),
  // favorites aliases
  pinned: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  favorite: z.coerce.boolean().optional(),
});

export type PlaybookMeta = {
  title: string;
  date: string;
  updated?: string;
  description: string;
  tags: string[];
  slug: string;
  url: string;
  repo?: string;
  order: number;
  pinned: boolean;
};

function slugify(file: string) {
  return path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getPlaybooksMeta(): Promise<PlaybookMeta[]> {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const items: PlaybookMeta[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    const fm = FM.parse(data);
    const slug = fm.slug ?? slugify(file);
    const url = fm.url ?? `/playbooks/${slug}`;

    const pinned = Boolean((fm as any).favorite ?? (fm as any).featured ?? fm.pinned ?? false);

    items.push({
      title: fm.title,
      date: fm.date,
      updated: fm.updated ?? fm.date,
      description: fm.description,
      tags: fm.tags,
      slug,
      url,
      repo: fm.repo,
      order: fm.order ?? 999,
      pinned,
    });
  }

  // order asc, then updated/date desc
  return items.sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999) || +new Date(b.updated ?? b.date) - +new Date(a.updated ?? a.date)
  );
}

export async function getPinnedPlaybooks(limit = 1): Promise<PlaybookMeta[]> {
  const all = await getPlaybooksMeta();
  const favs = all.filter((i) => i.pinned);
  const source = (favs.length ? favs : all).sort(
    (a, b) => +new Date(b.updated ?? b.date) - +new Date(a.updated ?? a.date)
  );
  return source.slice(0, limit);
}
