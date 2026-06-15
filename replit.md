# TonyOS Command Center (Rose OS)

A founder-level executive command center for Tony Casella: strategic oversight, financial visibility, major-decision review, and risk/platform strategy visibility with drill-down access. Strictly recommend-only / visibility-only — nothing is approved, committed, or signed until a human gives explicit written approval.

Visual direction: dark navy app shell with dark navy command modules (content cards are elevated dark surfaces, NOT white admin cards), electric blue accents, steel/silver borders, translucent green/amber/red status chips, ~6px max radius. STRICTLY FORBIDDEN: pink, purple, lavender, magenta, rose/rose-gold, yellow-heavy, orange, generic gradients, decorative orbs, illustrations. No emojis.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

- Contract-first: `lib/api-spec/openapi.yaml` is the source of truth. Routes parse both inputs and responses with the generated Zod schemas (`@workspace/api-zod`); the frontend uses the generated React Query hooks (`@workspace/api-client-react`).
- Singletons (executive summary, financial overview) are single-row tables that store `Metric` arrays/objects as `jsonb`; numeric fields use `doublePrecision` so they deserialize as numbers.
- `DecisionSummary.totalImpact` is computed at request time by parsing each pending decision's `estimatedImpact` string — K/M/B suffixes are honored, so impacts must keep that format.
- `DecisionNote.createdAt` is a text column set in the route on insert (ISO string), not a DB default.
- Recommend-only / visibility-only guardrails are part of the product contract, surfaced in the Shell, Decision Queue, Financial, and Guardrails screens — not just one page.

## Product

This is the **CAG (Compliance Authority Group) parent-company command center**. Hierarchy: CAG parent → brands (CCA active + candidates PCA/QCA/CANNA CA/GCA) → CCA departments → projects → decisions. Sidebar sections, all read-mostly:
- `/` Parent Overview (Home) — CAG portfolio dashboard: KPI row (Company Pulse, Collected Retained Revenue, Operating Reserve, Major Decisions Pending, Predictive Alerts), brand-portfolio org tree, Major Decision Queue (authority-mode lens), Predictive Intelligence radar, Governance Guardrails, CLP strip. Carries the Founder Authority Mode toggle.
- `/brands` Brand Portfolio (+ `/brands/:code` Brand Detail) — org tree + active/candidate brand cards; drill-down shows brand profile/health, department health, projects, and brand predictive signals.
- `/operating` CCA Operating Pulse — composite health, departments-on-track, open blockers, Department Health table, Active Projects. Carries the Founder Authority Mode toggle (lens filters projects by authority label).
- `/predictors` Predictive Intelligence — 18 forward-looking modules (radar + category-filterable cards).
- `/decisions` Major Decisions (+ `/decisions/:id`) — decision queue with authority labels + brand codes, authority-mode lens, status filter.
- `/financial` Financial Review, `/risk` Risk Platform, `/brain` Company Brain — retained from the prior product (visibility only).

Founder Authority Mode (VIEW / REVIEW / RECOMMEND / WRITTEN APPROVAL) is a lens that filters authority-gated action items (decisions, projects) by their `authorityLabel` via `matchesMode`. It deliberately does NOT hide org-structure/health entities (brands, departments, predictors) — those stay fully visible at all times. The lens lives in `context/AuthorityMode.tsx`; tone mapping in `lib/authority.ts`.

The only write action is adding a participation note to a decision — explicitly NOT an approval. Detail routes `/reviews/:id` and `/decisions/:id` are reachable from their list pages, not the sidebar. `/pulse` route is retained but removed from the sidebar nav.

## User preferences

- No emojis anywhere in the UI.

## Gotchas

- The cockpit `App.tsx` routes assume a `Shell` layout at `src/components/layout/Shell.tsx` — all pages render inside it.
- Frontend route params (e.g. decision id) arrive as strings from wouter; convert to `Number` before passing to hooks.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
