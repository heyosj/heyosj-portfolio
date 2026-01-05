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
  post: { dir: "content/dispatch", label: "post" },
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
slug: "${slug}"
tags: []
order: 999
favorite: false
---

`;

  if (kind === "post") {
    return commonFrontmatter + `## intro\n\n`;
  }

  if (kind === "playbook") {
    return (
      `---
title: "${title}"
description: ""
date: "${date}"
updated: "${date}"
slug: "${slug}"
tags: []
order: 999
pinned: false
repo: ""
favorite: false
---

> scenario

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
slug: "${slug}"
tags: []
order: 999
difficulty: ""
category: ""
---

## overview

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
  const args = process.argv.slice(2);
  const kind = (args.shift() || "").toLowerCase();
  let category = "general";
  const nameParts = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--category" || arg === "-c") {
      category = args[i + 1] || "";
      i += 1;
      continue;
    }
    nameParts.push(arg);
  }

  const rawName = nameParts.join(" ").trim();
  const categorySlug = toSlug(category);

  if (!TYPES[kind]) {
    console.error(
      `Usage:\n  node tools/new.mjs post "my title" --category email-security\n  node tools/new.mjs playbook "my playbook" --category email\n  node tools/new.mjs lab "my lab" --category dfir`
    );
    process.exit(1);
  }
  if (!rawName) {
    console.error(`✖ Please provide a name/title, e.g.:
  npm run new:post -- "smtp" --category email-security
  npm run new:playbook -- "mta-sts rollout" --category email
  npm run new:lab -- "htb - machine name" --category dfir`);
    process.exit(1);
  }
  if (!categorySlug) {
    console.error("✖ Please provide a valid category (letters/numbers/hyphens).");
    process.exit(1);
  }

  const slug = toSlug(rawName);
  const { dir, label } = TYPES[kind];

  const root = process.cwd();
  const outDir = path.join(root, dir, categorySlug);
  const outFile = path.join(outDir, `${slug}.mdx`);

  fs.mkdirSync(outDir, { recursive: true });
  assertNotExists(outFile);

  const body = template(kind, rawName, slug);
  fs.writeFileSync(outFile, body, "utf8");

  console.log(`✔ Created ${label}: ${path.relative(root, outFile)}`);
  console.log(`   title: "${rawName}"`);
  console.log(`   slug:  ${slug}`);
  console.log(`   category: ${categorySlug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
