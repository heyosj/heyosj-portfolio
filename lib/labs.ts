// lib/labs.ts
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

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
};

export type LabListItem = {
  slug: string;
  title: string;
  date: string;
  order: number;
  summary: string;
  tags: string[];
  published: boolean;
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
    readMin: number;        // ← add read time
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

  // Compile MDX → React node (RSC-safe)
  const { content: mdx } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        // IMPORTANT: no rehype-raw here (breaks RSC); HTML-like tags are fine as MDX JSX.
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
