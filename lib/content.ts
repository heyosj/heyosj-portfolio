import fs from "node:fs";
import path from "node:path";

function isMdxFile(name: string) {
  return name.endsWith(".mdx") || name.endsWith(".md");
}

export function listMdxFiles(rootDir: string): string[] {
  if (!fs.existsSync(rootDir)) return [];
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMdxFiles(fullPath));
      continue;
    }
    if (entry.isFile() && isMdxFile(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

export function categoryFromPath(rootDir: string, fullPath: string): string {
  const rel = path.relative(rootDir, fullPath);
  const dir = path.dirname(rel);
  if (dir === "." || dir === path.sep) return "uncategorized";
  return dir.split(path.sep)[0];
}

export function filenameToSlug(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}
