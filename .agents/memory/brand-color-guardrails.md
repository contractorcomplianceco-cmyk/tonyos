---
name: Brand color guardrails
description: Hard visual constraints for the TonyOS / CAG cockpit artifact.
---

Dark navy modules, electric blue accents, steel/silver borders, translucent green/amber/red
status chips, ~6px max radius.

**Forbidden:** pink, purple, lavender, magenta, rose/rose-gold, yellow-heavy, orange, generic
gradients, decorative orbs, illustrations, emojis.

**Gotcha — the "Rose" authority label:** the 8-level authority system includes a "Needs Rose
approval" label. Despite the name, it must render in **amber**, never pink/rose/purple. Tone
mapping lives in `lib/authority.ts`.

**Gotcha — chart gradients:** recharts area/sparkline fills default to `linearGradient` defs.
Use a flat `fill={color} fillOpacity={...}` instead — gradient fills violate the no-gradients
rule and have been flagged in review.

**Why:** these are explicit, strict client constraints in `replit.md`; violations (even subtle
chart gradients) are treated as defects.
