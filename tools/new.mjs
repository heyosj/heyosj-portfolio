#!/usr/bin/env node
/**
 * Simple content generator for heyosj.com
 * Usage:
 *   node tools/new.mjs post "smtp"
 *   node tools/new.mjs playbook "mta-sts rollout"
 *   node tools/new.mjs lab "htb - machine name"
 */

import fs from "node:fs";
import path from "node:path";

const TYPES = {
  post: { dir: "content/posts", label: "post" },
  playbook: { dir: "content/playbooks", label: "playbook" },
  lab: { dir: "content/labs", label: "lab" },
};

function toSlug(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function today() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function template(kind, title, slug) {
  const date = today();
  const commonFrontmatter = `---
title: "${title}"
description: ""
date: "${date}"
tags: []
---

`;

  if (kind === "post") {
    return (
      commonFrontmatter +
      `> tl;dr — one-liner value statement.

## why it matters

## how to do it

## checklist

`
    );
  }

  if (kind === "playbook") {
    return (
      `---
title: "${title}"
description: ""
date: "${date}"
tags: []
related: [] # optional related dispatch slugs
repo: ""    # optional GitHub repo/url
---

> when to use this

## prerequisites

## steps

## verification

## references

`
    );
  }

  // lab
  return (
    `---
title: "${title}"
description: ""
date: "${date}"
tags: []
status: "draft" # draft | complete
---

## context

## approach

## notes

## outcome

`
  );
}

function assertNotExists(filePath) {
  if (fs.existsSync(filePath)) {
    console.error(`✖ File already exists: ${filePath}`);
    process.exit(1);
  }
}

async function main() {
  const kind = (process.argv[2] || "").toLowerCase();
  const rawName = process.argv.slice(3).join(" ").trim();

  if (!TYPES[kind]) {
    console.error(
      `Usage:\n  node tools/new.mjs post "my title"\n  node tools/new.mjs playbook "my playbook"\n  node tools/new.mjs lab "my lab"`
    );
    process.exit(1);
  }
  if (!rawName) {
    console.error(`✖ Please provide a name/title, e.g.:
  npm run new:post smtp
  npm run new:playbook "mta-sts rollout"
  npm run new:lab "htb - machine name"`);
    process.exit(1);
  }

  const slug = toSlug(rawName);
  const { dir, label } = TYPES[kind];

  const root = process.cwd();
  const outDir = path.join(root, dir);
  const outFile = path.join(outDir, `${slug}.mdx`);

  fs.mkdirSync(outDir, { recursive: true });
  assertNotExists(outFile);

  const body = template(kind, rawName, slug);
  fs.writeFileSync(outFile, body, "utf8");

  console.log(`✔ Created ${label}: ${path.relative(root, outFile)}`);
  console.log(`   title: "${rawName}"`);
  console.log(`   slug:  ${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
