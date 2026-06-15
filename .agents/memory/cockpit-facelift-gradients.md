---
name: Cockpit single-hue depth gradients are intentional
description: Why some gradients exist in the cockpit despite the "no gradients" brand brief, and which ones are allowed.
---

`replit.md` bans "generic gradients" and "decorative orbs" for the TonyOS cockpit. During an "executive facelift" the user explicitly asked to "make the flat color more dynamic / add a little more color / make it pop." That request authorizes a narrow, deliberate exception.

**Rule:** Single-hue, purpose-driven depth gradients ARE allowed and should NOT be stripped: the navy+blue shell depth on `body` (index.css radial layers), the single-hue electric-blue chart bar fill (`linearGradient` in Home finance chart), and subtle steel/primary header accents (Panel header `from-secondary/40`). What stays forbidden: multicolor/"generic" gradients, pink/purple/magenta/rose/orange hues, glowing orbs, illustrations.

**Why:** The "no gradients" line targets the cheap multicolor SaaS look. A code review explicitly passed these as single-hue depth/legibility treatments, not decoration. A future agent re-reading only the brief might delete them as violations — don't.

**How to apply:** Keep gradients single-hue (navy or electric-blue family) and tied to depth/data legibility. KPI accent colors come from the allowed status palette (emerald/amber/red/primary-blue) driven by trend, not decorative. If adding new gradients, match this constraint or leave surfaces flat.
