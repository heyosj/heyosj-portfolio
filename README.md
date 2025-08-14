# OSJ Dispatch

Short, practical security notes — built with **Next.js (App Router)**, **Tailwind**, and **MDX**.  
Includes dark mode, RSS, and a simple Buttondown workflow to email new posts.

## Features

- ⚡️ Next.js App Router + MDX content
- 🌓 Light/Dark theme (soft, readable palette)
- 📝 Content-first: posts live in `content/posts`
- 📨 Subscribe form (Buttondown)
- 🔔 One-command broadcast to subscribers (`post:broadcast`, `post:latest`)
- 📰 RSS feed at `/rss.xml`

## Tech Stack

- Next.js 14+ (App Router)
- Tailwind CSS (+ Typography)
- MD/MDX via `gray-matter` + `remark/rehype`
- Buttondown API for email
- TypeScript

---

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Env vars
cp .env.example .env.local
# then fill in:
# BUTTONDOWN_API_KEY=...
# BROADCAST_SECRET=...
# NEXT_PUBLIC_SITE_URL=https://www.heyosj.com

# 3) Dev server
npm run dev
# open http://localhost:3000
```

> Deploy target: **Vercel**. Add the same env vars in your project settings.

---

## Content Model

Posts live in `content/posts` and are plain **.mdx** (or .md) files with frontmatter:

```md
---
title: "MTA-STS"
description: "Secure SMTP delivery with strict TLS: what it is, why it exists, how to roll it out."
date: "2025-08-14"     # must be a string
slug: "mta-sts"        # lowercase + numbers + dashes
tags: ["email security","smtp","tls"]
---

## your content starts here
```

**Slug rules:** `^[a-z0-9][a-z0-9-]*$`  
If you omit `slug`, the filename (kebab-case) is used automatically.

---

## Scripts

Add these to your **`package.json` → `scripts`**:

```json
{
  "scripts": {
    "post:new": "node -e \"const tz='America/Indiana/Indianapolis'; const title=(process.env.npm_config_title||process.argv.slice(1).join(' ')||'untitled').trim(); const slug=title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); const d=new Intl.DateTimeFormat('en-CA',{timeZone:tz}).format(new Date()); const fs=require('fs'); const {execSync}=require('child_process'); execSync('mkdir -p content/posts'); const p=`content/posts/${slug}.mdx`; const fm=`---\\n`+`title: \\\"${title}\\\"\\n`+`description: \\\"\\\"\\n`+`date: \\\"${d}\\\"\\n`+`slug: \\\"${slug}\\\"\\n`+`tags: []\\n`+`---\\n\\n## intro\\nwrite your note here…\\n`; fs.writeFileSync(p,fm); console.log('Created',p);\"",
    "post:broadcast": "dotenv -e .env.local -- node -e \"const slug=process.argv[1]; if(!slug){console.error('Usage: npm run post:broadcast -- <slug>'); process.exit(1);} const base=process.env.NEXT_PUBLIC_SITE_URL||'https://www.heyosj.com'; const key=process.env.BROADCAST_SECRET; if(!key){console.error('BROADCAST_SECRET missing'); process.exit(1);} const {execSync}=require('child_process'); execSync(`curl -i -L \\\"${base}/api/broadcast/${slug}?key=${key}\\\"`,{stdio:'inherit'});\"",
    "post:latest": "dotenv -e .env.local -- node -e \"const fs=require('fs'),path=require('path'),cp=require('child_process'); const base=process.env.NEXT_PUBLIC_SITE_URL||'https://www.heyosj.com'; const key=process.env.BROADCAST_SECRET; if(!key){console.error('BROADCAST_SECRET missing');process.exit(1);} const dir=path.join('content','posts'); if(!fs.existsSync(dir)){console.error('content/posts not found');process.exit(1);} const files=fs.readdirSync(dir).filter(f=>/\\.(md|mdx)$/.test(f)).map(f=>({f, m: fs.statSync(path.join(dir,f)).mtimeMs})).sort((a,b)=>b.m-a.m); if(!files.length){console.error('No posts in content/posts');process.exit(1);} const slug=path.basename(files[0].f).replace(/\\.(md|mdx)$/,''); console.log('Broadcasting latest:', slug); cp.execSync(`curl -i -L \\\"${base}/api/broadcast/${slug}?key=${key}\\\"`, {stdio:'inherit'});\""
  }
}
```

> One-time: `npm i -D dotenv-cli` to enable `post:broadcast` and `post:latest` reading `.env.local`.

---

## Writing & Publishing Workflow

**A) Create a post**
```bash
npm run post:new -- "Your Post Title"
# creates: content/posts/<kebab-slug>.mdx with frontmatter
```

**B) Edit → commit → deploy**
```bash
git add content/posts/<kebab-slug>.mdx
git commit -m "post: <kebab-slug>"
git push
```

**C1) Email subscribers for a specific post**
```bash
npm run post:broadcast -- <kebab-slug>
```

**C2) Email subscribers the latest post (no slug needed)**
```bash
npm run post:latest
```

**Success response (from Buttondown) looks like:**
```json
{"ok": true, "status": "scheduled", "publish_date": "2025-08-14T23:17:29.865000Z"}
```

---

## Subscribe & Email

- **Subscribe endpoint**: `/api/subscribe` (uses `BUTTONDOWN_API_KEY`)
- **Manual broadcast endpoint**: `/api/broadcast/[slug]`
  - Auth via query: `?key=${BROADCAST_SECRET}`  
    _or_ header: `Authorization: Bearer ${CRON_SECRET}` (optional)
- Emails are created as **public** & **scheduled** (send ~30s after request).
- Buttondown will only deliver to **confirmed, non-suppressed** subscribers.

> Want a safety check to prevent duplicate sends? Add a quick dedupe against `canonical_url` in the route.

---

## Project Structure

```
app/
  api/
    subscribe/route.ts
    broadcast/[slug]/route.ts
  blog/[slug]/page.tsx
  page.tsx
  layout.tsx
components/
content/
  posts/
    your-post.mdx
lib/
  posts.ts
public/
tailwind.config.js
```

---

## Environment Variables

Add to `.env.local` (and Vercel):

```
BUTTONDOWN_API_KEY=your_buttondown_api_key
BROADCAST_SECRET=your_random_long_string
NEXT_PUBLIC_SITE_URL=https://www.heyosj.com
# (optional, only if you use header auth for broadcast)
CRON_SECRET=another_random_long_string
```

---

## Troubleshooting

- **404 on `/api/broadcast/<slug>`** → Ensure `app/api/broadcast/[slug]/route.ts` exists and the deploy finished.
- **`subscriber_suppressed` from Buttondown** → The email was previously deleted/hard-bounced; unsuppress or use a different test email.
- **No email received** → Check Buttondown → Emails for the scheduled send; verify the subscriber is confirmed and your “From” address is verified.

---

## License

MIT (or your preference).
