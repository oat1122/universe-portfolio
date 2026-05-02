````markdown
# STACK.md

> Stack reference for **Universe Portfolio** project.
> Read this before suggesting any package, command, or architectural decision.

---

## 0. Project Context

- **Type:** Personal portfolio + blog with 3D universe scene + admin dashboard + AI features
- **Architecture:** Feature-based / Modular (see `ARCHITECTURE.md`)
- **Package manager:** **npm** (already initialized, do NOT switch to pnpm/yarn)
- **Deployment target:** Vercel (frontend + API) + Supabase Cloud (database)
- **Owner skill level:** Beginner — prefer well-documented, mainstream choices over cutting-edge
- **Last reconciled:** 2026-05-02 — actual installed stack: Next 16, React 19, Tailwind v4, Biome (single-tool replaces ESLint/Prettier)

---

## 1. Frontend Core

| Package                       | Version  | Purpose                                                   |
| ----------------------------- | -------- | --------------------------------------------------------- |
| `next`                        | `^16`    | Framework (App Router, Server Components, Server Actions) |
| `react` / `react-dom`         | `^19`    | UI library (React Compiler enabled via Next config)       |
| `typescript`                  | `^5`     | Type safety — use `strict: true`                          |
| `tailwindcss`                 | `^4`     | Styling — v4 baseline (PostCSS plugin)                    |
| `@tailwindcss/postcss`        | `^4`     | Tailwind v4 PostCSS adapter                               |
| `babel-plugin-react-compiler` | `^1`     | Required while React Compiler is enabled in `next.config` |

**Rationale:** Next 16 + React 19 + Tailwind v4 reflect the actual installed baseline (reconciled 2026-05). shadcn now supports Tailwind v4 — no extra config workaround needed.

---

## 2. UI Components

| Package                    | Purpose                                             |
| -------------------------- | --------------------------------------------------- |
| `shadcn/ui`                | Component system — **copy-paste, not a dependency** |
| `lucide-react`             | Icon set used by shadcn                             |
| `class-variance-authority` | Variant management (shadcn dependency)              |
| `clsx` + `tailwind-merge`  | className utilities                                 |

**Setup:** `npx shadcn@latest init` (when first UI work begins) — add components on demand with `npx shadcn@latest add <component>`. Use the v4-compatible registry — no Tailwind v3 fallback needed.

**Rule:** Do NOT install component libraries like MUI, Chakra, Mantine. shadcn only.

---

## 3. 3D Scene

| Package                       | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `three`                       | 3D engine                                        |
| `@react-three/fiber`          | React renderer for Three.js                      |
| `@react-three/drei`           | Helpers (OrbitControls, useTexture, Stars, etc.) |
| `@react-three/postprocessing` | Bloom, glow, chromatic aberration                |
| `@types/three`                | TS types (dev dependency)                        |

**Install:**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install -D @types/three
```

**Critical rule:** Three.js cannot SSR. Always import 3D components with `next/dynamic` and `ssr: false`. Place all 3D code under `components/three/`.

---

## 4. Animation

| Package         | Purpose                   | When to use                                          |
| --------------- | ------------------------- | ---------------------------------------------------- |
| `framer-motion` | Component-level animation | Hover, page transitions, layout animations           |
| `gsap`          | Timeline-based animation  | Complex sequences, ScrollTrigger, scene choreography |
| `lenis`         | Smooth scroll             | Required for scroll-driven 3D                        |

**Rule:** Don't use both Framer Motion and GSAP for the same effect. Pick one per use case.

**GSAP gotcha:** ScrollTrigger plugin must be registered inside `useEffect`, not at module top level (breaks SSR).

---

## 5. Content / MDX

| Package                    | Purpose                                             |
| -------------------------- | --------------------------------------------------- |
| `next-mdx-remote`          | Render MDX from string (preferred over `@next/mdx`) |
| `shiki`                    | Syntax highlighting (modern replacement for Prism)  |
| `remark-gfm`               | GitHub Flavored Markdown                            |
| `rehype-slug`              | Auto-generate heading IDs                           |
| `rehype-autolink-headings` | Anchor links on headings                            |

**Why `next-mdx-remote` not `@next/mdx`:** can load MDX content from database (admin can write blog posts) — `@next/mdx` only loads from filesystem.

---

## 6. Forms & Validation

| Package               | Purpose               |
| --------------------- | --------------------- |
| `react-hook-form`     | Form state management |
| `zod`                 | Schema validation     |
| `@hookform/resolvers` | Bridge RHF ↔ Zod      |

**Pattern:** Define Zod schema in `modules/<feature>/<feature>.dto.ts`. Import on both frontend (form validation) AND backend (request validation). One source of truth.

---

## 7. Data Fetching

**No Axios.** Use these instead:

| Tool                                   | Use case                                              |
| -------------------------------------- | ----------------------------------------------------- |
| **Server Components + native `fetch`** | Read data on initial render                           |
| **Server Actions**                     | Mutations from forms (create/update/delete)           |
| `@tanstack/react-query`                | Client-side: realtime updates, polling, optimistic UI |

**Decision tree:**

- Static-ish data on page load → Server Component + `fetch`
- Form submission → Server Action
- Live counter, comment list, search-as-you-type → TanStack Query
- AI streaming → native `fetch` + `ReadableStream`

**Do NOT install:** `axios`, `swr` (TanStack Query is enough), Redux, Zustand.

---

## 8. Database

| Package       | Purpose                                     |
| ------------- | ------------------------------------------- |
| `drizzle-orm` | ORM (runtime)                               |
| `drizzle-kit` | CLI for migrations (dev dependency)         |
| `postgres`    | Postgres driver (the `postgres.js` package) |

**Install:**

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

**Config file:** `drizzle.config.ts` at project root.

**Schema location:** Each module owns its schema (`modules/<feature>/<feature>.schema.ts`). Re-export all from `infrastructure/db/index.ts` so drizzle-kit can find them.

**Migration commands** (drizzle-kit ≥ 0.30 — no `:postgres` suffix):

```bash
npm run db:generate    # drizzle-kit generate
npm run db:migrate     # drizzle-kit migrate
npm run db:studio      # drizzle-kit studio
```

(Already in `package.json` scripts.)

---

## 9. Auth & Backend Services

| Package                 | Purpose                     |
| ----------------------- | --------------------------- |
| `@supabase/supabase-js` | Supabase client             |
| `@supabase/ssr`         | SSR-safe client for Next.js |

**Auth strategy:**

- Use Supabase Auth, NOT NextAuth/Auth.js
- Email/password + magic link
- Session refresh handled in `middleware.ts`
- Auth wrapper lives in `modules/auth/`

**Critical rule:** Do NOT create a `users` table that conflicts with Supabase's `auth.users`. Create a separate `profiles` table that references `auth.users.id`.

---

## 10. AI Integration

| Package             | Purpose           |
| ------------------- | ----------------- |
| `@anthropic-ai/sdk` | Claude API client |

**Use cases in this project:**

- Auto-summarize blog posts
- Generate tags from content
- (Future) Chat with portfolio assistant

**Location:** `modules/ai/providers/claude.provider.ts`. All prompts in `modules/ai/ai.prompts.ts`.

**Streaming:** AI responses must stream — use API Route (NOT Server Action) with `ReadableStream`.

---

## 11. Email & Notifications

| Package       | Purpose                          |
| ------------- | -------------------------------- |
| `resend`      | Transactional email              |
| `react-email` | Build email templates with React |

**Use case:** Notify admin when someone comments on a post.

---

## 12. Analytics

| Package                  | Purpose                       |
| ------------------------ | ----------------------------- |
| `@vercel/analytics`      | Page views + Web Vitals       |
| `@vercel/speed-insights` | Real user performance metrics |

**Both are free on Vercel hobby tier.**

---

## 13. Dev Tools

| Package                  | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `@biomejs/biome`         | Lint + format + organize-imports (single-tool replacement) |
| `husky`                  | Git hooks                                                  |
| `lint-staged`            | Run Biome on staged files only                             |
| `vitest`                 | Unit tests                                                 |
| `@testing-library/react` | Component tests                                            |
| `playwright`             | E2E tests                                                  |

**Install dev dependencies (when each is needed):**

```bash
# already installed: @biomejs/biome
npm install -D husky lint-staged
# later:
npm install -D vitest @testing-library/react @testing-library/jest-dom playwright
```

**Why Biome (not ESLint + Prettier):** one binary, one config (`biome.json`), faster CI, native organize-imports. Trade-off: smaller plugin ecosystem — acceptable since `next-on-biome` rules cover Next/React essentials.

---

## 14. Environment Variables

Required in `.env.local` (NEVER commit):

```bash
# Database
DATABASE_URL=                          # Supabase Postgres connection string

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=             # server-only, never expose

# AI
ANTHROPIC_API_KEY=

# Email
RESEND_API_KEY=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Validation:** Parse with Zod in `config/env.ts`. Crash on startup if missing.

Maintain `.env.example` (committed) with same keys but empty values.

---

## 15. DO NOT Install

| Package                           | Reason                                                 |
| --------------------------------- | ------------------------------------------------------ |
| `axios`                           | `fetch` does everything Axios does in 2026             |
| `prisma`                          | Drizzle is faster, edge-compatible, simpler migrations |
| `next-auth` / `@auth/core`        | Supabase Auth is enough                                |
| `redux`, `zustand`, `jotai`       | Server Components + TanStack Query covers state        |
| `styled-components`, `@emotion/*` | Tailwind only                                          |
| `moment`                          | Use `date-fns` or native `Intl`                        |
| `lodash`                          | Native ES2024+ has equivalents                         |
| `@next/mdx`                       | Use `next-mdx-remote` instead (more flexible)          |
| `swr`                             | TanStack Query is the choice                           |
| `tailwindcss@3`                   | v4 is the baseline (see section 1)                     |
| `eslint`, `eslint-config-*`       | Biome is the linter — do not mix                       |
| `prettier`, `prettier-plugin-*`   | Biome handles formatting — do not mix                  |

---

## 16. Naming & File Conventions

- File names: **kebab-case** (`posts.controller.ts`, not `PostsController.ts`)
- Module folder names: **kebab-case**, plural where it makes sense (`posts/`, `comments/`, `auth/`)
- Inside module: `<module>.<layer>.ts` (`posts.service.ts`, `posts.repository.ts`)
- React components: **PascalCase** (`PostCard.tsx`)
- Hooks: `use-` prefix, kebab-case (`use-realtime-views.ts`)
- Server Actions: explicit `"use server"` directive at top

---

## 17. Critical Gotchas

1. **Three.js needs `ssr: false`** — wrap in `dynamic(() => import(...), { ssr: false })`
2. **Drizzle migrations:** always `db:generate` after schema change, then `db:migrate`
3. **Supabase RLS:** enable Row Level Security on all tables. Default-deny.
4. **Server Actions need form revalidation** — call `revalidatePath()` after mutations
5. **`NEXT_PUBLIC_*` env vars are exposed to browser** — never put secrets there
6. **`postgres.js` driver** has different connection options than `pg` — use Drizzle's docs for Supabase setup
7. **Vercel function timeout** is 10s on hobby — AI streaming must use Edge Runtime or upgrade plan

---

## 18. Reference Documentation

When in doubt, check these (in priority order):

- Next.js: https://nextjs.org/docs
- Drizzle: https://orm.drizzle.team/docs
- Supabase + Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- shadcn/ui: https://ui.shadcn.com
- TanStack Query: https://tanstack.com/query/latest

---

## 19. When Adding New Dependencies

Before `npm install` anything not in this list:

1. Check if it duplicates something already here
2. Check if a native API or built-in solves it
3. Check bundle size on https://bundlephobia.com
4. If still needed, add to this file under the right section
````
