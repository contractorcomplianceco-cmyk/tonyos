---
name: Authority-mode lens scope
description: What the Founder Authority Mode lens is allowed to filter in the cockpit CAG command center.
---

The Founder Authority Mode lens (modes VIEW / REVIEW / RECOMMEND / WRITTEN APPROVAL) filters
items by their `authorityLabel` using `matchesMode` in `lib/authority.ts`.

**Rule:** the lens filters only authority-gated *action items* — decisions and projects. It must
NOT filter org-structure or health-monitoring entities (brands, departments, predictors); those
stay fully visible in every mode.

**Why:** VIEW mode's caption is "Full visibility across all authority levels." Hiding entire
brands/departments behind a decision-authority lens contradicts the product's full-visibility
principle and produces confusing UX (e.g. the "Departments On Track 5/8" count would change
based on a lens). A code review initially flagged the lens as missing on hierarchy pages; the
deliberate decision is to scope it to action items, not to force-filter everything.

**How to apply:** when adding a new surface, only wire `matchesMode` filtering if the entity
represents an authority-gated action requiring founder sign-off. Show the `AuthorityModeToggle`
on pages that have such items (currently Home decisions, Decisions page, Operating projects).
