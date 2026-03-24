# Asset Tracker — Project Plan

## What We're Building

A **multi-tenant SaaS asset tracking app** similar to [Asset Tiger](https://www.assetpanda.com/). Multiple companies sign up independently; each company's data is fully isolated. Designed as a prototype first (frontend with mock data), then wired to a real backend.

**Zero-cost infra:** Next.js on Vercel free tier + Supabase free tier = $0

---

## Tech Stack

| Layer     | Choice                                                     |
| --------- | ---------------------------------------------------------- |
| Framework | Next.js 16 (App Router, TypeScript, strict)                |
| Styling   | Tailwind CSS v4 + shadcn/ui + claymorphism theme (tweakcn) |
| Backend   | Supabase (Auth, Postgres + RLS, Storage)                   |
| Hosting   | Vercel (free tier)                                         |
| Forms     | react-hook-form + zod                                      |
| Tables    | @tanstack/react-table                                      |
| Charts    | recharts (dynamic import, no SSR)                          |
| Dates     | date-fns                                                   |
| QR Codes  | qrcode.react (Phase 2)                                     |

---

## User Roles

| Role       | Scope             | Can Do                                           |
| ---------- | ----------------- | ------------------------------------------------ |
| **Owner**  | Org-wide          | Everything; cannot be demoted                    |
| **Admin**  | Org-wide          | All CRUD, invite users, manage all departments   |
| **Editor** | Department-scoped | Add/edit/delete assets in their departments only |
| **Viewer** | Department-scoped | View + CSV export in their departments only      |

Users can belong to multiple departments. A user's department membership controls what they can see and touch.

---

## Core Data Model

```
organizations         → id, name, slug, owner_id, onboarding_completed
profiles              → id (→ auth.users), org_id, full_name, role, invite_status
invites               → id, org_id, email, role, token, expires_at, accepted_at
departments           → id, org_id, name                          (soft delete)
user_departments      → user_id, department_id                    (junction table)
categories            → id, org_id, name, icon                   (soft delete)
locations             → id, org_id, name                          (soft delete)
vendors               → id, org_id, name, contact_email           (soft delete)
assets                → id, org_id, asset_tag, name, category_id, department_id,
                         location_id, status, purchase_date, purchase_cost,
                         warranty_expiry, vendor_id, notes, image_url,
                         deleted_at, created_by, updated_by
asset_assignments     → id, asset_id, assigned_to_user_id, assigned_to_name,
                         assigned_at, expected_return_at, returned_at
audit_logs            → id, org_id, actor_id, entity_type, entity_id, action, changes
```

**Asset statuses:** `active | under_maintenance | retired | lost | in_storage | checked_out`

---

## Route Structure (Next.js App Router)

```
app/
├── (auth)/                       # Centered card layout, no sidebar
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   └── invite/[token]/page.tsx
│
├── (onboarding)/                 # Stepper layout
│   ├── org/new/page.tsx
│   ├── org/join/page.tsx
│   └── setup/
│       ├── departments/page.tsx
│       ├── categories/page.tsx
│       └── complete/page.tsx
│
├── (app)/                        # Full app shell: sidebar + topbar
│   ├── dashboard/page.tsx
│   ├── assets/
│   │   ├── page.tsx              # Table view (default) + card toggle
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx          # Detail: info + assignments + audit log tabs
│   │       └── edit/page.tsx
│   ├── departments/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── categories/page.tsx
│   ├── locations/page.tsx
│   ├── vendors/page.tsx
│   ├── users/
│   │   ├── page.tsx              # User table + pending invites section
│   │   └── [id]/page.tsx
│   ├── reports/page.tsx
│   └── settings/
│       ├── org/page.tsx
│       ├── profile/page.tsx
│       └── custom-fields/page.tsx
│
└── middleware.ts                 # Auth guard + org check + onboarding redirect
```

---

## Source Structure

```
src/
├── app/                     # All Next.js routes
├── components/
│   ├── ui/                  # shadcn/ui primitives — DO NOT EDIT
│   ├── layout/              # AppShell, Sidebar, Topbar, OnboardingShell
│   ├── assets/              # AssetTable, AssetForm, AssetStatusBadge, etc.
│   ├── dashboard/           # StatCard, charts, RecentActivity
│   ├── users/               # UserTable, InviteUserModal
│   ├── departments/         # DepartmentCard, DepartmentForm
│   └── shared/              # DataTable, ConfirmDialog, EmptyState, PageHeader
├── lib/
│   ├── mock-data/           # All Phase 1 mock data (JSON-like TS files)
│   ├── hooks/               # useAssets, useDepartments, useAuth, usePermissions
│   ├── types/               # All TypeScript types + Zod schemas
│   └── utils/               # formatters, permissions, csv-export
└── providers/               # AuthProvider, OrgProvider, QueryProvider
```

---

## Phase 1 — Frontend MVP (mock data)

Build everything as a fully interactive frontend. Mock data lives in `src/lib/mock-data/`. A floating "Role Switcher" dev tool allows demoing all permission levels without a real backend.

| #   | Step                                                                               | Status  |
| --- | ---------------------------------------------------------------------------------- | ------- |
| 1   | **Scaffold** — create-next-app, shadcn, claymorphism, deps, ESLint/Prettier/Husky  | ✅ Done |
| 2   | **Types** — all TS types + Zod schemas in `src/lib/types/`                         | ⬜      |
| 3   | **Mock data** — 1 org, 3 depts, 30 assets, 6 users, dashboard stats, audit logs    | ⬜      |
| 4   | **Providers + App shell** — AuthProvider, OrgProvider, Sidebar, Topbar             | ⬜      |
| 5   | **Auth pages** — Login, Signup (mock session on submit)                            | ⬜      |
| 6   | **Onboarding** — Create org, department/category seeders, complete page            | ⬜      |
| 7   | **Dashboard** — Stat cards, charts (Recharts), activity feed, warranty alerts      | ⬜      |
| 8   | **Assets** — Filterable table, card toggle, detail page, AssetForm, checkout modal | ⬜      |
| 9   | **Management pages** — Departments, Categories, Locations, Vendors (Sheet modals)  | ⬜      |
| 10  | **Users** — User table, mock invite flow (pending state), role/dept editor         | ⬜      |
| 11  | **Reports** — Filters, preview table, CSV export                                   | ⬜      |
| 12  | **Settings** — Org, profile, custom fields builder                                 | ⬜      |
| 13  | **Polish** — Empty states, skeletons, toasts, mobile, dark mode                    | ⬜      |

---

## Phase 2 — Supabase Backend

| #   | Step                                                                           | Status |
| --- | ------------------------------------------------------------------------------ | ------ |
| 1   | Supabase project + env vars + `@supabase/ssr` client wrappers                  | ⬜     |
| 2   | SQL migrations (enums → tables in dependency order)                            | ⬜     |
| 3   | Row Level Security policies (org-scoped + role + department-scoped for assets) | ⬜     |
| 4   | Replace AuthProvider mock with real Supabase auth                              | ⬜     |
| 5   | Replace data hooks one-by-one (departments → categories → assets → users)      | ⬜     |
| 6   | Server actions in `src/app/actions/` for all mutations                         | ⬜     |
| 7   | Real invite system (token email via Supabase/Resend)                           | ⬜     |
| 8   | File storage — Supabase Storage for asset images + org logos                   | ⬜     |
| 9   | Audit logging — Postgres triggers + manual inserts for checkout/return         | ⬜     |
| 10  | Dashboard aggregations — Postgres views for stat counts                        | ⬜     |
| 11  | Production deploy — Vercel env vars, auth redirect URLs, DB indexes            | ⬜     |

---

## Code Standards

- **TypeScript**: `strict: true`, no `any`, Zod schemas inferred as types
- **ESLint**: `eslint-config-next` + `@typescript-eslint/recommended`
- **Prettier**: no semi, single quotes, trailing commas, `prettier-plugin-tailwindcss`
- **Components**: Server Components by default; `"use client"` only when needed
- **Forms**: always `react-hook-form` + `zodResolver`
- **Images**: always `next/image`; Recharts dynamically imported (`ssr: false`)
- **Git**: conventional commits (`feat:`, `fix:`, `chore:`), commit per completed feature
- **Pre-commit**: Husky → lint-staged runs ESLint + Prettier on changed files

---

## Git

```bash
git remote add origin git@github.com:elimanzo/asset-tracker.git
git branch -M main
git push -u origin main
```
