<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PartsMart

A Next.js 16 App Router marketplace for car parts (South African market). Customers search by make/model/year/part-number across vendors; vendors manage listings and subscribe to saved-search alerts (email + in-app); an admin grooms the catalog and oversees everyone.

## Stack

- Next.js 16 (App Router, RSC, Turbopack), React 19, TypeScript strict
- DB: Turso (libSQL/SQLite) + Drizzle ORM (`@libsql/client`, `drizzle-orm/libsql`, casing `snake_case`)
- Auth: Better Auth (email/password, custom `role` additional field — `customer` | `vendor` | `admin`)
- Email: Resend (transactional alert emails)
- UI: Tailwind v4 + shadcn-style primitives in `src/components/ui/` (hand-written, no CLI)
- zod for validation, Vercel Cron (`vercel.json`) for hourly alert dispatch

## Commands

```bash
npm run dev          # next dev (Turbopack)
npm run build        # production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run db:push      # apply schema changes to Turso/local SQLite (drizzle-kit push)
npm run db:seed      # seed SA catalog + part types + admin user (tsx src/db/seed.ts)
npm run db:studio    # drizzle-kit studio
```

**Always run `npm run lint` and `npm run typecheck` after changes.**

## Environment

See `.env.example`. Dev defaults to `TURSO_DATABASE_URL=file:local.db` (no Turso account needed). Required for prod: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY`, `ALERT_FROM_EMAIL`, `CRON_SECRET`.

## Architecture (feature-sliced)

Domains live under `src/features/<domain>/` with `<domain>-queries.ts` (server-only, `cache()`-wrapped) and `<domain>-actions.ts` (`'use server'`). Pages under `src/app/` only compose features + Suspense skeletons. Catalog read queries are shared via `features/vehicle-catalog`.

Feature slices: `auth`, `vehicle-catalog`, `search`, `listing`, `saved-search`, `notifications`, `admin`.

- Catalog dedup is enforced at the **DB level** (`UNIQUE … COLLATE NOCASE` on `make.name`, `model(make_id,name)`, `model(make_id,slug)`, `vehicle_year(model_id,year)`, `part_type.slug`) and backed by the admin forms which surface `UNIQUE constraint` errors as friendly messages.
- Search uses indexed `LIKE` (SQLite LIKE is case-insensitive for ASCII) + faceted joins — no FTS5 virtual table. Sufficient for MVP volumes.
- Protected routes gated in `src/proxy.ts` (the Next 16 successor to `middleware.ts`); role checks happen in the group layouts/server actions. `getSessionCookie(request)` is used in the proxy (no DB hit); `requireRole`/`getCurrentUser` (DB-backed) is used in layouts/actions.

## Route groups

Routes are grouped by role under `src/app/`, each with its own layout (the root `layout.tsx` provides the html/body/header/toaster shell; group layouts sit inside it and add role-specific chrome):

| Group | Layout | Auth gate | Routes |
|---|---|---|---|
| `(public)` | pass-through | none | `/`, `/search`, `/listings/[id]`, `/sign-in`, `/sign-up` |
| `(customer)` | container wrapper | redirect → `/sign-in` if no session | `/account` |
| `(vendor)` | sidebar (Dashboard, Listings, Alerts, Notifications) | redirect → `/sign-in` / `/account` unless role `vendor` + `status active` | `/vendor/**` |
| `(admin)` | sidebar (Overview, Catalog, Vendors, Customers, Listings) | redirect → `/sign-in` / `/account` unless role `admin` | `/admin/**` |

`src/app/api/**` (auth handler, catalog cascading endpoints, cron dispatcher) sits outside any group — no layout, no auth gate in the layout (auth checked per-route).
- Alert dispatch: `GET /api/cron/dispatch-alerts?secret=$CRON_SECRET` (Vercel Cron, hourly). Per saved search it finds listings created after `last_dispatched_at`, writes deduped `in_app_notification` rows (unique on `vendor_id, listing_id`), sends one Resend email per vendor, then advances the watermark.
- Server actions return `{ ok: true } | { ok: false; error }`. In client forms use `useActionState`; in plain server-component `<form action={...}>` wrap with `asFormAction()` from `src/lib/form-action.ts` to satisfy the `Promise<void>` form-action type.

## Seeded data

`db:seed` is idempotent (`getOrCreate*` by slug). Seeds ~17 SA makes, ~64 models with years 2015→current, 16 part types, and an admin user (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, default `admin@partsmart.test` / `changeme123`). **Change these in prod.**

## Notes

- Customers search without signing in. Account creation is optional (favorites out of MVP scope).
- Vendors are gated on `status === 'active'`; an admin can suspend a vendor, which hides their listings from search and disables their dashboard.
- Images are supplied by URL only in MVP (no upload/storage).