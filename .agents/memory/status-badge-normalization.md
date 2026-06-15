---
name: StatusBadge normalization & tone overrides
description: How cockpit status/severity chips resolve color, and the raw-casing pitfall when overriding tone per page.
---

The cockpit unifies all status/severity chips through one shared `StatusBadge` (in `src/components/common/`). It normalizes input internally (lowercase, trim, spaces/hyphens → `_`) before looking up a status→tone map, and exports `normalizeStatus()` for reuse.

**Rule:** The API returns status/severity in human-cased form — e.g. `"In Progress"`, `"High"`, `"Monitoring"`, `"Verified"`. Never compare these raw values with strict equality. When a page needs a per-page tone override (e.g. Risk roadmap `in_progress` → blue while elsewhere it's amber, or Home risk-mini colored by severity), run the value through `normalizeStatus()` first.

**Why:** A strict `value === "in_progress"` against the raw `"In Progress"` silently fails, the override is dropped, and the badge falls through to the default looked-up tone (amber) — a bug that typechecks fine and only shows up visually.

**How to apply:** Import `{ StatusBadge, normalizeStatus }` and write `tone={normalizeStatus(x) === "in_progress" ? "blue" : undefined}`. Precedence inside StatusBadge is severity > status > tone-only, with an explicit `tone` prop overriding the looked-up tone within the active branch.
