# TonyOS Command Center (Rose OS)

A founder-level executive command center for Tony Casella: strategic oversight, financial visibility, major-decision review, and risk/platform strategy visibility with drill-down access. Strictly recommend-only / visibility-only — nothing is approved, committed, or signed until a human gives explicit written approval.

Visual direction: dark graphite executive shell on a deep ocean navy-black background, charcoal/storm-gray command modules (content cards are elevated dark surfaces, NOT white admin cards). Ocean teal + sea-glass is the dominant accent (`--primary`); electric blue (`--command` token) is RESERVED for important command actions only (e.g. the Founder-Level Oversight badge), never for general accents. Silver/steel borders, subtle blueprint-grid background, translucent green/amber/red status chips (amber/red are status-only, never decorative), ~6px max radius. STRICTLY FORBIDDEN: heavy all-blue dashboards, white admin cards, pink, purple, lavender, magenta, rose/rose-gold, gold, yellow-heavy, orange decoration, beige, generic gradients, decorative orbs, illustrations, cartoon/hobby gimmicks. No emojis. Success test: must read as Tony Casella's private executive command center, not a generic dark dashboard.

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

This is the **CAG (Compliance Authority Group) parent-company command center**. Hierarchy: CAG parent → brands (CCA active + candidates PCA/QCA/CANNA CA/GCA) → CCA departments → projects → decisions. Sidebar nav was renamed to feel like the founder's personal OS (route paths unchanged); labels live in `Shell.tsx`. Sidebar sections, all read-mostly:
- `/` **TonyOS Home** (Parent Overview) — CAG portfolio dashboard: KPI row (Company Pulse, Collected Retained Revenue, Operating Reserve, Major Decisions Pending, Predictive Alerts), brand-portfolio org tree, Major Decision Control table (impact / required authority / status / due, authority-mode lens), embedded CCA Operating Pulse snapshot table, Financial Intelligence block, Predictive Intelligence radar, Governance Guardrails, CLP strip. Carries the Founder Authority Mode toggle.
- `/brands` **Expansion Map** (Brand Portfolio, + `/brands/:code` Brand Detail) — org tree + active/candidate brand cards; drill-down shows brand profile/health, department health, projects, and brand predictive signals.
- `/operating` **Strategic Compass** (CCA Operating Pulse) — composite health, departments-on-track, open blockers, Department Health table, Active Projects. Carries the Founder Authority Mode toggle (lens filters projects by authority label).
- `/predictors` **Forward Signals** (Predictive Intelligence) — 18 forward-looking modules (radar + category-filterable cards).
- `/decisions` **Game Plan** (Major Decisions, + `/decisions/:id`) — decision queue with authority labels + brand codes, authority-mode lens, status filter.
- `/tonyos` **Command Center** (TonyOS Executive Intelligence) — leadership-only consolidated overview. Header reads "TonyOS Command Center" with the electric-blue Founder-Level Oversight command badge. Aggregates the modules — Strategic Compass KPIs, Expansion Map, CCA Operating Pulse, Forward Signals radar, Founder Financials, Game Plan, Governance Guardrails, Company Intelligence source records, CLP strip — plus three personalized sections: **On Deck** (top pending decisions needing review this week, sorted by due date, filtered by the authority lens), **Deep Dive** (drill-down link grid to each module), and **Tony Mode** (founder's personal lens: Ocean / Travel / Game Day / Strength / Field Notes — tasteful, non-interactive). Carries the Founder Authority Mode toggle.
- `/financial` **Founder Financials** (Financial Review), `/risk` **Risk Tide** (Risk Platform), `/brain` **Company Intelligence** (Company Brain) — retained from the prior product (visibility only).

Access roles: `context/Access.tsx` holds a localStorage-backed role (`tonyos.role`, default `leadership`) exposing `useAccess()` ({role, isLeadership, setRole}) and `AccessRoleControl` (header popover to switch leadership/team). The `/tonyos` route and its sidebar nav entry are leadership-only. Gating is client-side only (like the Reviewer/AuthorityMode lenses) — `TonyOS` renders a Restricted Access screen for non-leadership and only mounts the inner `TonyOSExecutive` (which runs the privileged data hooks) when leadership, so no executive queries fire for team roles. This is a UI lens, not server-enforced authorization.

Founder Authority Mode (VIEW / REVIEW / RECOMMEND / WRITTEN APPROVAL) is a lens that filters authority-gated action items (decisions, projects) by their `authorityLabel` via `matchesMode`. It deliberately does NOT hide org-structure/health entities (brands, departments, predictors) — those stay fully visible at all times. The lens lives in `context/AuthorityMode.tsx`; tone mapping in `lib/authority.ts`.

The only write action is adding a participation note to a decision — explicitly NOT an approval. Detail routes `/reviews/:id` and `/decisions/:id` are reachable from their list pages, not the sidebar. `/pulse` route is retained but removed from the sidebar nav.

## User preferences

- No emojis anywhere in the UI.

## Gotchas

- The cockpit `App.tsx` routes assume a `Shell` layout at `src/components/layout/Shell.tsx` — all pages render inside it.
- Frontend route params (e.g. decision id) arrive as strings from wouter; convert to `Number` before passing to hooks.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
