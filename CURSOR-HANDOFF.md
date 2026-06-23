# CURSOR-HANDOFF.md

> Open this file FIRST in Cursor. It is the canonical migration handoff for moving
> this project from Replit → GitHub → Cursor → AWS. Be skeptical: this app is a
> working internal prototype, **not** a production-hardened system. Read the
> Security Notes, Known Broken Items, and Production Blockers before deploying.

This file is meant to travel with every Replit project so the same migration
process can be repeated.

---

## 1. Project Name

**TonyOS Command Center** — founder-level executive intelligence command center for
the Compliance Authority Group (CAG). Visibility / recommend-only by design.
(The name "TARAOS" is only an alternate working label; the codebase is TonyOS.)

## 2. Current Migration Status

**Migration-prep complete inside Replit; NOT yet pushed to GitHub and NOT deployed.**
Code builds and typechecks. Handoff docs, `.env.example`, `.gitignore` hardening, and
env-restrictable CORS are in place. Everything after "push to GitHub" is still to do.

## 3. Canonical App Folder

- Frontend (canonical UI): `artifacts/cockpit` (React 19 + Vite SPA)
- Backend API: `artifacts/api-server` (Express 5, mounted at `/api`)

## 4. Package Manager

**pnpm** (v10+). Enforced — a root `preinstall` hook rejects npm and yarn. Node.js 24.

## 5. Install Command

```bash
pnpm install --frozen-lockfile
```

## 6. Dev Command

Each service needs `PORT`; the web apps also need `BASE_PATH`. On Replit these are
injected by workflows; elsewhere set them yourself:

```bash
# API
PORT=8080 pnpm --filter @workspace/api-server run dev
# Web (cockpit)
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/cockpit run dev
```

(Do NOT run `pnpm dev` at the repo root — there is no root dev script by design.)

## 7. Build Command

**AWS / staging verification — build the canonical TonyOS artifacts only** (do not
build `artifacts/mockup-sandbox`; it is Replit-only and excluded from production/staging):

```bash
pnpm run typecheck

PORT=8080 pnpm --filter @workspace/api-server run build
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/cockpit run build
#  API bundle -> artifacts/api-server/dist/index.mjs
#  Web static -> artifacts/cockpit/dist/public  (SPA; rewrite /* -> /index.html)
```

Root `pnpm run build` typechecks first, then builds **all** workspace packages — including
`artifacts/mockup-sandbox`, which requires `PORT` and is not part of TonyOS staging/prod.
On AWS, expect root `pnpm run build` to fail for that reason; use the filtered commands above.

## 8. Typecheck Command

```bash
pnpm run typecheck
```

## 9. Active App Folders

| Path | Role |
| --- | --- |
| `artifacts/cockpit` | Canonical web app (production) |
| `artifacts/api-server` | API server (production) |
| `lib/db` | Postgres + Drizzle schema/pool (production) |
| `lib/api-spec` | OpenAPI contract — source of truth (build-time) |
| `lib/api-zod` | Generated Zod validators (build-time) |
| `lib/api-client-react` | Generated React Query hooks + fetch client (build-time) |
| `scripts` | Utility scripts incl. the destructive DB seed (tooling) |

## 10. Folders To Avoid / Do Not Touch

- `artifacts/mockup-sandbox` — Replit-only design/canvas dev tool. NOT part of the
  shipped product. Do not deploy it. (Kept in repo for history; do not build into prod.)
- `.replit`, `.replit-artifact/` (×3 artifacts), `scripts/post-merge.sh`,
  `.replitignore` — Replit-platform config. Irrelevant on AWS; safe to ignore.
- `@replit/*` Vite plugins in `artifacts/cockpit/vite.config.ts` — gated behind
  `REPL_ID` (Replit-only); they no-op off-Replit. Do not set `REPL_ID` on AWS.
- `pnpm-lock.yaml` — do not hand-edit; let pnpm manage it.

## 11. Data Reality

- **Static / sample data:** None masquerading as production. UI data is fetched from
  the API/DB. Reference data is loaded via the seed script (see below).
- **localStorage:** Used ONLY for two client-side UI lenses — the Reviewer identity
  and the Access role (leadership/team). These are presentation filters, **not**
  security and **not** persisted server-side.
- **API data:** All screens read through generated React Query hooks hitting `/api/*`.
  Frontend uses relative URLs, so the web origin must route `/api` to the API server.
- **Database:** PostgreSQL via Drizzle ORM (`lib/db`). In Replit this is the
  Replit-managed Postgres. There is **no** production database provisioned yet.
- **Live integrations:** **None.** No Zoho, no WorkDrive, no Supabase, no Stripe,
  no AI providers, no third-party APIs are connected anywhere in the code.

## 12. Environment Variables

| Variable | Required | Secret? | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | **Secret** | Postgres connection string (`lib/db`) |
| `PORT` | Yes (per service) | No | Port each service binds to |
| `BASE_PATH` | Yes (web build) | No (frontend-safe) | Base path the SPA is served under |
| `NODE_ENV` | No | No | `development` \| `production` |
| `LOG_LEVEL` | No | No | API log level (`info`/`debug`/…) |
| `CORS_ORIGIN` | Prod only | No | Comma-separated CORS allowlist |
| `REPL_ID` | No | No | **Replit-only**, auto-set; do NOT set on AWS |

- **Required:** `DATABASE_URL`, `PORT`, `BASE_PATH`.
- **Optional:** `NODE_ENV`, `LOG_LEVEL`, `CORS_ORIGIN`.
- **Secret vs non-secret:** Only `DATABASE_URL` is secret. Everything else is
  infra/config and frontend-safe.
- `SESSION_SECRET` exists as a leftover Replit secret but is **not referenced in the
  code** — do not carry it over.

## 13. Security Notes

- **Auth status: NONE.** There is no server-side authentication or authorization.
  The Reviewer/Access "roles" are client-side localStorage lenses only. Anyone who can
  reach `/api` has full read access and can POST/PATCH/DELETE participation notes and
  create reviewer records. **This is the #1 blocker for any non-trusted-network use.**
- **CORS status:** Defaults to OPEN (`Access-Control-Allow-Origin: *`) when
  `CORS_ORIGIN` is unset. Now restrictable: set `CORS_ORIGIN` to a comma-separated
  allowlist in production.
- **Secrets status:** No secrets are committed. `.env` is gitignored; `.env.example`
  holds placeholders only. A secret scan of tracked files came back clean.
- **Public exposure risk: HIGH if deployed publicly as-is** — no auth + open CORS by
  default means founder-level data would be world-readable. Keep behind a trusted
  network / VPN until auth is added and `CORS_ORIGIN` is set.

## 14. Known Broken / Not Working Items

Be honest — this is a prototype:

- **No authentication/authorization** (server-side). Biggest gap.
- **No production persistence configured** — only the Replit-managed dev Postgres.
- **Role / Authority-Mode toggles are cosmetic filters**, not enforced access control.
  Switching to "team" only hides UI; the API still serves everything.
- **"Tony Mode" personal lens** (Ocean / Travel / Game Day / Strength / Field Notes)
  is intentionally **non-interactive / visual-only**.
- **Open CORS by default** until `CORS_ORIGIN` is set (see Security Notes).
- **Destructive seed script** — `scripts/src/seed-cockpit.ts` deletes ALL tables then
  re-inserts. It is a reset tool, not a safe production migration.
- No empty/dead `onClick` handlers were found, and no fake/demo data masquerading as
  real data was found. A full manual click-through of every interactive element was
  **not** performed — Cursor should smoke-test interactive flows after wiring a DB.
- No CI, no automated tests, no deploy pipeline exist in the repo.

## 15. Production Blockers

1. Add real authentication + authorization to the API (none today).
2. Set `CORS_ORIGIN` to a restricted allowlist.
3. Provision a managed Postgres (AWS RDS / Supabase) and set `DATABASE_URL`. Do not use
   the Replit-managed DB as the long-term source of truth.
4. Keep the destructive seed out of any production runbook.
5. Stand up hosting: serve `artifacts/cockpit/dist/public` via nginx and reverse-proxy
   `/api` to the Node API (PM2/systemd), plus TLS + DNS.
6. Exclude `artifacts/mockup-sandbox` from production deploys.

## 16. What Was Changed In Replit For Migration

Four files only — no redesign, no feature changes, no artifacts deleted:

- `artifacts/api-server/src/app.ts` — CORS made env-restrictable via `CORS_ORIGIN`
  (unset = allow-all, preserving prior dev behavior; set = allowlist).
- `README.md` — added full migration/runbook documentation.
- `.env.example` — added (placeholders only).
- `.gitignore` — hardened to exclude `.env` / `.env.*` (keeps `!.env.example`) and
  `*.log` / `logs`.
- `CURSOR-HANDOFF.md` — this file.

## 17. What Was Verified

- `pnpm run typecheck` passes across all packages (libs + artifacts).
- `pnpm install --frozen-lockfile` succeeds and leaves the committed lockfile unchanged.
- Canonical TonyOS builds pass on AWS (filtered commands; `mockup-sandbox` excluded):
  `PORT=8080 pnpm --filter @workspace/api-server run build` and
  `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/cockpit run build`.
- Root `pnpm run build` fails on AWS only because `artifacts/mockup-sandbox` requires `PORT`
  — expected; that folder is Replit-only and not staged/deployed.
- API `/api/healthz` returns `{"status":"ok"}`.
- CORS default header is `*` when `CORS_ORIGIN` is unset (non-breaking change confirmed).
- Secret scan of tracked files is clean; `.env` is not tracked.
- Package manager and the install/dev/build/typecheck commands were run and confirmed.

## 18. What Was NOT Done

Explicitly did **NOT**:

- push to GitHub
- deploy anywhere
- add authentication
- connect or provision a production database
- connect Zoho
- connect WorkDrive
- connect Supabase
- run database migrations (`db push`)
- run seed scripts
- configure nginx
- configure TLS
- configure DNS
- remove or delete any old artifacts

## 19. Suggested Next Cursor Tasks

### Safe first tasks (no approval needed)
1. Clone the repo in Cursor; run `pnpm install --frozen-lockfile`, `pnpm run typecheck`,
   and the canonical filtered builds (Section 7) to confirm a clean baseline off-Replit.
   Do not use root `pnpm run build` for AWS/staging verification — it pulls in
   `artifacts/mockup-sandbox`, which requires `PORT` and is Replit-only.
2. Copy `.env.example` → `.env` and point `DATABASE_URL` at a local/dev Postgres.
3. Read `lib/api-spec/openapi.yaml` (the contract) and `replit.md` to learn the domain.
4. Add a `.nvmrc` / engines pin for Node 24 and document local Postgres setup.

### Needs Carmen / Rose approval
5. Design and implement real server-side auth + authorization (the core gap).
6. Provision a managed Postgres (RDS/Supabase); run `db push`; decide on a non-destructive
   data-load path instead of the destructive seed.
7. Set `CORS_ORIGIN`, configure nginx (static + `/api` proxy), TLS, and DNS for a staging deploy.
8. Decide whether `artifacts/mockup-sandbox` is dropped from the deploy build.

### Do not do yet
9. Do NOT run the seed script against any DB with real data (it wipes all tables).
10. Do NOT deploy publicly until auth exists and `CORS_ORIGIN` is restricted.
11. Do NOT add any operational/financial/company-binding write actions — this product is
    visibility / recommend-only by contract.

## 20. Exact AWS / Cursor Commands

```bash
# Clone (GitHub = source of truth)
git clone https://github.com/contractorcomplianceco-cmyk/tonyos-command-center.git
cd tonyos-command-center

# Tooling
corepack enable && corepack prepare pnpm@10 --activate   # or: npm i -g pnpm

# Install (lockfile-faithful)
pnpm install --frozen-lockfile

# Environment
cp .env.example .env
# edit .env: set DATABASE_URL (managed Postgres); set CORS_ORIGIN for prod

# Verify + build (canonical TonyOS only — skip mockup-sandbox)
pnpm run typecheck
PORT=8080 pnpm --filter @workspace/api-server run build
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/cockpit run build
# Root `pnpm run build` fails on AWS because mockup-sandbox requires PORT — expected.

# (Only with approval) push schema to your DB
pnpm --filter @workspace/db run push

# Run the API (use PM2/systemd in real deploys)
PORT=8080 NODE_ENV=production CORS_ORIGIN=https://your-domain \
  node --enable-source-maps artifacts/api-server/dist/index.mjs

# Serve artifacts/cockpit/dist/public via nginx; reverse-proxy /api -> 127.0.0.1:8080
```

## 21. Final Safety Checklist

- [x] `CURSOR-HANDOFF.md` exists at repo root
- [x] `README.md` exists
- [x] `.env.example` exists (placeholders only)
- [x] `.gitignore` excludes secrets (`.env`, `.env.*`) and build output (`dist`, etc.)
- [x] No `.env` or secrets are tracked in git
- [x] Package manager and commands were verified (install/dev/build/typecheck)
- [x] Known broken items are documented (Section 14)
- [x] Next Cursor tasks are documented (Section 19)
- [ ] Pushed to GitHub — **pending; must be done by a human (Replit Git pane or AWS box)**
- [ ] Auth added — pending (production blocker)
- [ ] `CORS_ORIGIN` set for production — pending
- [ ] Production database provisioned — pending
