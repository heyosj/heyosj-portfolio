// lib/playbooks.ts
import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

export type PlaybookMeta = {
  title: string;
  description: string;
  date: string;   // ISO yyyy-mm-dd
  slug: string;
  tags: string[];
  order?: number;
  url: string;    // /playbooks/<slug>
  repo?: string;  // optional GitHub URL
  pinned?: boolean; // NEW
};

export type Playbook = { meta: PlaybookMeta; content: string };

export const PLAYBOOKS_DIR =
  process.env.PLAYBOOKS_DIR || path.join(process.cwd(), 'content', 'playbooks');

const FRONTMATTER = z.object({
  title: z.string(),
  description: z.string().default(''),
  date: z.string().refine((d) => !Number.isNaN(new Date(d).getTime()), 'bad date'),
  slug: z.string().optional(),
  tags: z.array(z.string()).default([]),
  order: z.coerce.number().optional(),
  repo: z.string().url().optional(),
  pinned: z.coerce.boolean().optional().default(false), // NEW
});

function kebab(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function normalizeDate(d: string) { return new Date(d).toISOString().slice(0,10); }

function listFiles(): string[] {
  if (!fs.existsSync(PLAYBOOKS_DIR)) return [];
  return fs.readdirSync(PLAYBOOKS_DIR)
    .filter((f) => /\.(md|mdx)$/i.test(f))
    .map((f) => path.join(PLAYBOOKS_DIR, f));
}

function metaFromFile(filepath: string): PlaybookMeta {
  const raw = fs.readFileSync(filepath, 'utf8');
  const { data } = matter(raw);
  const fm = FRONTMATTER.parse(data);
  const fileSlug = kebab(path.basename(filepath, path.extname(filepath)));
  const slug = fm.slug ? kebab(fm.slug) : fileSlug;

  return {
    title: fm.title,
    description: fm.description ?? '',
    date: normalizeDate(fm.date),
    slug,
    tags: fm.tags ?? [],
    order: fm.order,
    url: `/playbooks/${slug}`,
    repo: fm.repo,
    pinned: fm.pinned ?? false,
  };
}

function sortPlaybooks(a: PlaybookMeta, b: PlaybookMeta) {
  const ao = a.order ?? Number.POSITIVE_INFINITY;
  const bo = b.order ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  if (a.date !== b.date) return a.date > b.date ? -1 : 1;
  return a.title.localeCompare(b.title);
}

export function getPlaybooksMeta(): PlaybookMeta[] {
  return listFiles().map(metaFromFile).sort(sortPlaybooks);
}

/** Match by filename or frontmatter slug. */
export function getPlaybook(slug: string): Playbook {
  const want = kebab(slug);

  // direct filename
  const direct = [path.join(PLAYBOOKS_DIR, `${want}.mdx`), path.join(PLAYBOOKS_DIR, `${want}.md`)]
    .find((p) => fs.existsSync(p));
  if (direct) {
    const raw = fs.readFileSync(direct, 'utf8');
    const { content, data } = matter(raw);
    const fm = FRONTMATTER.parse(data);
    const s = kebab(fm.slug ?? path.basename(direct, path.extname(direct)));
    return {
      meta: {
        title: fm.title,
        description: fm.description ?? '',
        date: normalizeDate(fm.date),
        slug: s,
        tags: fm.tags ?? [],
        order: fm.order,
        url: `/playbooks/${s}`,
        repo: fm.repo,
        pinned: fm.pinned ?? false,
      },
      content,
    };
  }

  // fallback: scan for frontmatter slug/filebase match
  for (const fp of listFiles()) {
    const raw = fs.readFileSync(fp, 'utf8');
    const { content, data } = matter(raw);
    const parsed = FRONTMATTER.safeParse(data);
    const fm = parsed.success ? parsed.data : undefined;

    const fileBase = kebab(path.basename(fp, path.extname(fp)));
    const fmSlug = fm?.slug ? kebab(fm.slug) : undefined;

    if (want === fileBase || (fmSlug && want === fmSlug)) {
      const s = fmSlug ?? fileBase;
      return {
        meta: {
          title: fm?.title ?? path.basename(fp),
          description: fm?.description ?? '',
          date: normalizeDate(fm?.date ?? new Date().toISOString()),
          slug: s,
          tags: fm?.tags ?? [],
          order: fm?.order,
          url: `/playbooks/${s}`,
          repo: fm?.repo,
          pinned: fm?.pinned ?? false,
        },
        content,
      };
    }
  }

  throw new Error(`Playbook not found for slug "${slug}"`);
}

// NEW: pinned helpers
export function getPinnedPlaybooks(limit = 1): PlaybookMeta[] {
  const all = getPlaybooksMeta();
  const pinned = all.filter(p => p.pinned);
  const source = pinned.length ? pinned : all;
  return source.slice(0, limit);
}
