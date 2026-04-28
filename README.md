# DevStack Pro

> A modern technical blogging platform and mini social network for developers — built with Next.js 15, Supabase, and Cloudflare R2.

**Live:** [devstackpro.cloud](https://devstackpro.cloud)

---

## Overview

DevStack Pro is a developer-focused content platform combining long-form technical writing with social features — following, liking, commenting, and a personalized feed. Authors get a full Markdown editor with AI-assisted content generation powered by xAI Grok.

---

## Tech Stack

| Layer           | Technology                                                                                |
| --------------- | ----------------------------------------------------------------------------------------- |
| Framework       | Next.js 15 (App Router, React Server Components)                                          |
| Database & Auth | Supabase (PostgreSQL + Row Level Security)                                                |
| Storage         | Cloudflare R2 (images via presigned URL upload)                                           |
| Deployment      | Vercel                                                                                    |
| AI              | xAI Grok — `grok-4-1-fast-reasoning` (research) + `grok-4-1-fast-non-reasoning` (writing) |
| Styling         | Tailwind CSS                                                                              |
| Validation      | Zod                                                                                       |

---

## Features

### Reader / Public

- **Home feed** — paginated list of published articles with cursor-based infinite scroll
- **Article detail** — full Markdown rendering with syntax highlighting
- **Search** — full-text search across article titles
- **Contact form** — sends messages stored in the database, managed via admin panel

### Social

- **Follow system** — follow/unfollow authors; personalized following feed via Supabase RPC (`get_following_feed`)
- **Like system** — like/unlike articles; optimistic UI updates
- **Comments & replies** — nested comment threads (parent → reply), soft-delete support
- **Author profile** — public profile page with published articles; owner sees both published and draft tabs

### Author / Content

- **Markdown editor** — full-featured editor with toolbar, preview, and image upload
- **Draft / Publish workflow** — save as draft or publish immediately; toggle status anytime
- **Thumbnail upload** — direct-to-R2 via presigned URL, 10 MB limit, supports JPEG / PNG / WebP / AVIF
- **Tag system** — assign tags to articles; browsable by tag
- **Dashboard** — metrics for total posts, published, drafts, total views; monthly traffic chart; recent activity table
- **AI article generation** — given a topic, the system: (1) researches recent sources via web search, (2) generates SEO metadata (title, description, slug, keyword), (3) streams the full blog post in Markdown (~950–1,200 words)

### Admin Panel (`/admin`)

- Dashboard with platform-wide metrics
- Article status management
- Tag management (create, edit, delete)
- Contact / message inbox with soft-delete
- Role-based access: `admin` | `moderator` | `user`

---

## Project Structure

```
├── app/                        # Next.js App Router
│   ├── (admin)/admin/          # Admin panel pages
│   ├── (auth)/                 # Sign-in / Sign-up
│   ├── (user)/
│   │   ├── (main)/             # Home, Following feed, Search
│   │   └── (profile)/[username]/
│   │       ├── articles/       # Article detail & new article
│   │       └── editor/[id]/    # Article editor
│   ├── api/
│   │   ├── ai-generate/        # AI article generation endpoint
│   │   └── images/upload/      # Image upload handler
│   └── contact/
│
├── public/components/
│   ├── admin/                  # Admin UI components
│   ├── user/                   # ArticleCard, Comment, Header, SideBar…
│   └── shared/
│
├── server/                     # Server-side logic (layered architecture)
│   ├── articles/               # repository → service → action
│   ├── comments/
│   ├── follows/
│   ├── article-likes/
│   ├── tags/
│   ├── users/
│   ├── search-article/
│   ├── messages/
│   └── contacts/
│
├── lib/
│   ├── supabase/               # client / server / middleware helpers
│   └── cloudflare/r2.ts        # R2 S3 client config
│
└── hooks/                      # useArticleCard, useFileUpload
```

### Server Layer Convention

Each domain follows a three-layer pattern:

```
repository.ts   →   raw Supabase queries, no business logic
service.ts      →   business logic, auth checks, data mapping
action.ts       →   Next.js Server Actions called from Client Components
```

---

## Database Schema (key tables)

| Table           | Description                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `users`         | Auth profiles — `id`, `username`, `display_name`, `avatar_url`, `role`                                    |
| `articles`      | Posts — `title`, `slug`, `content_md`, `thumbnail`, `status` (`draft`/`published`), `views`, `deleted_at` |
| `article_tags`  | Join table — articles ↔ tags                                                                              |
| `tags`          | Tag list                                                                                                  |
| `article_likes` | User ↔ article likes                                                                                      |
| `comments`      | Threaded comments — `parent_id` nullable for replies                                                      |
| `follows`       | `follower_id` → `following_id`                                                                            |
| `messages`      | Contact form submissions, soft-delete                                                                     |

All deletes are **soft deletes** via `deleted_at` timestamp.

---

## Local Development

### Prerequisites

- Node.js 18+
- A Supabase project
- A Cloudflare R2 bucket
- xAI API key (for AI generation feature)

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
R2_REGION=          # set to "eu" for EU region, omit otherwise

# xAI (AI generation)
XAI_API_KEY=
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Authentication & Authorization

Auth is handled by Supabase Auth. Route protection is enforced in middleware (`proxy.ts`):

| Route pattern             | Rule                                                                    |
| ------------------------- | ----------------------------------------------------------------------- |
| `/sign-in`, `/sign-up`    | Redirect to `/` if already authenticated                                |
| `/[username]/editor/[id]` | Requires authentication; ownership is verified at the page/action level |
| `/admin/*`                | Role check (`admin` / `moderator`) enforced server-side                 |

---

## Image Upload Flow

1. Client requests a presigned URL from `/api/upload/presigned-url`
2. File is uploaded directly from the browser to Cloudflare R2
3. The public CDN URL is stored in the article record
4. Max file size: **10 MB**; accepted types: JPEG, PNG, WebP, AVIF

---

## AI Article Generation Flow

1. **Research** — Grok reasoning model searches the web (arxiv, TechCrunch, The Verge, Wired, MIT Tech Review) for recent sources on the given topic
2. **Metadata** — Fast model generates SEO title, description, slug, and primary keyword as structured JSON
3. **Writing** — Fast model streams a 950–1,200 word Markdown article grounded in the research notes; metadata is returned via `X-Blog-Meta` response header

---

## Deployment

The project is deployed on **Vercel** with zero-config Next.js support. Connect the repository in the Vercel dashboard and add the environment variables listed above.

---

## License

Private — all rights reserved.
