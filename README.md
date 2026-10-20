# BAIA — Penanindigan Bay

Marketing site, direct-booking flow, and content admin for BAIA, a small cottage resort on
Penanindigan Bay in San Vicente, Palawan.

Live: <https://baia-arena.vercel.app>

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 |
| Styling | Tailwind CSS 4 |
| Database | Neon Postgres (Lakebase), project `spring-brook-21770189`, branch `production` |
| Driver | `pg` (node-postgres) + Drizzle ORM, pooled connection, `attachDatabasePool` for Vercel Fluid compute |
| Hosting | Vercel — project `baia-arena` |
| Images/video | Stored as base64 in `media_assets` and served from `/api/media/[id]` (survives serverless deploys) |

## Local setup

```bash
npm install
npx neon link --project-id spring-brook-21770189 -y   # or cp .env.example .env.local and fill in
npm run db:push                                       # create tables (uses the direct, unpooled URL)
npm run dev                                           # http://localhost:3000
```

`.env.local` is written by `neon deploy` / `neon env pull` and is git-ignored. See `.env.example`
for the variables the app needs.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:push` | Push `src/db/schema.ts` to the database (drizzle-kit, direct connection) |

## Routes

| Route | Notes |
|---|---|
| `/` | Landing page: cottages, experiences, dining, reviews, FAQ |
| `/legal/[slug]` | Privacy policy and terms |
| `/api/settings` | Site config (GET public, POST admin-gated) |
| `/api/bookings` | Reservation create (public); list/patch admin-gated |
| `/api/inquiries` | Contact form |
| `/api/chat` | On-site concierge replies + transcript log |
| `/api/upload`, `/api/media/[id]` | Admin media upload and delivery |
| `/api/admin/verify`, `/api/admin/passkey` | Admin unlock and passkey change |
| `/api/health` | `select 1` against the database |

## Database

`src/db/schema.ts` defines `site_settings`, `bookings`, `inquiries`, `chat_messages` and
`media_assets`. Site content, cottage pricing, OTA links and the admin passkey live in
`site_settings`, so content edits need no redeploy.

Runtime traffic uses the pooled `DATABASE_URL` (`-pooler` host). `drizzle-kit` uses
`DATABASE_URL_UNPOOLED`, because PgBouncer's transaction mode breaks the session-level statements
DDL needs.

## Admin

Open the site, click the logo three times (or use the footer Admin link) and enter the passkey.
The default passkey is `5309` until it is changed in **Admin → Security** — change it before the
site is public. `ADMIN_PASSKEY` in the environment acts as a recovery key.

## Deployment

Vercel project `baia-arena` (`david-les-projects-c8f3547a`), functions in `iad1`. Deploys are run
from the CLI for now — Git auto-deploy is not connected yet, because Vercel's GitHub app needs
access to the `sanvicpalawan` account first:

```bash
vercel deploy --prod --scope team_XTdaWpbLIYq3yF7OQ2KWzDVU
```

Required environment variable in Production, Preview and Development:

```
DATABASE_URL   # pooled Neon connection string
```

Schema changes ship separately from code: run `npm run db:push` locally against the branch before
deploying anything that depends on the new schema.
