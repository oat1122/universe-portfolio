# 🌌 Universe Portfolio — Roadmap

> Portfolio + Blog + Admin Dashboard แบบจักรวาลล่องดาวเคราะห์
> Timeline โดยประมาณ: **4 สัปดาห์** (วันละ 4-6 ชม.)

---

## 🎯 เป้าหมายของโปรเจค

สร้างเว็บ portfolio ส่วนตัวที่:
- **หน้าแรก** = scene 3D จักรวาล แต่ละ project = ดาวเคราะห์ที่กดเข้าไปดูได้
- **Blog** = ระบบเขียนบทความเหมือน Medium มี comment + view counter
- **Admin Dashboard** = ล็อกอินเข้าไปเขียน/แก้/ลบบทความเองได้
- **AI Features** = ปุ่มให้ Claude สรุปบทความ + generate tags อัตโนมัติ
- **Polish** = dark mode, responsive mobile, animation ลื่นๆ

---

## 🛠 Tech Stack

### Frontend
| Tool | ใช้ทำอะไร |
|------|-----------|
| Next.js 15 (App Router) | Framework หลัก, server components |
| TypeScript | เขียนโค้ดปลอดภัย ไม่หลุด type |
| Tailwind CSS | เขียน CSS เร็ว |
| shadcn/ui | UI components สวยพร้อมใช้ |
| React Three Fiber + Drei | 3D scene ในรูป React |
| postprocessing | เอฟเฟกต์ bloom, glow |
| GSAP + Framer Motion | Animation |
| MDX | Blog ที่ฝัง React component ได้ |

### Backend / Data
| Tool | ใช้ทำอะไร |
|------|-----------|
| Supabase | Postgres + Auth + Storage + Realtime |
| Drizzle ORM | Query DB แบบ type-safe + migration |
| Zod | Validate ข้อมูลก่อนเข้า DB |
| React Hook Form | จัดการ form |

> **Package manager:** ใช้ **npm เท่านั้น** (ห้ามเปลี่ยนเป็น pnpm/yarn) — ดูเหตุผลใน `STACK.md`

### Bonus (ของว้าว)
| Tool | ใช้ทำอะไร |
|------|-----------|
| Claude API | สรุปบทความ + generate tags |
| Resend | ส่ง email เมื่อมี comment |
| Vercel Analytics | ดู traffic |
| Custom shaders (GLSL) | เอฟเฟกต์ glow/distortion ดาวเคราะห์ |

---

## 📅 Roadmap 4 สัปดาห์

### Week 1 — รากฐาน 🧱

**เป้าหมาย:** เข้าใจ HTML/CSS/JS/React/Next.js พื้นฐาน

- [ ] ติดตั้ง Node.js (LTS), VS Code, Git
- [ ] สมัคร GitHub, Vercel, Supabase
- [ ] เรียน HTML/CSS/JavaScript พื้นฐาน (freeCodeCamp / MDN)
- [ ] เรียน React: component, props, state, hooks
- [ ] ทำ Next.js official tutorial: https://nextjs.org/learn
- [ ] สร้างหน้า "Hello World" + deploy ขึ้น Vercel
- [ ] เรียน Tailwind CSS เบื้องต้น

**Deliverable:** เว็บหน้าเดียวที่ deploy แล้ว ดูได้บน internet

---

### Week 2 — Database + Auth + CRUD 🗄️

**เป้าหมาย:** ทำระบบ blog ที่ใช้งานได้จริง (ยังไม่สวย)

- [ ] ตั้งค่า Supabase project
- [ ] ติดตั้ง Drizzle ORM + drizzle-kit (ดู `STACK.md` section 8)
- [ ] ออกแบบ schema ใน `src/modules/<feature>/<feature>.schema.ts` (ตาม `ARCHITECTURE.md`): `posts`, `projects`, `comments`, `profiles` (ห้ามสร้าง `users` table — ใช้ `auth.users` ของ Supabase, สร้าง `profiles` ที่ reference เข้าไปแทน)
- [ ] รัน `npm run db:generate` + `npm run db:migrate`
- [ ] เปิด RLS + เขียน policy ทุกตาราง (default-deny)
- [ ] เชื่อม Next.js กับ Supabase
- [ ] ทำหน้าล็อกอิน admin (Supabase Auth)
- [ ] ทำหน้า list บทความ (Read)
- [ ] ทำหน้าเขียนบทความ (Create)
- [ ] ทำหน้าแก้บทความ (Update)
- [ ] ทำปุ่มลบบทความ (Delete)
- [ ] ทำหน้าอ่านบทความเดี่ยว
- [ ] ทำระบบ comment

**Deliverable:** Blog ที่เขียน-แก้-ลบ-อ่านได้ มี login

---

### Week 3 — 3D + Design 🎨

**เป้าหมาย:** Universe scene + design ที่สวยจริง

- [ ] เรียน Three.js / R3F basics (Bruno Simon's course มีตัวฟรี)
- [ ] สร้าง 3D scene: starfield พื้นหลัง
- [ ] สร้างดาวเคราะห์ — geometry + texture
- [ ] ทำให้ดาวเคราะห์หมุน + กดได้ (link ไป project)
- [ ] เพิ่ม postprocessing: bloom, glow
- [ ] เขียน custom shader 1 ตัว (เช่น atmosphere glow)
- [ ] กล้อง: scroll หรือ mouse → กล้องเคลื่อน
- [ ] เพิ่ม animation ด้วย GSAP / Framer Motion
- [ ] Design หน้า blog ใหม่ให้สวย (ใช้ shadcn/ui)
- [ ] Dark mode toggle

**Deliverable:** Universe scene ใช้งานได้ + UI ทุกหน้าสวยขึ้น

---

### Week 4 — ขัดเงา + Deploy + AI 🚀

**เป้าหมาย:** จบงาน production-ready

- [ ] รวม 3D scene กับ blog เข้าด้วยกัน
- [ ] Responsive mobile (3D ลด complexity บน mobile)
- [ ] Integrate Claude API: ปุ่ม "สรุปบทความ"
- [ ] Integrate Claude API: ปุ่ม "Generate tags"
- [ ] ระบบ view counter (Supabase realtime)
- [ ] ตั้งค่า Resend สำหรับ email notification
- [ ] SEO: meta tags, Open Graph, sitemap
- [ ] Performance: lazy load 3D, optimize images
- [ ] Deploy production บน Vercel
- [ ] ผูก custom domain (ถ้ามี)
- [ ] ใส่ Vercel Analytics
- [ ] เขียน README + ถ่าย screenshot โพสต์

**Deliverable:** เว็บที่ deploy แล้วใช้จริง — เอาไปสมัครงานได้

---

## ⚠️ ข้อควรรู้ก่อนลุย

1. **จะติดบั๊กบ่อยมาก** — เป็นเรื่องปกติ ทุกคนเป็น Google + Stack Overflow + Claude คือเพื่อนสนิท
2. **อย่า copy-paste อย่างเดียว** — พยายามเข้าใจทุกบรรทัด ไม่งั้น debug ไม่ได้
3. **commit Git บ่อยๆ** — ทุกครั้งที่ทำอะไรเสร็จ commit ทันที ป้องกันโค้ดหาย
4. **ตั้ง milestone เล็กๆ** — "ทำ login เสร็จ" ดีกว่า "ทำเว็บเสร็จ"
5. **อย่าทำ feature ใหม่ตอนยังบั๊ก** — แก้ของเก่าให้เสถียรก่อน
6. **ถ้าติดเกิน 30 นาที** — เปลี่ยนวิธี / ถาม / พักก่อน อย่านั่งดื้อดึง
7. **Mobile-first** — เริ่มออกแบบจากจอเล็กก่อน ขยายขึ้นใหญ่ง่ายกว่ากลับกัน

---

## 📚 Resources แนะนำ

### Free Courses
- **Next.js**: https://nextjs.org/learn
- **React**: https://react.dev/learn
- **Three.js Journey** (Bruno Simon): https://threejs-journey.com (ตัวฟรีก็เริ่มได้)
- **Supabase**: https://supabase.com/docs
- **freeCodeCamp**: https://www.freecodecamp.org

### YouTube Channels
- Theo - t3.gg (Next.js)
- Bruno Simon (Three.js)
- Web Dev Simplified (concepts)
- Fireship (เร็ว+มีรสชาติ)

### Documentation
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- shadcn/ui: https://ui.shadcn.com
- Tailwind: https://tailwindcss.com/docs

---

## 🗂 Database Schema (preview)

```sql
-- posts
id          uuid primary key
title       text not null
slug        text unique not null
content     text  -- MDX
excerpt     text
cover_image text
tags        text[]
published   boolean default false
views       int default 0
created_at  timestamp
updated_at  timestamp
author_id   uuid references auth.users

-- projects
id           uuid primary key
title        text not null
description  text
tech_stack   text[]
demo_url     text
github_url   text
planet_color text  -- สีดาวเคราะห์ใน 3D scene
order_index  int

-- comments
id         uuid primary key
post_id    uuid references posts
author     text
email      text
content    text
created_at timestamp
```

---

## 🚀 ก้าวแรก (Day 1)

1. ติดตั้ง Node.js LTS, VS Code, Git
2. สมัครบัญชี GitHub, Vercel, Supabase (ฟรีหมด)
3. เปิด VS Code → terminal → `npx create-next-app@latest my-portfolio`
4. ตอบ yes ให้กับ TypeScript, Tailwind, App Router
5. `cd my-portfolio && npm run dev`
6. เปิด http://localhost:3000 → เห็นหน้าแรก = สำเร็จขั้นแรก! 🎉

---

## 📝 Progress Log

ทำเสร็จแต่ละ task มากากบาท `[x]` ไว้นะ จะเห็น progress ของตัวเอง

**Started:** _____________
**Week 1 done:** _____________
**Week 2 done:** _____________
**Week 3 done:** _____________
**Launched:** _____________

---

*สู้ๆ! โปรเจคนี้ยากแต่จบแล้วจะเป็น portfolio ที่เด่นมาก* 💪
