# 🏛 Architecture — Universe Portfolio

> **Pattern:** Feature-based / Modular Architecture (NestJS-style)
> **Stack:** Next.js 16 (App Router) + Drizzle ORM + Supabase (Postgres + Auth + Storage)
> **ปรัชญา:** จัดโค้ดตาม **feature** ไม่ใช่ตาม layer — โฟลเดอร์ = 1 feature ที่ครบทุกชั้น

---

## 📑 สารบัญ

1. [ทำไมเลือก pattern นี้](#1-ทำไมเลือก-pattern-นี้)
2. [โครงสร้างโปรเจคเต็ม](#2-โครงสร้างโปรเจคเต็ม)
3. [หน้าที่ของแต่ละชั้นใน Module](#3-หน้าที่ของแต่ละชั้นใน-module)
4. [กฎเหล็ก 3 ข้อ](#4-กฎเหล็ก-3-ข้อ)
5. [Naming Conventions](#5-naming-conventions)
6. [Flow ตัวอย่าง: ดึงบทความเดี่ยว](#6-flow-ตัวอย่าง-ดึงบทความเดี่ยว)
7. [วิธีเพิ่ม Module ใหม่](#7-วิธีเพิ่ม-module-ใหม่)
8. [Server Action vs API Route](#8-server-action-vs-api-route)
9. [Error Handling](#9-error-handling)
10. [Testing Strategy](#10-testing-strategy)

---

## 1. ทำไมเลือก pattern นี้

| ข้อดี                          | คำอธิบาย                                               |
| ------------------------------ | ------------------------------------------------------ |
| 🎯 หา code ง่าย                | ทุกอย่างของ feature อยู่โฟลเดอร์เดียว                  |
| 🗑 ลบ feature ง่าย             | ลบโฟลเดอร์เดียวจบ ไม่ต้องไล่ลบทุกชั้น                  |
| 👥 ทำงานเป็นทีมไม่ชนกัน        | คนละ module ไม่แก้ไฟล์เดียวกัน                         |
| 🔌 ย้ายไปใช้ framework อื่นได้ | Module ไม่ผูกกับ Next.js — ย้ายไป Fastify/NestJS ได้   |
| 📈 Scale ได้                   | เพิ่ม feature ใหม่ = สร้างโฟลเดอร์ใหม่ ไม่กระทบของเก่า |
| 🧪 Test ง่าย                   | Mock ใน module เดียว ไม่ต้องข้ามโฟลเดอร์               |

**Trade-off ที่ยอมรับได้:** Boilerplate ต่อ feature เยอะกว่า (6-7 ไฟล์) แต่แลกกับความยืดหยุ่นระยะยาว

---

## 2. โครงสร้างโปรเจคเต็ม

```
src/
├── app/                              ← Next.js App Router (thin layer)
│   ├── (public)/
│   │   ├── page.tsx                  ← Universe scene
│   │   ├── about/page.tsx
│   │   ├── projects/[slug]/page.tsx
│   │   └── blog/[slug]/page.tsx
│   ├── admin/                        ← URL prefix: /admin/* (not a route group — must be visible in URL)
│   │   ├── layout.tsx                ← auth guard via requireAdmin()
│   │   ├── dashboard/page.tsx        ← /admin/dashboard
│   │   └── posts/[id]/edit/page.tsx  ← /admin/posts/[id]/edit
│   ├── api/                          ← เรียก controller ของแต่ละ module
│   │   ├── posts/[id]/route.ts
│   │   ├── comments/route.ts
│   │   └── ai/summarize/route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── config/
│   ├── env.ts                        ← parse + validate env (Zod)
│   └── constants.ts
│
├── infrastructure/                   ← external services / DB connection
│   ├── db/
│   │   ├── client.ts                 ← Drizzle client
│   │   └── index.ts                  ← re-export schema จากทุก module
│   ├── supabase/
│   │   ├── server.ts                 ← server-side client
│   │   └── client.ts                 ← browser client
│   └── storage/
│       └── upload.ts
│
├── modules/                          ⭐ หัวใจของระบบ
│   │
│   ├── posts/                        ← Blog posts
│   │   ├── posts.controller.ts       ← HTTP handler
│   │   ├── posts.service.ts          ← business logic
│   │   ├── posts.repository.ts       ← Drizzle queries
│   │   ├── posts.schema.ts           ← Drizzle table
│   │   ├── posts.dto.ts              ← Zod input validators
│   │   ├── posts.types.ts            ← TS types ของ feature
│   │   ├── posts.actions.ts          ← Server Actions (สำหรับ admin form)
│   │   └── index.ts                  ← public API ของ module
│   │
│   ├── projects/                     ← Portfolio projects (ดาวเคราะห์)
│   │   └── (โครงสร้างเดียวกับ posts)
│   │
│   ├── comments/
│   │   └── ...
│   │
│   ├── ai/                           ← Claude integration
│   │   ├── providers/
│   │   │   └── claude.provider.ts
│   │   ├── ai.service.ts
│   │   ├── ai.prompts.ts
│   │   ├── ai.types.ts
│   │   └── index.ts
│   │
│   ├── auth/
│   │   ├── auth.service.ts           ← wrap Supabase Auth
│   │   ├── auth.guard.ts             ← เช็ค session
│   │   ├── auth.types.ts
│   │   └── index.ts
│   │
│   └── analytics/
│       ├── analytics.service.ts
│       ├── analytics.repository.ts
│       └── index.ts
│
├── shared/                           ← ใช้ร่วมข้าม module (ไม่ผูกกับ feature ใด)
│   ├── errors/
│   │   ├── app-error.ts              ← AppError base class
│   │   └── domain-errors.ts          ← NotFoundError, ForbiddenError, ...
│   ├── lib/
│   │   ├── api-response.ts           ← ok(), notFound(), fail()
│   │   ├── error-handler.ts          ← catch + map → HTTP status
│   │   └── logger.ts
│   └── utils/
│       ├── slug.ts
│       └── date.ts
│
├── components/                       ← UI components (FE)
│   ├── ui/                           ← shadcn/ui
│   ├── three/                        ← 3D scene
│   ├── blog/
│   ├── admin/
│   └── shared/
│
├── hooks/                            ← React hooks
├── types/
│   └── global.d.ts
└── proxy.ts                          ← Next 16 proxy (refresh session — was middleware.ts)
```

---

## 3. หน้าที่ของแต่ละชั้นใน Module

### 📌 `*.controller.ts` — HTTP Handler

**หน้าที่:**

- Parse request (body, params, query)
- เรียก DTO validate
- เรียก service
- Map error → HTTP status
- Format response

**ห้ามทำ:**

- ❌ ห้ามมี business logic
- ❌ ห้าม query DB ตรง
- ❌ ห้ามรู้จัก Drizzle / Supabase

```typescript
// modules/posts/posts.controller.ts
import { postsService } from "./posts.service";
import { createPostDto } from "./posts.dto";
import { ok, badRequest, handleError } from "@/shared/lib/api-response";

export const postsController = {
  async getById(id: string) {
    try {
      const post = await postsService.getPublishedPost(id);
      return ok(post);
    } catch (e) {
      return handleError(e);
    }
  },

  async create(req: Request) {
    const body = await req.json();
    const parsed = createPostDto.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error);

    try {
      const post = await postsService.create(parsed.data);
      return ok(post, 201);
    } catch (e) {
      return handleError(e);
    }
  },
};
```

---

### 🧠 `*.service.ts` — Business Logic

**หน้าที่:**

- Business rules ทั้งหมด ("post ที่ยังไม่ publish ดูไม่ได้")
- Orchestrate repositories + integrations
- Throw domain errors เมื่อกฎไม่ตรง
- เป็น public API ที่ module อื่นเรียกได้

**ห้ามทำ:**

- ❌ ห้ามรู้จัก HTTP (req, res, status code)
- ❌ ห้ามเขียน Drizzle query โดยตรง — ใช้ repository
- ❌ ห้าม import controller

```typescript
// modules/posts/posts.service.ts
import { postsRepository } from "./posts.repository";
import { NotFoundError, ForbiddenError } from "@/shared/errors/domain-errors";
import { generateSlug } from "@/shared/utils/slug";
import type { CreatePostInput, Post } from "./posts.types";

export const postsService = {
  async getPublishedPost(id: string): Promise<Post> {
    const post = await postsRepository.findById(id);
    if (!post) throw new NotFoundError("Post not found");
    if (!post.published) throw new ForbiddenError("Post not published");

    await postsRepository.incrementViews(id);
    return post;
  },

  async create(input: CreatePostInput): Promise<Post> {
    const slug = generateSlug(input.title);
    return postsRepository.create({ ...input, slug });
  },

  // ⭐ public API ให้ module อื่นใช้
  async exists(id: string): Promise<boolean> {
    return postsRepository.exists(id);
  },
};
```

---

### 🗄 `*.repository.ts` — Database Access

**หน้าที่:**

- Drizzle query เท่านั้น
- 1 method = 1 operation พื้นฐาน
- Return raw data หรือ null (ไม่ throw business error)

**ห้ามทำ:**

- ❌ ห้ามมี business logic
- ❌ ห้ามเรียก service อื่น
- ❌ ห้าม validate input

```typescript
// modules/posts/posts.repository.ts
import { db } from "@/infrastructure/db/client";
import { posts } from "./posts.schema";
import { eq, sql } from "drizzle-orm";
import type { CreatePostInput, Post } from "./posts.types";

export const postsRepository = {
  async findById(id: string): Promise<Post | null> {
    const [row] = await db.select().from(posts).where(eq(posts.id, id));
    return row ?? null;
  },

  async exists(id: string): Promise<boolean> {
    const [row] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, id));
    return Boolean(row);
  },

  async create(data: CreatePostInput & { slug: string }): Promise<Post> {
    const [row] = await db.insert(posts).values(data).returning();
    return row;
  },

  async incrementViews(id: string): Promise<void> {
    await db
      .update(posts)
      .set({ views: sql`${posts.views} + 1` })
      .where(eq(posts.id, id));
  },
};
```

---

### 🏗 `*.schema.ts` — Drizzle Table Definition

**หน้าที่:**

- Definition ของตาราง
- Relations
- Indexes

```typescript
// modules/posts/posts.schema.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { comments } from "@/modules/comments/comments.schema";

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),
    content: text("content"),
    excerpt: text("excerpt"),
    coverImage: text("cover_image"),
    published: boolean("published").default(false).notNull(),
    views: integer("views").default(0).notNull(),
    authorId: uuid("author_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("posts_slug_idx").on(table.slug),
    publishedIdx: index("posts_published_idx").on(table.published),
  }),
);

export const postsRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
}));
```

---

### 📋 `*.dto.ts` — Input Validation (Zod)

**หน้าที่:**

- Validate input จาก request
- Generate TS type อัตโนมัติจาก Zod schema

```typescript
// modules/posts/posts.dto.ts
import { z } from "zod";

export const createPostDto = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
});

export const updatePostDto = createPostDto.partial();

export type CreatePostDto = z.infer<typeof createPostDto>;
export type UpdatePostDto = z.infer<typeof updatePostDto>;
```

---

### 🏷 `*.types.ts` — TypeScript Types

**หน้าที่:**

- Type ที่ใช้ภายใน feature
- Infer จาก Drizzle schema เพื่อให้ตรงกับ DB เป๊ะ

```typescript
// modules/posts/posts.types.ts
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { posts } from "./posts.schema";

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
export type CreatePostInput = Omit<
  NewPost,
  "id" | "createdAt" | "updatedAt" | "slug" | "views"
>;
```

---

### 🔓 `index.ts` — Public API

**หน้าที่:** กำหนดว่าโลกภายนอกใช้อะไรของ module นี้ได้บ้าง

```typescript
// modules/posts/index.ts
export { postsController } from "./posts.controller";
export { postsService } from "./posts.service";
export type { Post, CreatePostInput } from "./posts.types";

// ❌ ห้าม export repository, schema, dto ออกไป
// → คนนอก module ไม่ควรเรียก DB ตรง หรือรู้รายละเอียด validation
```

---

## 4. กฎเหล็ก 3 ข้อ

### กฎข้อ 1: Module พึ่งกันผ่าน service เท่านั้น

```typescript
// ✅ ถูก
import { postsService } from "@/modules/posts";
const exists = await postsService.exists(postId);

// ❌ ผิด — เรียก repository ของ module อื่น
import { postsRepository } from "@/modules/posts/posts.repository";
```

**เหตุผล:** ถ้า module อื่นเรียก repository ตรงๆ business logic จะถูก bypass — เช่น "post ที่ยังไม่ publish ดูไม่ได้" ก็จะหลุดเลย

---

### กฎข้อ 2: ห้าม Circular Dependency

```
posts → imports → comments  ❌
comments → imports → posts  ❌
```

**ทางแก้:**

- ย้าย logic ที่แชร์ไป `shared/`
- หรือสร้าง orchestrator module ใหม่ที่เรียกทั้งสอง
- หรือใช้ event/pub-sub (advanced)

---

### กฎข้อ 3: Public API ผ่าน `index.ts` เท่านั้น

```typescript
// ✅ ถูก
import { postsService } from "@/modules/posts";

// ❌ ผิด — เจาะเข้าไฟล์ภายในโดยตรง
import { postsService } from "@/modules/posts/posts.service";
```

**เหตุผล:** ทำให้ refactor ภายใน module ได้โดยไม่กระทบใคร — ถ้าวันหนึ่งเปลี่ยนชื่อไฟล์ภายใน คนนอกไม่รู้สึก

---

## 5. Naming Conventions

| สิ่ง                | รูปแบบ                                  | ตัวอย่าง                              |
| ------------------- | --------------------------------------- | ------------------------------------- |
| Module folder       | kebab-case (เอกพจน์/พหูพจน์ตามความหมาย) | `posts/`, `ai/`, `auth/`              |
| File ภายใน module   | `<module>.<layer>.ts`                   | `posts.controller.ts`                 |
| Type / Interface    | PascalCase                              | `Post`, `CreatePostInput`             |
| Variable / Function | camelCase                               | `postsService`, `findById`            |
| Constant            | UPPER_SNAKE_CASE                        | `MAX_POSTS_PER_PAGE`                  |
| Drizzle table       | camelCase ใน TS, snake_case ใน DB       | `posts`, `coverImage` → `cover_image` |
| Zod schema          | camelCase + `Dto` suffix                | `createPostDto`                       |
| Class error         | PascalCase + `Error` suffix             | `NotFoundError`                       |

---

## 6. Flow ตัวอย่าง: ดึงบทความเดี่ยว

```
[Browser]
   │
   │  GET /api/posts/abc-123
   ▼
[app/api/posts/[id]/route.ts]
   │  → postsController.getById("abc-123")
   ▼
[posts.controller.ts]
   │  - validate id (Zod)
   │  - try { ... } catch (e) { handleError(e) }
   │  → postsService.getPublishedPost("abc-123")
   ▼
[posts.service.ts]
   │  - business rule: ต้อง published = true
   │  - side effect: incrementViews
   │  → postsRepository.findById("abc-123")
   ▼
[posts.repository.ts]
   │  - drizzle query
   ▼
[Postgres / Supabase]
```

**สังเกต:** ทิศทางเรียกเป็น **lane เดียว** (ลงล่างอย่างเดียว) — ไม่มีย้อนกลับ

---

## 7. วิธีเพิ่ม Module ใหม่

ทุกครั้งที่เพิ่ม feature ใหม่ ทำตาม checklist นี้:

- [ ] สร้างโฟลเดอร์ `src/modules/<feature>/`
- [ ] สร้างไฟล์ทั้ง 7:
  - [ ] `<feature>.schema.ts` — Drizzle table
  - [ ] `<feature>.types.ts` — TS types
  - [ ] `<feature>.dto.ts` — Zod validators
  - [ ] `<feature>.repository.ts` — DB queries
  - [ ] `<feature>.service.ts` — business logic
  - [ ] `<feature>.controller.ts` — HTTP handler
  - [ ] `index.ts` — public API
- [ ] เพิ่ม schema ใน `infrastructure/db/index.ts`
- [ ] รัน `npm run db:generate` → migration ออกมา
- [ ] เพิ่ม route ใน `app/api/<feature>/route.ts`
- [ ] เพิ่ม route ใน `app/(public)/` (group — URL ไม่มี prefix) หรือ `app/admin/` (folder — URL มี `/admin/` prefix)
- [ ] เขียน test (ถ้ามี)

---

## 8. Server Action vs API Route

โปรเจคนี้ใช้**ทั้งสองแบบ** แยกตามกรณี:

| Use Case                                | ใช้อะไร               | เหตุผล                                      |
| --------------------------------------- | --------------------- | ------------------------------------------- |
| Form ใน admin (create/edit/delete post) | **Server Action**     | พิมพ์น้อย, type-safe, ไม่ต้องสร้าง endpoint |
| Public API ที่ client อื่นเรียก         | **API Route**         | ต้องการ endpoint จริง                       |
| Webhook (Resend, Supabase)              | **API Route**         | external service เรียกเข้ามา                |
| AI streaming (Claude)                   | **API Route**         | ต้องการ streaming response                  |
| Realtime (view counter)                 | **Supabase Realtime** | ใช้ websocket ของ Supabase                  |

**เคล็ดลับ:** ทั้ง Server Action และ API Route ให้เรียก **controller** เดียวกันได้ — logic อยู่ที่ service ทั้งคู่ใช้ของเดียวกัน

```typescript
// modules/posts/posts.actions.ts (Server Action)
"use server";
import { postsService } from "./posts.service";
import { createPostDto } from "./posts.dto";

export async function createPostAction(formData: FormData) {
  const parsed = createPostDto.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: parsed.error.flatten() };

  const post = await postsService.create(parsed.data);
  return { data: post };
}
```

---

## 9. Error Handling

### Domain Errors (ใน service)

```typescript
// shared/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// shared/errors/domain-errors.ts
export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
```

### Centralized Handler (ใน controller)

```typescript
// shared/lib/api-response.ts
import { AppError } from "@/shared/errors/app-error";
import { NextResponse } from "next/server";

export const ok = <T>(data: T, status = 200) =>
  NextResponse.json({ data }, { status });

export const fail = (status: number, message: string) =>
  NextResponse.json({ error: { message } }, { status });

export const badRequest = (error: unknown) =>
  fail(400, error instanceof Error ? error.message : "Bad request");

export const handleError = (e: unknown) => {
  if (e instanceof AppError) return fail(e.statusCode, e.message);
  console.error("Unhandled error:", e);
  return fail(500, "Internal server error");
};
```

**Flow:** Service throws `NotFoundError` → Controller catches → `handleError` map เป็น HTTP 404

---

## 10. Testing Strategy

| Layer      | Test ประเภท           | Mock อะไร               |
| ---------- | --------------------- | ----------------------- |
| Repository | Integration test      | DB จริง (test database) |
| Service    | Unit test             | Mock repository         |
| Controller | Integration test      | Mock service            |
| End-to-end | E2E test (Playwright) | ไม่ mock อะไรเลย        |

**Priority:** เน้น service test ที่สุด เพราะ business logic อยู่ที่นั่น

---

## 📋 Checklist ก่อน Commit

- [ ] ไม่มี import จาก `*.repository.ts` หรือ `*.schema.ts` ของ module อื่น
- [ ] ไม่มี business logic ใน controller
- [ ] ไม่มี HTTP code (status, req, res) ใน service
- [ ] Public API export ผ่าน `index.ts` เท่านั้น
- [ ] DTO มีก่อน controller ใช้
- [ ] Schema migration generate แล้ว (`npm run db:generate`)
- [ ] ไม่มี `console.log` หลงเหลือ (ใช้ `logger`)

---

## 🎓 Resources เรียนรู้เพิ่ม

- **NestJS Architecture Guide** (concept คล้ายกัน): https://docs.nestjs.com
- **Domain-Driven Design** (Eric Evans) — pattern ที่ structure นี้มีรากมาจาก
- **Clean Architecture** (Robert C. Martin) — ปรัชญาการแยก layer
- **Drizzle ORM Docs**: https://orm.drizzle.team

---

_"Make it work, make it right, make it fast." — Kent Beck_

_Pattern นี้ช่วยข้อ 2 และ 3 — ส่วนข้อ 1 ขึ้นกับคุณ ✊_
