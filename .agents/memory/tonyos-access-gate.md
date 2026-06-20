---
name: TonyOS leadership access gate
description: How the leadership-only /tonyos route gates both nav and data fetching
---

The `/tonyos` route is leadership-only via `context/Access.tsx` (localStorage role `tonyos.role`, default `leadership`, `useAccess()` + `AccessRoleControl`). Gating is client-side only, consistent with the Reviewer/AuthorityMode lenses — it is a UI lens, NOT server-enforced authorization.

Two gate layers:
- Nav: `Shell.tsx` filters `NAV` by `item.leadershipOnly || isLeadership`.
- Page: the `TonyOS` default export checks `isLeadership` and renders a Restricted Access screen for non-leadership; it only mounts an inner `TonyOSExecutive` component when leadership.

**Why:** the privileged executive data hooks (useGetExecutiveSummary, useGetBrands, etc.) must live in the inner component, not the gate component. If they run before the gate, a non-leadership user hitting `/tonyos` directly still fires the executive queries and receives the payloads over the network — a client-side bypass. Splitting the component ensures zero privileged queries fire for team roles.

**How to apply:** when adding a role/permission-gated screen that fetches sensitive data, put the gate check in an outer wrapper and the data hooks in an inner child that only mounts when authorized — never call the hooks above the early-return guard.
