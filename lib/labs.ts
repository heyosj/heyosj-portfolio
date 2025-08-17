// lib/labs.ts
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import React from "react";

export type LabFrontmatter = {
  title: string;
  date: string;             // ISO string
  slug?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  order?: number;
  published?: boolean;
  type?: "lab";
  pinned?: boolean;         // NEW
};

export type LabListItem = {
  slug: string;
  title: string;
  date: string;
  order: number;
  summary: string;
  tags: string[];
  published: boolean;
  pinned: boolean;          // NEW
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

function isMDXFile(name: string) {
  return name.endsWith(".mdx") || name.endsWith(".md");
}

export function getLabFilePaths(): string[] {
  if (!fs.existsSync(LABS_DIR)) return [];
  return fs.readdirSync(LABS_DIR).filter(isMDXFile);
}

export function filenameToSlug(filename: string) {
  return filename.replace(/\.mdx?$/i, "");
}

export function readLabFrontmatter(filePath: string): Partial<LabFrontmatter> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return data as Partial<LabFrontmatter>;
}

/** theme-aware MDX component mapping (no TSX; uses React.createElement) */
const mdxComponents = {
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
    React.createElement("code", { className: "rounded-md border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 text-[0.95em] text-[var(--ink)]", ...props }),
  pre: (props: any) =>
    React.createElement("pre", { className: "rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--ink)] overflow-x-auto p-4 text-sm", ...props }),
};

/** Return all published labs, sorted by (order ASC, date DESC). */
export async function getAllLabs(): Promise<LabListItem[]> {
  const files = getLabFilePaths();

  const items: LabListItem[] = files.map((fname) => {
    const full = path.join(LABS_DIR, fname);
    const fm = readLabFrontmatter(full);
    const slug = (fm.slug && String(fm.slug)) || filenameToSlug(fname);
    const published = fm.published ?? true;
    const order = typeof fm.order === "number" ? fm.order : 9999;

    return {
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "1970-01-01",
      order,
      summary: fm.summary ?? fm.description ?? "",
      tags: fm.tags ?? [],
      published,
      pinned: fm.pinned ?? false,
    };
  });

  return items
    .filter((it) => it.published)
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

/** Load and compile a single lab by slug. */
export async function getLabBySlug(slug: string): Promise<LabDoc | null> {
  const directMDX = path.join(LABS_DIR, `${slug}.mdx`);
  const directMD = path.join(LABS_DIR, `${slug}.md`);
  let filePath: string | null = null;

  if (fs.existsSync(directMDX)) filePath = directMDX;
  else if (fs.existsSync(directMD)) filePath = directMD;
  else {
    for (const fname of getLabFilePaths()) {
      const full = path.join(LABS_DIR, fname);
      const fm = readLabFrontmatter(full);
      if (fm.slug === slug) {
        filePath = full;
        break;
      }
    }
  }

  if (!filePath) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);
  const frontmatter = data as LabFrontmatter;

  // --- read time (≈220 wpm) ---
  const words = content.trim().split(/\s+/).length;
  const readMin = Math.max(1, Math.ceil(words / 220));

  // Compile MDX → React node (RSC-safe) WITH styled components
  const { content: mdx } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        // IMPORTANT: no rehype-raw here (breaks RSC)
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

// NEW: pinned helper
export async function getPinnedLabs(limit = 1) {
  const all = await getAllLabs();
  const pinned = all.filter(l => l.pinned);
  const source = pinned.length ? pinned : all;
  return source.slice(0, limit);
}
