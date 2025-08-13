import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import readingTime from "reading-time";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const postsDir = path.join(process.cwd(), "content", "posts");

const Frontmatter = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  slug: z.string().regex(/^[a-z0-9_]+$/, "slug must use lowercase letters, numbers, and underscores only"),
});

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
  description: string;
  tags: string[];
  slug: string;
  readingTime: string;
  html: string;
};

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md") || f.endsWith(".mdx"));
  const posts: Post[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { content, data } = matter(raw);
    const fm = Frontmatter.parse(data);
    const rt = readingTime(content).text;
    const compiled = await markdownToHtml(content);
    posts.push({ ...fm, readingTime: rt, html: compiled });
  }
  return posts.sort((a,b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}
