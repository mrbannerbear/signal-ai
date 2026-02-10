# Signal AI — Full Application Evaluation

## Overall Rating: **6.2 / 10**

| Category | Score | Grade |
|---|---|---|
| **Architecture & Structure** | 7.5/10 | B |
| **Security** | 4.5/10 | D+ |
| **Performance** | 5.5/10 | C |
| **Code Quality** | 7/10 | B- |
| **Error Handling** | 6.5/10 | C+ |
| **Accessibility** | 4/10 | D |
| **Data Integrity** | 5.5/10 | C |
| **UX Completeness** | 6.5/10 | C+ |

---

## CRITICAL (Fix Immediately)

### 1. Middleware is never executed
The auth-guard file is named proxy.ts but Next.js requires it to be named `middleware.ts` at the project root. **Your entire auth protection layer (route guards, session refresh) is not running.** Any user can access `/dashboard/*` routes without authentication.

### 2. No middleware.ts = no session refresh
Because the middleware never runs, Supabase auth cookies are never refreshed via `updateSession()`. Users will get silently logged out when their JWT expires, losing in-progress work.

### 3. Service role key pattern risk
service.ts creates a Supabase client with the service role key (bypasses all RLS). While it's not currently imported in any server action (good), the file exists and could be accidentally used. Consider adding a lint rule or deleting it if unused.

### 4. Gemini API key fallback to empty string
Three files use `process.env.GEMINI_API_KEY || ""` (jobFormat.ts, resume.ts, insights.ts). If the env var is missing, the API call will proceed with an empty key, producing a confusing authentication error instead of failing fast. Only analysis.ts correctly throws early when the key is missing.

---

## HIGH SEVERITY

### 5. Missing database indexes — RLS scans every row
No indexes on `jobs.user_id`, `profiles.user_id`, `experience.profile_id`, or `education.profile_id`. Every RLS policy does `auth.uid() = user_id`, which without an index performs a **full table scan** on every query. Performance degrades linearly with data growth.

### 6. `profiles.user_id` is nullable and has no UNIQUE constraint
The profiles migration doesn't enforce `NOT NULL` or `UNIQUE` on `user_id`. This means:
- Profiles can exist without an owner
- A user can have multiple profiles (the app assumes one via `.single()`, which will throw on duplicates)

### 7. `analyzeJob` doesn't verify job ownership
analysis.ts fetches the job by ID without filtering by `user_id`. While RLS should prevent cross-user access, the action itself doesn't validate ownership. If RLS is misconfigured (or bypassed), any user could analyze any job.

### 8. `getAllJobs` doesn't filter by user
jobs.ts uses `select("*")` without `.eq("user_id", user.id)`. It relies entirely on RLS for user scoping. This is intentional with Supabase but means if RLS is ever disabled for debugging, all users' jobs leak.

### 9. Keyboard inaccessibility
`JobCard` components are clickable `<div>` elements without `role="button"`, `tabIndex`, or `onKeyDown` handlers. Custom modals in `DangerZone` and `JobDetailClient` lack focus trapping, `role="dialog"`, and escape-to-close functionality.

### 10. Sequential data fetching waterfalls
dashboard/page.tsx and job detail page make sequential `await` calls that could be parallelized with `Promise.all`, adding unnecessary latency.

---

## MEDIUM SEVERITY

### 11. `deleteAccount` doesn't delete user from Supabase Auth
account.ts deletes data from tables (`analysis_results`, `jobs`, `resumes`, `profiles`) and signs out, but **never calls `supabase.auth.admin.deleteUser()`**. The auth record persists, and the user could sign back in to an empty account.

### 12. `resume.schema.ts` is too permissive
All fields accept empty strings with no `.min()` constraints, no URL validation on `portfolioUrl`/`linkedinUrl`, and no skill structure validation. This is significantly weaker than `profileSchema` which validates the same conceptual data.

### 13. Schema-DB mismatches
- `analysisSchema` includes `updated_at` but the DB `analysis` table has no such column
- `profileSchema` is missing `field_of_study` that exists in the `education` DB table
- `risk_level` is `TEXT` in the DB but validated as an enum in Zod — no DB-level constraint

### 14. `sessionStorage` for cross-page state
JobsGrid.tsx and JobDetailActionButtons.tsx use `sessionStorage` to pass `analysisMode` between pages. This breaks in new tabs, browser history navigation, and SSR. URL search params would be more robust.

### 15. `error.tsx` renders raw `error.message`
error.tsx renders `error.message` directly to the user. If the error contains internal system details (SQL errors, stack traces, API keys), they leak to the client.

### 16. Bundle size — un-lazy-loaded heavy libraries
`framer-motion` (~30-40KB) and `recharts` (~200KB) are eagerly loaded. Charts only render when analyses exist, so they should use `next/dynamic` with `ssr: false`.

### 17. Profile update uses delete-and-reinsert
profiles.ts deletes all experience and education records, then re-inserts them. This destroys record IDs on every save, breaks any foreign key references, and creates a window where data doesn't exist if the insert fails.

### 18. No `updated_at` triggers
Only `user_insights` has an auto-updating `updated_at` trigger. `jobs`, `profiles`, and `analysis` tables have no way to track when records were last modified.

### 19. Open redirect potential in auth callback
route.ts reads `next` from query params: `searchParams.get('next') ?? '/dashboard'`. A malicious link could set `next` to an external URL. Should validate that `next` starts with `/`.

---

## LOW SEVERITY

### 20. Mixed Zod API styles
`z.email()` vs `z.string().email()` across schemas — inconsistent but functional.

### 21. No password max-length
Auth and account schemas have no `.max()` on password fields — allows arbitrarily long strings.

### 22. `useEffect` fires analysis on mount
`JobDetailActionButtons` auto-fires `analyzeJob` from a `useEffect` based on `sessionStorage`, which can duplicate calls if the component re-mounts.

### 23. `mapToDb` uses `any` types
mapToDb.ts disables TypeScript completely with `eslint-disable @typescript-eslint/no-explicit-any`. A typo in a field name would silently produce `undefined`.

### 24. File hash is not content-based
parseResume.ts generates hashes from `name + size + lastModified` rather than file contents. Renaming a file or modifying its metadata produces a different hash for identical content.

### 25. `alert()` usage
`ResumeParser` uses `alert()` for resume validation errors — should use a toast.

### 26. Redundant DB index
`user_insights.user_id` has both a `UNIQUE` constraint (which creates an implicit index) and an explicit index.

---

## What's Done Well

- **Server-first architecture**: Proper use of Next.js App Router with server components for data fetching and client components only where interactivity is needed
- **Zod validation on all server actions**: Every mutation validates input before touching the database
- **AI retry logic with exponential backoff**: analysis.ts properly retries failed AI calls
- **Input sanitization for AI prompts**: The `sanitizeInput()` function strips template injection markers
- **Resume rate limiting**: 5 parses per hour per user with DB-backed tracking
- **Resume content caching**: Hash-based deduplication prevents redundant AI calls
- **RLS on most tables**: Jobs, profiles, resumes, user_insights all have proper row-level security
- **Auth callback properly exchanges code for session**: No PKCE bypass
- **Clean separation of concerns**: Schemas, actions, components, and utilities are well-organized
- **Error boundaries**: Both per-route and global error boundaries exist
- **Profile ownership verification**: `updateProfileAction` checks `profile.user_id !== user.id`
- **Insights hash diffing**: `regenerateInsights` skips regeneration if data hasn't changed — smart cost optimization

---

## Priority Action Items

1. **Rename** proxy.ts **to** `middleware.ts` — this single fix restores your entire auth protection layer
2. **Add database indexes** on `user_id` and `profile_id` foreign key columns
3. **Add `NOT NULL` + `UNIQUE` constraint** on `profiles.user_id`
4. **Fix Gemini API key handling** — throw early instead of defaulting to `""` 
5. **Validate `next` param** in auth callback to prevent open redirects
6. **Implement `deleteUser` in auth admin** for account deletion
7. **Parallelize independent data-fetching** calls with `Promise.all`
8. **Lazy-load `recharts` and `framer-motion`** with `next/dynamic`
9. **Add keyboard accessibility** to interactive card and modal components