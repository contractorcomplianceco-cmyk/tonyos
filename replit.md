# Rose OS — Executive Strategy Cockpit

A founder-level oversight cockpit for the Chief Strategy Officer: strategic, financial, and risk visibility plus major-decision oversight. Strictly recommend-only — nothing is approved, committed, or signed until a human gives explicit written approval.

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

Eleven founder-level sections, all read-mostly: Executive Home, Company Strategy Overview, Major Decision Queue (flags items needing written approval, filterable by status), Financial Visibility (visibility only), Risk & Platform Strategy, AI/Platform Roadmap, Strategic Partnerships, Founder Involvement & Milestones, Monthly Founder Review, Company Brain Source Records, and CLP Separation / Authority Guardrails. The only write action is adding a participation note to a decision — explicitly NOT an approval.

## User preferences

- No emojis anywhere in the UI.

## Gotchas

- The cockpit `App.tsx` routes assume a `Shell` layout at `src/components/layout/Shell.tsx` — all pages render inside it.
- Frontend route params (e.g. decision id) arrive as strings from wouter; convert to `Number` before passing to hooks.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
