#!/usr/bin/env node
import fs from "fs";
import path from "path";

const title = process.argv.slice(2).join(" ") || "my new post";
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
const date = new Date().toISOString().slice(0,10);

const dir = path.join("content", "posts");
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `${slug}.mdx`);

const fm = `---
title: "${title}"
date: "${date}"
description: "One-liner summary."
tags: ["security"]
slug: "${slug}"
---

Write your post here. You can use **Markdown** and \`code\` blocks.
`;
if (fs.existsSync(file)) {
  console.error("File exists:", file);
  process.exit(1);
}
fs.writeFileSync(file, fm);
console.log("Created:", file);
