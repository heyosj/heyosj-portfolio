// lib/posts.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import readingTime from "reading-time";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { categoryFromPath, listMdxFiles } from "./content";

const postsDir = path.join(process.cwd(), "content", "dispatch");

// allow lowercase letters, numbers, and dashes (kebab-case)
const Slug = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/, { message: "use lowercase letters, numbers, and dashes" });

// frontmatter schema with friendlier coercions/defaults
const Frontmatter = z.object({
  title: z.string(),

  // accept Date | string and coerce to "YYYY-MM-DD"
  date: z.preprocess((v) => {
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    if (typeof v === "string") return v;
    return String(v);
  }, z.string()),

  // optional manual override for "updated"
  updated: z.preprocess((v) => {
    if (v == null) return undefined;
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    if (typeof v === "string") return v;
    return String(v);
  }, z.string().optional()),

  description: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  slug: Slug.optional(),
  order: z.coerce.number().optional().default(999),

  // favorites aliases
  pinned: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  favorite: z.coerce.boolean().optional(),
});

function slugifyFilename(file: string) {
  return path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

export type Post = {
  title: string;
  date: string;
  updated: string;
  description: string;
  tags: string[];
  slug: string;
  category: string;
  readingTime: string;
  html: string;
  order: number;
  pinned: boolean;
};

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDir)) return [];
  const files = listMdxFiles(postsDir);
  const posts: Post[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { content, data } = matter(raw);

    const fm = Frontmatter.parse(data);
    const slug = fm.slug ?? slugifyFilename(file);
    const category = categoryFromPath(postsDir, file);

    const rt = readingTime(content).text;
    const compiled = await markdownToHtml(content);

    // Stable updated: only show if provided, else equal to date
    const updated = fm.updated ?? fm.date;

    // Normalize favorites → pinned
    const pinned = Boolean((fm as any).favorite ?? (fm as any).featured ?? fm.pinned ?? false);

    posts.push({
      title: fm.title,
      date: fm.date,
      updated,
      description: fm.description,
      tags: fm.tags,
      slug,
      category,
      readingTime: rt,
      html: compiled,
      order: fm.order ?? 999,
      pinned,
    });
  }

  // order asc, then date desc
  return posts.sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999) || +new Date(b.date) - +new Date(a.date)
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

// ---- Tag helpers ----
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  const t = tag.toLowerCase();
  return posts.filter((p) => p.tags.map((x) => x.toLowerCase()).includes(t));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

// ---- Date helpers (for homepage) ----
export async function getAllPostsByDate() {
  const posts = await getAllPosts();
  return [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getLatestPost() {
  const posts = await getAllPostsByDate();
  return posts[0] ?? null;
}

export async function getRecentPosts(limit = 5) {
  const posts = await getAllPostsByDate();
  return posts.slice(0, limit);
}

// ---- Pinned (for Start) ----
export async function getPinnedPosts(limit = 1) {
  const posts = await getAllPosts();
  const favs = posts.filter((p) => p.pinned);
  const source = (favs.length ? favs : posts).sort(
    (a, b) => +new Date(b.updated ?? b.date) - +new Date(a.updated ?? a.date)
  );
  return source.slice(0, limit);
}

// ---- Related posts ----
export async function getRelatedPosts(slug: string, limit = 3) {
  const posts = await getAllPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];

  const tagsLower = new Set(current.tags.map((t) => t.toLowerCase()));
  const isSeries = tagsLower.has("email security");

  if (isSeries) {
    return posts
      .filter(
        (p) => p.slug !== slug && p.tags.map((t) => t.toLowerCase()).includes("email security")
      )
      .slice(0, limit);
  }

  const scored = posts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const shared = p.tags.reduce((n, t) => n + (tagsLower.has(t.toLowerCase()) ? 1 : 0), 0);
      return { p, shared };
    })
    .filter((x) => x.shared > 0)
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared;
      return +new Date(b.p.date) - +new Date(a.p.date);
    })
    .slice(0, limit)
    .map((x) => x.p);

  return scored;
}
