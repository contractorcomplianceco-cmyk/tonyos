---
name: Forbidden colors hide in Tailwind utilities
description: Why a global theme swap can still leave banned hues on screen, and how to catch them
---

When a brief bans specific hues (e.g. TonyOS Command Center forbids pink/purple/lavender/magenta/rose/rose-gold/yellow-heavy/orange), rewriting the CSS theme tokens in `index.css` is NOT sufficient. Status chips, badges, and trend arrows frequently hardcode Tailwind color utilities like `bg-rose-50 text-rose-700 border-rose-200` or `text-rose-600` directly in component JSX, which bypass the theme tokens entirely.

**Why:** A code review failed an otherwise-correct redesign purely because residual `rose-*` utility classes remained in multiple page components after the global theme had been switched to navy/electric-blue. The screenshots of the home page looked fine, but other chips/pages still rendered the banned hue.

**How to apply:** After any re-theme that bans colors, grep the entire component tree (`rg "rose-|pink-|purple-|lavender-|magenta-|orange-|yellow-" --glob '*.tsx'`) and also scan `index.css`. Note the allowed exceptions before deleting blindly — for this product green/amber/red status chips ARE allowed, so `amber-*` and `emerald-*` stay; only `rose-*` had to become `red-*`. A blanket `sed -E 's/\brose-([0-9]+)/red-\1/g'` over the pages is the quick fix.
