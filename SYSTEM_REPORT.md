# 📊 SYSTEM REPORT — DevStackPro

> **Reviewed by:** Senior Staff Engineer / Product Architect  
> **Stack:** Next.js App Router · Supabase (PostgreSQL + RLS) · Server Actions · React Hooks · Cloudflare R2  
> **Codebase scope:** `(user)/` pages, `hooks/`, `server/`, `providers/`, `sitemap.ts`, `types/index.ts`

---

## 1. System Overview

### High-Level Architecture

DevStackPro is a **social blogging platform** (think Dev.to / Hashnode clone) built on:

```
Browser
  └─ Next.js App Router (React Server Components + Client Components)
       ├─ Server Actions ("use server") → Supabase PostgreSQL
       ├─ Supabase Auth (JWT sessions via cookies)
       ├─ Cloudflare R2 (image/file storage via presigned PUT URLs)
       └─ unstable_cache / React cache() for data caching
```

The routing structure follows a **grouped layout pattern**:

- `(user)/` — public-facing layout with global Header
- `(user)/[username]/` — per-author layout with `LeftSideBar`, `ModalProvider`, `EditProfileModal`
- `(user)/[username]/articles/[slug]/` — article detail
- `(user)/[username]/editor/[id]/` — article editor (client component)
- `(user)/search/[q]/` — search results

### Server / Client Separation Strategy

The strategy is **mostly correct** but has notable inconsistencies:

- **Server Components** handle data fetching for profile pages, article lists, article detail, search — good pattern.
- **Client Components** handle interactivity: editor, like buttons, comment input, follow button.
- **AuthProvider** bridges server-side initial session (`initialProfile` prop from RSC) with client-side Supabase auth listener — solid hybrid hydration approach.
- **Problem:** `getCachedArticleBySlug` (in `articles.user.service.ts`) uses `createClient` from `@/lib/supabase/client` inside a server-side cached function. This is architecturally **wrong** — the browser client should never be used server-side. This will behave unpredictably (cookie auth won't work, anon key only).

### Data Flow

```
User Request
  → RSC Page (e.g. ArticlePage)
    → Server Service (e.g. getArticleBySlug)
      → Supabase client (server) → PostgreSQL
        → Data mapped via mapArticle()
          → Props passed to Client Components
            → Client Components use Server Actions for mutations
              → Server Action → Service → Supabase → return result
                → Client updates local state (no router.refresh() in most cases)
```

### Core Modules

| Module | Role |
|---|---|
| `server/users/` | Auth (signIn/signUp), user profile CRUD |
| `server/articles/articles.author.service.ts` | Author-only CRUD + dashboard metrics |
| `server/articles/articles.user.service.ts` | Public article reads + caching |
| `server/article-likes/` | Toggle like, check like status |
| `server/article-comments/` | Nested comments (parent + replies) |
| `server/follows/` | Follow/unfollow + counts |
| `providers/AuthProvider.tsx` | Client-side auth context + session hydration |
| `providers/ModalProvider.tsx` | Single-modal global state |
| `hooks/useFileUpload.ts` | R2 presigned upload with progress |
| `hooks/useFollow.ts` | Client-side follow stats via server actions |

---

## 2. Feature Analysis

### 2.1 Authentication / User System

**Purpose:** Email+password auth via Supabase Auth, with a custom `users` table storing extended profile data (username, display_name, bio, avatar_url, role).

**Implementation:**
- `signIn()` → `supabase.auth.signInWithPassword()` then queries `users` table for full profile
- `signUp()` → `supabase.auth.signUp()` with metadata (username, display_name, avatar_url); likely a DB trigger syncs metadata into `users` table on first login
- `AuthProvider` receives `initialProfile` (server-fetched) as prop, then listens to `onAuthStateChange` for client-side session events
- `getUser()` wrapped in `React.cache()` — correctly deduplicates within a request

**Critical Bug — Auth Service uses wrong Supabase client:**
`auth.service.ts` imports `createClient` from `@/lib/supabase/client` (browser client). This file is used for `signIn`/`signUp`. If this is called in a Server Action context, the browser client won't have access to cookies and will fall back to anon key only. This needs to be the **server** client for any server-side auth call.

**Bug — signIn ignores profileError:**
```ts
const { data: profile, error: profileError, status } = await supabase
    .from("users").select("*").eq("id", data.user.id).maybeSingle();
// profileError is never checked — silently returns null profile
```

**Bug — Random avatar on signUp is client-side only:**
Avatar is picked with `Math.random()` in the service. If triggered server-side in concurrent requests, this is fine; but the avatar list (4 static files) is hardcoded — not scalable and brittle.

**AuthProvider onAuthStateChange dependency issue:**
```ts
useEffect(() => { ... }, [initialProfile]);
```
The effect depends on `initialProfile` but the cleanup is only for the listener. If `initialProfile` changes (unlikely but possible on layout re-render), the listener is recreated, causing a memory leak risk. The dependency should likely be `[]`.

**Missing features:** No OAuth (Google/GitHub), no email verification flow in UI, no password reset UI.

---

### 2.2 Articles (CRUD, draft/publish)

**Purpose:** Authors can create, edit, publish/draft, soft-delete articles. Public users can read published articles.

**Implementation:**
- Two separate services: `articles.author.service.ts` (authenticated CRUD) and `articles.user.service.ts` (public reads with caching)
- `ARTICLE_SELECT` constant re-used consistently — good pattern
- `mapArticle()` helper centralizes data mapping — good
- Soft delete via `deleted_at` timestamp
- View increment via Supabase RPC `increase_article_view`

**Critical Bug — Tag insertion is commented out in `createArticle`:**
```ts
// 2. Insert tags nếu có
// if (tags.length > 0) { ... }
```
This is dead code. Tags are accepted in `CreateArticleRequest` but **never persisted** on article creation. Tags only work on update if `updateArticle` handles them — but looking at `updateArticle`, it also does **not** handle tags. Tags are completely broken for both create and update flows.

**Bug — updateArticle has no ownership check:**
```ts
export async function updateArticle(params) {
    const supabase = await createClient();
    await getAuthUser(supabase); // only checks if logged in
    // NO .eq("user_id", user.id) filter!
    await supabase.from("articles").update({...}).eq("id", article.id)
```
Any authenticated user can update **any** article by guessing the ID. This is a **critical authorization bypass**. RLS must compensate — if not enforced, this is a data integrity disaster.

**Bug — getArticle (author service) view increment logic is inverted:**
```ts
// Chỉ tăng view cho guest
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    await supabase.rpc("increase_article_view", { article_id: article.id });
}
```
This is in the **author's editor** service (`getArticle` for edit page). Why is view counting happening in the editor fetch? An author loading their own draft article for editing should never increment views. This logic is misplaced entirely.

**Bug — getCachedArticleBySlug uses browser client server-side:**
```ts
const supabase = await createPublishClient(); // ← this is @/lib/supabase/client (BROWSER)
```
Inside `unstable_cache`, this is called at render time on the server. The browser Supabase client should never be instantiated server-side. It will use anon key only, which may work for public content but breaks any user-specific data and is architecturally wrong.

**Performance concern — increaseView is fire-and-forget:**
```ts
void increaseView(article.id);
```
This is called in the RSC render path. Calling `void` on a server action in RSC is not a recommended pattern — it creates an untracked promise. If the RPC fails, there's no error handling. Should be moved to a client-side effect or a proper background queue.

**Missing:** No rich text / WYSIWYG (Markdown only — acceptable for dev blog). No image gallery. No article scheduling. No "archived" status UI. Tag management on create is broken.

---

### 2.3 Comments (nested + replies)

**Purpose:** Hierarchical comment system — top-level comments (parent_id = null) and replies (parent_id = commentId).

**Implementation:**
- `getParentComments` fetches root comments with `reply_count` via Supabase embedded count
- `getReplies` fetches by `parent_id` lazily (on demand)
- `createComment` validates parent exists and is not soft-deleted before inserting
- Soft delete via `deleted_at`
- Only 1 level of nesting supported (parent → child), not truly recursive

**Bug — deleteComment has no ownership check:**
```ts
export async function deleteComment(commentId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    // Only checks authenticated, no .eq("user_id", user.id) filter
    await supabase.from("comments")
        .update({ deleted_at: ... })
        .eq("id", commentId)
```
Any authenticated user can soft-delete **any comment**. Critical authorization bypass — depends entirely on RLS to save this.

**Bug — comment_likes table is defined in types but never used:**
```ts
export type CommentLike = Tables<'comment_likes'>
```
Comment likes exist in the type system but there is no service, action, or UI for them. Dead type.

**Performance concern:** Comments are loaded via client-side Server Actions after page render (`getParentCommentsAction`). This means comment section causes an extra round-trip waterfall after the article RSC loads. Should be fetched server-side and passed as initial props, then use client actions only for mutations.

---

### 2.4 Likes System

**Purpose:** Users can toggle like on articles. Like count and `is_liked` state are shown.

**Implementation:**
- `toggleArticleLike`: checks existing row → delete (unlike) or insert (like) — optimistic-unfriendly, requires 2 DB calls minimum
- `is_liked` in article listing: built via Supabase join `is_liked:article_likes(user_id)` and filtered in `mapArticle`
- `isHasUserLikeArticle` exists as separate check but creates a 3rd DB call pattern if used alongside toggle

**Race condition bug:**
`toggleArticleLike` is not atomic — check-then-act pattern:
```
1. SELECT existing
2. if exists → DELETE
   else → INSERT
```
Concurrent requests can result in double likes. Needs a DB upsert with unique constraint or an atomic RPC.

**`is_liked` calculation is client-ID dependent:**
```ts
is_liked: currentUserId
    ? !!(a.is_liked?.some((like: any) => like.user_id === currentUserId))
    : false,
```
Fetching ALL likes for a user just to check if current user liked it — this approach fetches the full `is_liked` array from Supabase. At scale (1000 likes on an article), this returns 1000 `user_id` rows per article per query. This is a **high severity N+1 / over-fetch pattern**.

**Missing:** No like count on comments (type defined, no implementation).

---

### 2.5 Follow System

**Purpose:** Users can follow/unfollow other authors. Follower/following counts displayed on profile.

**Implementation:**
- `toggleFollowAction`: calls `isFollowing` then `followUser` or `unfollowUser` — 2 round trips minimum
- `useFollowStats` hook: fires 2 parallel server actions (`getFollowerCountAction`, `getFollowingCountAction`) on mount via `useEffect`
- Each follow count is a separate DB query with `count: exact`

**Critical Performance Issue:**
`useFollowStats` makes **2 Server Action calls** from the client on every profile page load. These are sequential waterfall server round-trips disguised as parallel. Server Actions are HTTP POST requests — parallel Promise.all helps, but still 2 HTTP requests vs 1 SQL query with both counts. Should be a single `getFollowStats(userId)` call returning both counts.

**toggleFollowAction race condition** (same as likes):
```ts
const isFollow = await isFollowing(followingId); // SELECT
if (isFollow) { await unfollowUser(...) } // DELETE
else { await followUser(...) } // INSERT
```
Not atomic. Concurrent clicks cause inconsistency.

**Missing:** No "followers list" or "following list" pages. No notification when someone follows you. No follow feed (see articles from followed authors).

---

### 2.6 Profile System

**Purpose:** Public author profile showing bio, avatar, articles, follow stats.

**Implementation:**
- `[username]/layout.tsx` fetches user by username from DB
- `[username]/page.tsx` also fetches user by username **again** + fetches articles + current viewer identity
- `LeftSideBar` receives user data as prop
- `EditProfileModal` is mounted in layout but data comes from `ModalProvider` state

**Duplicate DB call:**
`layout.tsx` calls `getUserByUsername(username)` and `page.tsx` also calls `getUserByUsername(username)`. This is 2 identical DB queries per profile page load. Next.js `React.cache()` could deduplicate this if `getUserByUsername` were wrapped in it, but it is **not** — only `getUser` is.

**Missing:** No follower/following list views. No "liked articles" tab. No activity feed. No pagination on articles list (hardcoded `.limit(15)`).

---

### 2.7 Views System

**Exists but poorly implemented.**

- `views` column exists on `articles` table (inferred from `getDashboardMetrics` reading it and `increase_article_view` RPC)
- `getMonthlyTraffic` uses article `created_at` as the traffic date — this is **completely wrong**. Traffic should be tracked by when the view happened, not when the article was created. All views of an article published in January will show up in January, even if the actual views happened in April.
- No per-day view tracking table — views are stored as a single integer counter, making time-series analytics impossible without a separate events table.
- View increment fires from both `getArticle` (author service, for guests only — misplaced) and `increaseView` (user service, via `void` in RSC)

**The entire analytics model is flawed.** The dashboard traffic chart is misleading data.

---

### 2.8 Sitemap / SEO Structure

**Good effort, critical flaws.**

```ts
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

- Sitemap uses a **module-level Supabase client** — instantiated once at module load time. In a serverless environment (Vercel), this is a cold-start singleton that may not have proper connection handling. Should create a client per request.
- Only fetches `limit(15)` articles for sitemap — a sitemap with 15 URLs is nearly useless for SEO of a blog with potentially hundreds of articles. Should paginate or use a sitemap index.
- `revalidate = 3600` is set correctly for ISR but the comment says "Buộc route này luôn render động" (force dynamic) — this is incorrect. `revalidate = 3600` means ISR (static with 1-hour refresh), not dynamic.
- `generateMetadata` in article page has a hardcoded URL `devstackpro.cloud/articles/` but the actual URL structure is `[username]/articles/[slug]`. The OG canonical URL is **wrong** — it doesn't include the username segment.
- `generateMetadata` and `ArticlePage` both call `getArticleBySlug` — this does benefit from `unstable_cache` since it's the same slug, but they're in separate function calls and `unstable_cache` is created **inside** the function on every call, which means a new cache key wrapper is created each time. This is the incorrect usage of `unstable_cache`.

---

## 3. Database Review

### Inferred Schema (from code)

```
users           (id uuid PK, username, email, display_name, bio, avatar_url, role, created_at, updated_at, deleted_at)
articles        (id int8 PK, user_id FK→users, title, slug, description, content_md, content_html, thumbnail, status, views, created_at, updated_at, deleted_at)
tags            (id, name, created_at)
article_tags    (article_id FK, tag_id FK) — junction table
article_images  (id, article_id FK, ...)
article_likes   (id, article_id FK, user_id FK)
comments        (id uuid PK, article_id FK, user_id FK, parent_id FK→comments, content, created_at, deleted_at)
comment_likes   (id, comment_id FK, user_id FK) — defined in types, no implementation
follows         (id, follower_id FK→users, following_id FK→users)
messages        (id, ..., deleted_at)
contact_requests (id, email, name, message)
```

### RLS Policy Quality

**Cannot audit RLS directly** (no schema file provided), but inferring from code:

**Critical gaps identified:**

1. `updateArticle` has no `user_id` filter in the query — if RLS doesn't enforce `user_id = auth.uid()` on UPDATE for `articles`, any authenticated user can overwrite any article.

2. `deleteComment` has no `user_id` filter — same risk for comments table.

3. `contact.user.service.ts` uses **browser client** (`createClient` from `@/lib/supabase/client`) to insert into `contact_requests` without any auth check. This means unauthenticated users can spam contact requests with no rate limiting. The anon key is used with direct DB insert — this needs rate limiting or CAPTCHA.

4. `messages.service.ts` → `searchMessages` has a typo in the filter: `.or("Messagename.ilike...")` — column `Messagename` does not exist (should be `name` or similar). This query will always return empty results or throw an error silently.

### Scalability Assessment

**Will break at scale:**

- `views` as a single integer counter will have write contention with concurrent view increments (Postgres row lock per article). At high traffic, this becomes a bottleneck. Use a separate `article_views_log` table or batched counter updates.
- `follows` table has no index inferred (no schema file) — `getFollowerCount` does a full count scan on `following_id`. Needs index on `(following_id)` and `(follower_id)`.
- `article_likes` count is fetched via Supabase embedded aggregate every time an article is displayed — no denormalized counter. At list scale (15 articles × N likes), this is fine now but needs a `likes_count` denormalized column + trigger at scale.
- `getMonthlyTraffic` loads all articles for a month and sums `views` in application code — should be a DB aggregation query.
- Tags fetch `getAllTags()` with `select("*")` and no limit — if tags grow to thousands, this becomes a problem.

---

## 4. Performance Audit

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | `getCachedArticleBySlug` creates `unstable_cache` wrapper **inside** the function call — new wrapper created every render, defeating the cache | **Critical** | Move `unstable_cache` to module level, not inside a wrapping function |
| 2 | `getCachedArticleBySlug` uses browser Supabase client server-side | **Critical** | Replace `createPublishClient` with server `createClient` |
| 3 | `getUserByUsername` called in both layout AND page for same `[username]` route — 2 identical DB queries | **High** | Wrap `getUserByUsername` in `React.cache()` |
| 4 | `useFollowStats` fires 2 separate server action HTTP calls on mount | **High** | Merge into single `getFollowStats(userId)` returning both counts |
| 5 | `is_liked` detection fetches all `user_id` rows from `article_likes` per article — N rows returned per article per user | **High** | Use a filtered join `.eq("article_likes.user_id", userId)` or a separate existence check |
| 6 | `getMonthlyTraffic` loads all article rows to sum views in JS — no DB aggregation | **High** | Use `SUM(views)` GROUP BY day via Postgres function or RPC |
| 7 | Dashboard metrics: 4 separate Supabase queries (even with `Promise.all`) — should be 1 RPC | **Medium** | Create `get_dashboard_metrics(user_id)` Postgres function |
| 8 | Comment section loaded via client-side server action after RSC render — waterfall | **Medium** | Fetch initial comments server-side, hydrate to client |
| 9 | `getAllTags()` has no limit — `select("*")` on tags table | **Medium** | Add `.limit(100)` or implement search-based tag fetching |
| 10 | `increaseView` called with `void` in RSC render path — untracked side effect | **Medium** | Move to client useEffect after hydration, or use a background queue |
| 11 | `sitemap.ts` only includes 15 articles | **Low** | Implement paginated sitemap or sitemap index |
| 12 | `getArticles` in homepage: hardcoded `.limit(15)`, no pagination | **Low** | Implement cursor-based or offset pagination |

---

## 5. Frontend Architecture

### Server vs Client Component Usage

Generally correct split. RSC used for data-heavy pages (profile, article detail, home, search). Client components for interactive UI (editor, modals, likes, comments).

**Anti-pattern:** Editor page (`[id]/page.tsx`) is a full Client Component that calls `getArticleAction` (a Server Action) in a `useEffect` on mount. This means:
1. User sees loading spinner
2. Client fires HTTP POST to server action
3. Data loads

This is identical behavior to a `useEffect + fetch` waterfall that RSC was designed to eliminate. The editor page should be a RSC that pre-fetches the article server-side and passes it as initial props to an `ArticleEditorClient` component.

**Anti-pattern:** `useEffect` in editor re-fires when `loading` (from `useAuth`) changes:
```ts
useEffect(() => {
    if (id) { getArticleAction(Number(id))... }
}, [id, loading]); // ← 'loading' dependency causes re-fetch when auth state resolves
```
This causes the article to load twice on mount if auth state changes after initial render.

### State Management

Global state is minimal (AuthProvider + ModalProvider). This is appropriate for the app's current scope. No Zustand/Redux needed yet.

**Problem:** ModalProvider only handles a single `open` boolean. When more modals are needed (login modal, delete confirm, image lightbox, etc.), this will be completely refactored. Should at minimum be a string-typed modal identifier: `open: string | null`.

### Hooks Design

`useFollowStats` — clean implementation with `mounted` flag to prevent state updates after unmount. Good pattern.

`useFileUpload` — the `uploadToR2` helper is exported and catches errors silently (shows toast but swallows the error without re-throwing):
```ts
} catch (e: any) {
    toast.error(`Error: ${e.message}`);
    // ← no throw, caller thinks upload succeeded
}
```
The calling `uploadFile` function would continue after `uploadToR2` throws (since catch swallows it) and proceed to construct a `fileUrl` from an undefined/incomplete key. Silent failures in file upload are severe UX bugs.

### Loading & UX

- No skeleton loading — only a `<Loading />` spinner component. For content-heavy pages, this causes significant layout shift.
- No optimistic updates on like/follow — UI waits for server round trip, which feels slow.
- Editor has a working `isChanged` dirty-check to disable Save button — this is good.
- No auto-save in editor — losing work on accidental navigation is a real risk.
- Inline `<style>` tag injected in ArticlePage for responsive breakpoints — this is an anti-pattern. Use Tailwind responsive classes or CSS modules.

---

## 6. Security Review

### Critical Issues

**1. updateArticle — Authorization Bypass (Critical)**
No `user_id` ownership check in the SQL query. Relies entirely on RLS. If RLS is misconfigured or disabled for that table/policy, any authenticated user can overwrite any article. The service layer must **always** enforce ownership in the query itself as defense-in-depth.

**2. deleteComment — Authorization Bypass (Critical)**
Same as above. No `user_id` filter on the soft-delete query.

**3. contact.user.service.ts — Client-Side with Anon Key (High)**
Uses browser Supabase client (anon key) to insert into `contact_requests` with only JS-side validation. No rate limiting, no server-side validation, no CAPTCHA. Easily spammable with any HTTP client bypassing the JS validation entirely.

**4. searchMessages — SQL Typo Creates Silent Data Leak Risk (Medium)**
```ts
.or(`Messagename.ilike.%${keyword}%,email.ilike.%${keyword}%,display_name.ilike.%${keyword}%`)
```
`Messagename` is not a real column. Supabase/PostgREST will silently ignore invalid column filters in some configurations, potentially returning unfiltered data (all messages). This should be tested and fixed immediately.

**5. auth.service.ts uses browser client for signIn/signUp (High)**
If these are called server-side, they use anon key without cookie-based session management, creating authentication flow inconsistencies.

**6. R2 fileKey constructed client-side (Medium)**
```ts
const fileUrl = R2_CONFIG.publicUrl 
    ? `${R2_CONFIG.publicUrl}/${fileKey}`
    : `https://${process.env.R2_ACCOUNT_ID}.r2...`
```
`process.env.R2_ACCOUNT_ID` in a client hook will be `undefined` unless prefixed with `NEXT_PUBLIC_`. If it falls to the second branch, the URL is broken silently.

### What's Done Right

- `getAuthUser()` helper called consistently in author service functions
- Server Actions all use server-side Supabase client (where correctly used)
- `getUser()` wrapped in `React.cache()` prevents repeated auth calls within a request
- Soft deletes used throughout (auditable data)
- `deleteArticleById` has proper ownership verification before soft-delete — **this is the correct pattern** that's inconsistently applied elsewhere

---

## 7. Product Evaluation

### Rating: **Early Product**

Not MVP (too many features exist), not Production Ready (too many bugs and architectural flaws).

### What Works Well (as a product)
- Core reading experience: article pages, author profiles, search — functional
- Markdown editor with preview — functional
- Image upload to R2 — functional (with the silent-failure bug)
- Dark theme / Noir aesthetic — consistent and polished
- SEO metadata generation (generateMetadata) — comprehensive

### What Doesn't Work (Product-Breaking Bugs)
- **Tags on articles are completely broken** — not saved on create or update
- **Any authenticated user can edit/delete any article** (missing ownership SQL filter — depends entirely on RLS)
- **Comment delete has no ownership check**
- **Dashboard traffic chart shows wrong data** (article creation date, not view date)
- **Silent upload failure** in R2 upload hook

### Missing Features vs Production Social/Blog Platform

| Feature | Status |
|---|---|
| OAuth login (Google/GitHub) | ❌ Missing |
| Email verification | ❌ No UI |
| Password reset | ❌ No UI |
| Pagination on article lists | ❌ Hardcoded limit 15 |
| Comment likes | ❌ Type defined, not implemented |
| Followers/Following list pages | ❌ Missing |
| Follow feed (articles from followed users) | ❌ Missing |
| Notifications | ❌ Missing |
| Article scheduling | ❌ Missing |
| Bookmarks/Reading list | ❌ Missing |
| Real-time comments (Realtime subscriptions) | ❌ Missing |
| Admin panel | ⚠️ Partial (contacts admin service exists) |
| Report/flag content | ❌ Missing |
| Article series/collections | ❌ Missing |
| Auto-save in editor | ❌ Missing |

---

## 8. Roadmap

### Phase 1 — Quick Fixes (1–2 weeks)

1. **Fix `updateArticle` and `deleteComment` to include `user_id` ownership filter** — this is a one-line fix per function, critical security patch.

2. **Fix `getCachedArticleBySlug`** — move `unstable_cache` to module level, replace browser client with server client.

3. **Fix tag persistence** — uncomment and complete tag insertion in `createArticle`, add tag update logic (delete existing, re-insert) in `updateArticle`.

4. **Fix `uploadToR2` silent failure** — re-throw the error so the caller can handle it properly.

5. **Wrap `getUserByUsername` in `React.cache()`** — eliminate duplicate DB call in layout + page.

6. **Fix `searchMessages` column typo** (`Messagename` → `name` or correct column).

7. **Move `increaseView` to client-side `useEffect`** — remove the `void` fire-and-forget from RSC.

8. **Fix `AuthProvider` useEffect dependency** — change `[initialProfile]` to `[]`.

9. **Fix OG canonical URL** in article page metadata to include `[username]` segment.

### Phase 2 — Architecture Improvements (2–6 weeks)

1. **Refactor editor page to RSC + Client split** — pre-fetch article server-side, pass as `initialArticle` prop to `ArticleEditorClient`. Eliminates the useEffect data-fetch waterfall.

2. **Merge follow stats into a single server call** — `getFollowStats(userId)` returns `{ followerCount, followingCount }` in one query.

3. **Atomic like/follow toggle** — implement upsert pattern with DB unique constraint or Postgres `INSERT ... ON CONFLICT DO DELETE` for toggle atomicity.

4. **Fetch initial comments server-side** — pass as `initialComments` to `CommentSection`, use server actions only for mutations.

5. **Upgrade `ModalProvider`** — support named modals: `open: string | null` with `openModal(name)` / `closeModal()`.

6. **Replace `getMonthlyTraffic` with a Postgres RPC** — `get_monthly_traffic(user_id, month)` that returns aggregated day/views data server-side.

7. **Move contact form to a Server Action** — remove browser client + client-side validation only. Validate server-side, add rate limiting.

8. **Add `React.cache()` or `unstable_cache` to `getArticlesByUsername`** — it's wrapped in `cache()` but still makes 2 queries (user by username, then articles). Consider a join.

9. **Fix `getMonthlyTraffic`** — create a proper `article_views_log (article_id, viewed_at)` table and track views there rather than as a counter.

### Phase 3 — Scale-Ready Design (2–3 months)

1. **Pagination** — implement cursor-based pagination on article lists (home, profile, search). Current `limit(15)` is not acceptable for production.

2. **Denormalized counters** — add `likes_count`, `comments_count`, `followers_count` columns with DB triggers to maintain them. Eliminates aggregate subqueries on every list render.

3. **Search upgrade** — replace `ILIKE` search with Postgres full-text search (`tsvector/tsquery`) or integrate Meilisearch/Typesense for proper search.

4. **Sitemap index** — implement `/sitemap/[page].xml` pattern for large article sets. Current 15-article sitemap is SEO-ineffective.

5. **Real-time features** — Supabase Realtime subscriptions for comment count updates, like counts. This significantly improves perceived responsiveness.

6. **Caching strategy** — implement proper `next/cache` tagging: `revalidateTag('article-${slug}')` on publish/update. Currently caching is ad-hoc.

7. **Rate limiting** — add rate limiting on contact form, comment creation, like toggle (e.g., Upstash Redis rate limiter in middleware).

8. **View tracking overhaul** — replace integer counter with time-series event log. Enable real analytics dashboard with actual traffic patterns.

9. **Image optimization** — replace `<img>` tags with Next.js `<Image>` component for automatic WebP conversion, lazy loading, and layout shift prevention.

10. **OAuth integration** — add Google/GitHub OAuth via Supabase Auth providers. Email+password only is a significant conversion barrier.

---

*Report generated from codebase analysis of: `(user)/` pages · `hooks/` · `server/` · `providers/` · `sitemap.ts` · `types/index.ts`*
