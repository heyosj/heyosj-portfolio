// lib/labs.ts
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import React from "react";
import { categoryFromPath, filenameToSlug, listMdxFiles } from "./content";
import DataTable from "@/components/DataTable";

export type LabMeta = LabListItem;

export type LabFrontmatter = {
  title: string;
  date: string; // ideally ISO, but we accept a few formats
  slug?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  order?: number;
  published?: boolean;
  type?: "lab";
  pinned?: boolean;
  updated?: string; // ✅ FIX
};

export type LabListItem = {
  slug: string;
  title: string;
  date: string;
  order?: number;
  summary: string;
  tags: string[];
  published: boolean;
  pinned: boolean;
  updated?: string;
  category: string;
};

export type LabDoc = {
  slug: string;
  frontmatter: LabFrontmatter;
  mdx: React.ReactNode;
  meta: {
    title: string;
    description: string;
    date: string;
    tags: string[];
    readMin: number;
  };
};

const LABS_DIR = path.join(process.cwd(), "content", "labs");

export function getLabFilePaths(): string[] {
  return listMdxFiles(LABS_DIR);
}

export function readLabFrontmatter(filePath: string): Partial<LabFrontmatter> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return data as Partial<LabFrontmatter>;
}

/**
 * Parse a date string into a stable UTC timestamp.
 * Supports:
 * - YYYY-MM-DD (preferred)
 * - MM-DD-YYYY
 * - M/D/YYYY
 */
function dateToTs(dateStr: string): number {
  const s = String(dateStr || "").trim();
  if (!s) return 0;

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return Date.parse(`${s}T00:00:00Z`);

  const mmddyyyy = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (mmddyyyy) {
    const [, mm, dd, yyyy] = mmddyyyy;
    const iso = `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
    return Date.parse(`${iso}T00:00:00Z`);
  }

  const mdyyyy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdyyyy) {
    const [, m, d, y] = mdyyyy;
    const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return Date.parse(`${iso}T00:00:00Z`);
  }

  const t = Date.parse(s);
  return Number.isFinite(t) ? t : 0;
}

/** theme-aware MDX component mapping (no TSX; uses React.createElement) */
const mdxComponents = {
  h1: (props: any) =>
    React.createElement("h1", { className: "mt-10 text-3xl font-semibold", ...props }),
  h2: (props: any) =>
    React.createElement("h2", { className: "mt-10 text-2xl font-semibold", ...props }),
  h3: (props: any) =>
    React.createElement("h3", { className: "mt-8 text-xl font-semibold", ...props }),
  p: (props: any) =>
    React.createElement("p", { className: "leading-relaxed", ...props }),
  ul: (props: any) =>
    React.createElement("ul", { className: "list-disc pl-6 space-y-2", ...props }),
  ol: (props: any) =>
    React.createElement("ol", { className: "list-decimal pl-6 space-y-2", ...props }),
  blockquote: (props: any) =>
    React.createElement("blockquote", { className: "border-l-4 border-[var(--border)] pl-4 italic", ...props }),
  code: (props: any) =>
    React.createElement("code", {
      className:
        "rounded-md border border-[var(--code-border)] bg-[var(--inline-code-bg)] px-1.5 py-0.5 text-[0.95em] text-[var(--inline-code-text)]",
      ...props,
    }),
  pre: (props: any) =>
    React.createElement("pre", {
      className:
        "rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] text-[var(--code-text)] overflow-x-auto p-4 text-sm",
      ...props,
    }),
  DataTable,
};

/**
 * Return all published labs.
 * List order:
 * - pinned first
 * - then newest → oldest by date
 */
export async function getAllLabs(): Promise<LabListItem[]> {
  const files = getLabFilePaths();

  const items: LabListItem[] = files.map((fname) => {
    const full = fname;
    const fm = readLabFrontmatter(full);
    const slug = (fm.slug && String(fm.slug)) || filenameToSlug(full);
    const published = fm.published ?? true;
    const category = categoryFromPath(LABS_DIR, full);

    return {
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "1970-01-01",
      order: typeof fm.order === "number" ? fm.order : undefined,
      summary: fm.summary ?? fm.description ?? "",
      tags: fm.tags ?? [],
      published,
      pinned: fm.pinned ?? false,
      updated: fm.updated ? String(fm.updated) : undefined,
      category,
    };
  });

  return items
    .filter((it) => it.published)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

      const bt = dateToTs(b.date);
      const at = dateToTs(a.date);
      if (bt !== at) return bt - at;

      const ao = typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
      const bo = typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;

      return a.title.localeCompare(b.title);
    });
}

/** Load and compile a single lab by slug. */
export async function getLabBySlug(slug: string): Promise<LabDoc | null> {
  let filePath: string | null = null;
  for (const full of getLabFilePaths()) {
    const baseSlug = filenameToSlug(full);
    if (baseSlug === slug) {
      filePath = full;
      break;
    }
    const fm = readLabFrontmatter(full);
    if (fm.slug === slug) {
      filePath = full;
      break;
    }
  }

  if (!filePath) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);
  const frontmatter = data as LabFrontmatter;

  const words = content.trim().split(/\s+/).length;
  const readMin = Math.max(1, Math.ceil(words / 220));

  const { content: mdx } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  const meta = {
    title: frontmatter.title ?? slug,
    description: frontmatter.description ?? frontmatter.summary ?? "",
    date: frontmatter.date ?? "",
    tags: frontmatter.tags ?? [],
    readMin,
  };

  return { slug, frontmatter, mdx, meta };
}

export async function getPinnedLabs(limit = 1) {
  const all = await getAllLabs();
  const pinned = all.filter((l) => l.pinned);
  const source = pinned.length ? pinned : all;
  return source.slice(0, limit);
}
