# TonyOS Command Center

Founder-level strategic oversight command center for the Compliance Authority Group
(CAG). Visibility / recommend-only: nothing is approved, committed, or signed without
explicit written human approval. This repository is being prepared so GitHub can become
the source of truth and the app can be opened in Cursor and run on an AWS dev server.

> **Start here:** open [`CURSOR-HANDOFF.md`](./CURSOR-HANDOFF.md) first — it is the
> canonical migration handoff (status, data reality, security notes, known broken items,
> blockers, next Cursor tasks, and exact AWS commands). This README is the deeper reference.

> **Naming note:** the codebase, artifact titles, and product copy are all **TonyOS**.
> "TARAOS" appears only as an alternate working name in migration notes — the canonical
> product here is **TonyOS Command Center**.

## Repository layout (pnpm monorepo)

| Path | Role | Production? |
| --- | --- | --- |
| `artifacts/cockpit` | **Canonical web app** (React + Vite SPA, TonyOS UI) | Yes |
| `artifacts/api-server` | **API server** (Express 5, mounted at `/api`) | Yes |
| `lib/db` | Postgres + Drizzle ORM schema and pool | Yes |
| `lib/api-spec` | OpenAPI spec (contract source of truth) | Build-time |
| `lib/api-zod` | Generated Zod validators | Build-time |
| `lib/api-client-react` | Generated React Query hooks + fetch client | Build-time |
| `scripts` | Utility scripts incl. **destructive** DB seed | Tooling only |
| `artifacts/mockup-sandbox` | Replit-only design/canvas dev tool | **No — exclude from prod** |

**Canonical app folder:** `artifacts/cockpit` (frontend) backed by `artifacts/api-server`
(backend). `artifacts/mockup-sandbox` is a Replit design-time tool and is not part of the
shipped product — it is kept for build history but should not be deployed. No folders were
deleted during migration prep.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite (static SPA build)
- Backend: Express 5
- DB: PostgreSQL + Drizzle ORM
- Contract-first: OpenAPI → Orval (React Query hooks) + Zod validators

## Package manager

**pnpm** (enforced — a `preinstall` hook rejects npm/yarn). Use pnpm 10+.

## Commands

```bash
# Install (does not modify the committed lockfile)
pnpm install --frozen-lockfile

# Typecheck everything (libs + artifacts)
pnpm run typecheck

# Build canonical TonyOS artifacts (AWS / staging verification)
PORT=8080 pnpm --filter @workspace/api-server run build
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/cockpit run build
#   - API bundle:   artifacts/api-server/dist/index.mjs
#   - Web static:   artifacts/cockpit/dist/public  (SPA, rewrite /* -> /index.html)

# Root build (Replit / full workspace — includes mockup-sandbox)
pnpm run build
# On AWS, root `pnpm run build` fails because artifacts/mockup-sandbox requires PORT.
# That folder is Replit-only and excluded from production/staging — use the filtered
# commands above for AWS/staging verification instead.

# Regenerate API hooks + Zod schemas from the OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

### Dev servers

Each service needs `PORT` (and the web apps also need `BASE_PATH`). On Replit these are
injected by the workflow; elsewhere set them yourself:

```bash
# API server (serves /api)
PORT=8080 pnpm --filter @workspace/api-server run dev

# Web app (cockpit)
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/cockpit run dev
```

### Database (guarded — do not run without approval)

```bash
# Push schema to the DB in DATABASE_URL (dev only)
pnpm --filter @workspace/db run push

# DESTRUCTIVE seed — wipes ALL tables then re-inserts reference data.
# NEVER run against a database holding real data.
pnpm --filter @workspace/scripts run seed
```

## Environment variables

Copy `.env.example` → `.env` and fill in values. Only `DATABASE_URL` is a secret.

| Variable | Required | Secret? | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | **Secret** | Postgres connection string |
| `PORT` | Yes (per service) | No | Port each service binds to |
| `BASE_PATH` | Yes (web build) | No (frontend-safe) | Base path the SPA is served under |
| `NODE_ENV` | No | No | `development` \| `production` |
| `LOG_LEVEL` | No | No | API log level (`info`/`debug`/…) |
| `CORS_ORIGIN` | Prod only | No | Comma-separated CORS allowlist (see below) |
| `REPL_ID` | No | No | **Replit-only**, auto-set; do NOT set on AWS |

`SESSION_SECRET` may exist as a leftover Replit secret but is **not referenced anywhere in
the code** — do not carry it over.

## Security / production posture (read before deploying)

- **No authentication exists.** The Reviewer identity and Access role are client-side
  `localStorage` UI lenses only — they are **not** server-enforced. Any client that can
  reach `/api` has full read access and can POST founder participation notes. Real auth is
  required before any non-trusted-network deployment. This is guardrail-critical given the
  founder-level data.
- **The API stays visibility / recommend-only.** The only writes are participation
  notes (create/edit/delete) on decisions, brands, and projects, plus reviewer-identity
  creation — explicitly NOT approvals. There is **no** operational, financial, spending,
  payroll, hiring/firing, or other company-binding write authority, and none must be added
  without a separately approved written-approval workflow.
- **CORS** defaults to open (all origins) when `CORS_ORIGIN` is unset. Set `CORS_ORIGIN`
  to your domain allowlist in production.
- **No AI endpoints** exist in this codebase — nothing to disable or rate-limit.
- **Data source:** all UI data comes from the API/Postgres (no demo/mock data masquerading
  as production). `localStorage` is used only for the Reviewer/Access UI lenses.

## Known blockers before production

1. Add real authentication/authorization for the API (none today).
2. Set `CORS_ORIGIN` to a restricted allowlist.
3. Provision a managed Postgres (AWS RDS / Supabase). Do **not** use the Replit-managed DB
   as the long-term production source of truth.
4. The seed script is destructive — keep it out of any production runbook.
5. Stand up hosting: serve the cockpit static build via nginx and reverse-proxy `/api` to
   the Node API (e.g. PM2), plus TLS + DNS.
6. Exclude `artifacts/mockup-sandbox` from production deploys.

## AWS / Cursor setup

```bash
# 1. Clone (GitHub = source of truth)
git clone https://github.com/contractorcomplianceco-cmyk/tonyos-command-center.git
cd tonyos-command-center

# 2. Tooling
corepack enable && corepack prepare pnpm@10 --activate   # or: npm i -g pnpm

# 3. Install (lockfile-faithful)
pnpm install --frozen-lockfile

# 4. Environment
cp .env.example .env
# edit .env — set DATABASE_URL (managed Postgres), and CORS_ORIGIN for prod

# 5. Verify + build (canonical TonyOS only — skip mockup-sandbox)
pnpm run typecheck
PORT=8080 pnpm --filter @workspace/api-server run build
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/cockpit run build
# Root `pnpm run build` fails on AWS because mockup-sandbox requires PORT — expected.
#   - API bundle:   artifacts/api-server/dist/index.mjs
#   - Web static:   artifacts/cockpit/dist/public  (SPA, rewrite /* -> /index.html)

# 6. Run the API (example; use PM2/systemd in real deploys)
PORT=8080 NODE_ENV=production CORS_ORIGIN=https://your-domain \
  node --enable-source-maps artifacts/api-server/dist/index.mjs

# 7. Serve artifacts/cockpit/dist/public via nginx and proxy /api -> 127.0.0.1:8080
```

The frontend calls the API with relative `/api/...` paths, so the web origin must route
`/api` to the API server (handled by the Replit proxy in dev; use nginx on AWS).

## Pushing to GitHub

The actual push must be done by a human (via Replit's Git pane or from the AWS box) — the
agent does not hold push credentials. After confirming the safety checks above:

```bash
git remote add origin https://github.com/contractorcomplianceco-cmyk/tonyos-command-center.git
git add .
git commit -m "Prepare TonyOS Command Center for GitHub/AWS migration"
git push -u origin main
```

Verify no secrets are staged first: `git status` and `git grep -nI "DATABASE_URL=postgres"`
should return nothing committed. `.env` is gitignored.
