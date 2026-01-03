// lib/playbooks.ts
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import React from "react";

const PLAYBOOKS_DIR = path.join(process.cwd(), "content", "playbooks");

function isMDXFile(name: string) {
  return name.endsWith(".mdx") || name.endsWith(".md");
}
function filenameToSlug(filename: string) {
  return filename.replace(/\.mdx?$/i, "");
}

/* ---------- types ---------- */

export type PlaybookFrontmatter = {
  title: string;
  date: string;
  updated?: string;
  slug?: string;
  description?: string;
  tags?: string[];
  order?: number;
  url?: string;
  repo?: string;
  pinned?: boolean;
  featured?: boolean;
  favorite?: boolean;
};

export type PlaybookListItem = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  description: string;
  tags: string[];
  order: number;
  url: string;
  repo?: string;
  pinned: boolean;
};

export type PlaybookMeta = PlaybookListItem;

export type PlaybookDoc = {
  slug: string;
  frontmatter: PlaybookFrontmatter;
  content: string;
  mdx: React.ReactNode;
  meta: {
    title: string;
    description: string;
    date: string;
    tags: string[];
    readMin: number;
  };
};

/* ---------- mdx components ---------- */

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
    React.createElement(
      "blockquote",
      { className: "border-l-4 border-[var(--border)] pl-4 italic", ...props }
    ),
  code: (props: any) =>
    React.createElement(
      "code",
      {
        className:
          "rounded-md border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 text-[0.95em] text-[var(--ink)]",
        ...props,
      }
    ),
  pre: (props: any) =>
    React.createElement(
      "pre",
      {
        className:
          "rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--ink)] overflow-x-auto p-4 text-sm",
        ...props,
      }
    ),
};

/* ---------- helpers ---------- */

function readFrontmatter(fullPath: string): PlaybookFrontmatter {
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(raw);
  return data as PlaybookFrontmatter;
}

function getFilePaths(): string[] {
  if (!fs.existsSync(PLAYBOOKS_DIR)) return [];
  return fs.readdirSync(PLAYBOOKS_DIR).filter(isMDXFile);
}

/* ---------- list/meta ---------- */

export async function getPlaybooksMeta(): Promise<PlaybookListItem[]> {
  const files = getFilePaths();

  const items: PlaybookListItem[] = files.map((fname) => {
    const full = path.join(PLAYBOOKS_DIR, fname);
    const fm = readFrontmatter(full);
    const slug = fm.slug ?? filenameToSlug(fname);
    const updated = fm.updated || fm.date;
    const pinned = Boolean(fm.favorite ?? fm.featured ?? fm.pinned ?? false);

    return {
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "1970-01-01",
      updated,
      description: fm.description ?? "",
      tags: fm.tags ?? [],
      order: typeof fm.order === "number" ? fm.order : 9999,
      url: fm.url ?? `/playbooks/${slug}`,
      repo: fm.repo,
      pinned,
    };
  });

  return items.sort(
    (a, b) =>
      (a.order ?? 9999) - (b.order ?? 9999) ||
      +new Date(b.updated ?? b.date) - +new Date(a.updated ?? a.date)
  );
}

/**
 * NEW — used by homepage "latest playbook"
 * Sorted newest-first (updated > date)
 */
export async function getAllPlaybooks(): Promise<PlaybookListItem[]> {
  const all = await getPlaybooksMeta();
  return [...all].sort(
    (a, b) => +new Date(b.updated ?? b.date) - +new Date(a.updated ?? a.date)
  );
}

export async function getPinnedPlaybooks(limit = 1): Promise<PlaybookListItem[]> {
  const all = await getPlaybooksMeta();
  const favs = all.filter((i) => i.pinned);
  const source = (favs.length ? favs : all).sort(
    (a, b) => +new Date(b.updated ?? b.date) - +new Date(a.updated ?? a.date)
  );
  return source.slice(0, limit);
}

/* ---------- single doc ---------- */

export async function getPlaybook(slug: string): Promise<PlaybookDoc | null> {
  const directMDX = path.join(PLAYBOOKS_DIR, `${slug}.mdx`);
  const directMD = path.join(PLAYBOOKS_DIR, `${slug}.md`);
  let filePath: string | null = null;

  if (fs.existsSync(directMDX)) filePath = directMDX;
  else if (fs.existsSync(directMD)) filePath = directMD;
  else {
    for (const fname of getFilePaths()) {
      const full = path.join(PLAYBOOKS_DIR, fname);
      const fm = readFrontmatter(full);
      if (fm.slug === slug) {
        filePath = full;
        break;
      }
    }
  }
  if (!filePath) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);
  const frontmatter = data as PlaybookFrontmatter;

  const words = content.trim().split(/\s+/).filter(Boolean).length;
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
    description: frontmatter.description ?? "",
    date: frontmatter.updated ?? frontmatter.date ?? "",
    tags: frontmatter.tags ?? [],
    readMin,
  };

  return { slug, frontmatter, content, mdx, meta };
}
