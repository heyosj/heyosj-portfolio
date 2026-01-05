# heyosj: dispatch

Short, practical security notes — written to show my thinking and hands‑on ability.  
I publish working notes on email, cloud and other SecOps topics.

---

## Why this exists

I wanted a simple place to **demonstrate how I learn, reason, and ship**:
- Terse, actionable posts instead of long theory.
- Clear sequencing for the Email Security series so readers (and hiring managers) can follow my path.
- A home I can update frequently as I keep learning.

---

## Objectives

- **Clarity first.** Explain security concepts the way I use them at work.
- **Trace my thinking.** Show decisions, trade‑offs, and gotchas.
- **Grow over time.** Add posts as I learn; mark updates when I revisit topics.

---

## What you’ll find

- Email Security series (SMTP → Authentication → MTA‑STS → more)
- Ordered reading flow, prev/next links, and related posts
- Short, practical walkthroughs and snippets you can use on the job

---

## Tech stack

- **Next.js (App Router)** for routing & performance  
- **MDX + gray‑matter** for content  
- **Tailwind CSS (+ Typography)** for clean, readable UI  
- **TypeScript** end‑to‑end  
- **Vercel** for deployment  
- _Optional_: **Buttondown** to email new posts to subscribers

---

## Highlights

- **Content‑first:** dispatch posts live in `content/dispatch/<category>` (MD/MDX)
- **Series ordering:** tag a post `email security` and set `order` (1, 2, 3…)
- **Nice reading UX:** tags, prev/next in series, related posts
- **Maintained notes:** “Published” + “Updated” dates on each post
- **Good previews:** Metadata + JSON‑LD for clean link cards

---

## Content model

A post is a plain `.mdx` file with frontmatter:

```md
---
title: "Your Post Title"
description: "One-sentence summary."
date: "2025-08-14"           # YYYY-MM-DD (string)
slug: "your-post-title"      # optional; defaults to filename
tags: ["email security","smtp"]
order: 999                    # 1,2,3… for series; 999 for standalone
updated: "2025-08-15"         # optional
---

## Heading
Your content in MDX/Markdown.
```

**Series:** add the `email security` tag and set `order` so posts appear in sequence and link correctly.

---

## Project structure (short)

```
app/
  (site)/dispatch/[slug]/page.tsx   # post page (TOC pills, series nav, related)
  (home)/page.tsx                   # home
components/
content/
  dispatch/              # your .md/.mdx files (category subfolders)
lib/
  posts.ts               # parses frontmatter, order, tags, dates
```

---

## Run locally

```bash
npm install
cp .env.example .env.local
# set at least NEXT_PUBLIC_SITE_URL (e.g., https://www.heyosj.com)
npm run dev
# open http://localhost:3000
```

_Optional (email):_ add `BUTTONDOWN_API_KEY` and `BROADCAST_SECRET` to enable subscribe/broadcast endpoints.

---

## License

MIT (or your preference).
