# CLAUDE.md — Task Board

> อ่านไฟล์นี้ทุกครั้งก่อนเริ่มงาน

---

## โครงสร้างโปรเจค

```
task-board/
├── frontend/    ← Nuxt.js 3 + TypeScript + Tailwind CSS  (port 3000)
└── backend/     ← AdonisJS 6 + TypeScript + PostgreSQL    (port 3333)
```

### วิธีรัน
```bash
# Backend
cd backend && node ace serve --watch

# Frontend
cd frontend && npm run dev
```

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | Nuxt.js 3, TypeScript, Tailwind CSS, Pinia |
| Backend | AdonisJS 6, TypeScript |
| ORM | Lucid ORM (built-in AdonisJS) |
| Auth | AdonisJS DbAccessTokensProvider (Bearer token in cookie `auth_token`) |
| Database | PostgreSQL (local port 5432, db: task_board, user: postgres) |
| Drive | AdonisJS Drive (local disk) — avatars & attachments |
| Mail | AdonisJS Mail (SMTP) — due date alerts |
| Realtime | @adonisjs/transmit (SSE) — notifications |
| Deploy | Railway (backend) + Vercel (frontend) |
| DevOps | Docker, GitHub Actions CI |

---

## Database Tables

| Table | คำอธิบาย |
|---|---|
| users | ผู้ใช้งาน (fullName, email, password, avatarUrl) |
| auth_access_tokens | Bearer tokens |
| workspaces | พื้นที่ทำงานตามแผนก |
| workspace_members | สมาชิก workspace (role: owner/admin/member) |
| boards | บอร์ด (ชื่อ, description, ownerId, workspaceId) |
| board_members | สมาชิก board (role: admin/member/viewer) |
| columns | คอลัมน์ใน board (To Do, In Progress, Done) |
| tasks | task (title, description, priority, dueDate, assigneeId, columnId) |
| subtasks | subtask ใน task (title, completed) |
| comments | ความคิดเห็นใน task |
| task_attachments | ไฟล์แนบใน task |
| activity_logs | บันทึก action ทั้งหมดใน board |
| labels | labels สีใน board (name, color) |
| task_labels | pivot: task ↔ label |
| notifications | การแจ้งเตือน (type, message, data, read, userId) |
| task_dependencies | task A blocked by task B (taskId, dependsOnId) |

---

## RBAC Roles

### Board Member Roles
- **admin** — แก้ board settings, จัดการ column, ลบ task ได้ทั้งหมด
- **member** — สร้าง/แก้/ลบ task ของตัวเอง, comment ได้
- **viewer** — ดูได้อย่างเดียว (read-only)

> owner ของ board มีสิทธิ์สูงสุดเสมอ

---

## API Routes (prefix: /api/v1)

```
POST   /auth/signup
POST   /auth/login
POST   /auth/logout

GET    /users?search=...
GET    /account/profile
PUT    /account/profile          ← update name
POST   /account/avatar           ← upload avatar

GET    /workspaces
POST   /workspaces
GET    /workspaces/:id
PUT    /workspaces/:id
DELETE /workspaces/:id

GET    /boards
POST   /boards
GET    /boards/:id
PUT    /boards/:id
DELETE /boards/:id
GET    /boards/:boardId/activity
GET    /boards/:boardId/members
POST   /boards/:boardId/members  ← invite
PUT    /boards/:boardId/members/:userId
DELETE /boards/:boardId/members/:userId

GET    /boards/:boardId/columns
POST   /boards/:boardId/columns
PUT    /boards/columns/:id
DELETE /boards/columns/:id

GET    /boards/columns/:columnId/tasks
POST   /boards/columns/:columnId/tasks
PUT    /boards/tasks/:id
DELETE /boards/tasks/:id
GET    /boards/tasks/:taskId/comments
POST   /boards/tasks/:taskId/comments
DELETE /boards/comments/:id
GET    /boards/tasks/:taskId/subtasks
POST   /boards/tasks/:taskId/subtasks
PATCH  /boards/subtasks/:id/toggle
DELETE /boards/subtasks/:id
GET    /boards/tasks/:taskId/attachments
POST   /boards/tasks/:taskId/attachments
DELETE /boards/attachments/:id
```

---

## Frontend Pages

| Path | หน้า |
|---|---|
| / | redirect → /login |
| /login | หน้า login |
| /register | หน้า register |
| /boards | รายการ boards พร้อม stats + Board Templates |
| /boards/:id | Kanban board (drag&drop, task detail, activity log, search, labels, deps, CSV export) |
| /boards/:id/calendar | Calendar view (tasks by due date) |
| /profile | User profile + avatar upload |
| /search | Global search ข้าม boards และ tasks |
| /notifications | ประวัติการแจ้งเตือน |
| /workspaces | รายการ workspaces |

---

## Clean Code Guidelines

### TypeScript
- ทุก function และ variable ต้องมี type annotation
- ใช้ `interface` สำหรับ object types
- ห้ามใช้ `any` — ใช้ `unknown` หรือ type ที่ถูกต้องแทน

### Nuxt / Vue
- ใช้ `<script setup lang="ts">` ทุก component
- แยก composables ออกจาก component logic (`composables/`)
- ตั้งชื่อ component แบบ PascalCase เช่น `TaskCard.vue`
- ใช้ `useRuntimeConfig()` สำหรับ environment variables

### AdonisJS
- แยก logic ออกจาก Controller ไปไว้ใน Service
- ใช้ meaningful names — ห้ามใช้ `e`, `u`, `res` เป็นชื่อตัวแปร
- extract helper methods แทนการเขียน inline ซ้ำๆ
- ใช้ guard clauses แทน nested if

### ทั่วไป
- ไม่ comment สิ่งที่ code อ่านเข้าใจได้อยู่แล้ว
- ไม่ add feature ที่ไม่ได้ขอ
- ไม่ over-engineer

---

## Git Commit Convention

แต่ละ commit ต้องทำ **แค่เรื่องเดียว** และใช้ format นี้เสมอ:

```
feat:     เพิ่ม feature ใหม่
fix:      แก้ bug
refactor: ปรับโค้ดโดยไม่เปลี่ยน behavior
style:    แก้ UI/CSS
chore:    งาน config, dependency, setup
docs:     แก้ documentation
```

### ตัวอย่าง
```
feat: add create task API endpoint
fix: fix auth token not being sent on refresh
refactor: extract task validation to TaskService
style: update board layout for mobile
chore: add Tailwind CSS to Nuxt config
```

### ข้อห้าม
- ❌ ห้ามรวมหลาย feature ใน commit เดียว
- ❌ ห้ามใช้ commit message ภาษาไทย
- ❌ ห้ามใส่ Co-Authored-By ใน commit message

---

## API Base URL

| Environment | URL |
|---|---|
| Development | http://localhost:3333 |
| Production | Railway URL |

---

## สไตล์การทำงาน

- **ทำให้เลย** — ไม่ต้องถาม ถ้างานชัดเจน
- **ภาษาไทย** — UI และ error message
- **TypeScript strict** — ทุก file มี type
- **Commit แยกทีละ feature** — ห้ามรวม commit
