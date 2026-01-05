#!/usr/bin/env node
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
let category = "general";
const titleParts = [];

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--category" || arg === "-c") {
    category = args[i + 1] || "";
    i += 1;
    continue;
  }
  titleParts.push(arg);
}

const title = titleParts.join(" ").trim() || "my new post";
const categorySlug = category
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9\\s-]/g, "")
  .trim()
  .replace(/\\s+/g, "-")
  .replace(/-+/g, "-");
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
const date = new Date().toISOString().slice(0,10);

if (!categorySlug) {
  console.error("Category required. Use --category <name>.");
  process.exit(1);
}

const dir = path.join("content", "dispatch", categorySlug);
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `${slug}.mdx`);

const fm = `---
title: "${title}"
description: ""
date: "${date}"
slug: "${slug}"
tags: []
order: 999
favorite: false
---

## intro

`;
if (fs.existsSync(file)) {
  console.error("File exists:", file);
  process.exit(1);
}
fs.writeFileSync(file, fm);
console.log("Created:", file);
