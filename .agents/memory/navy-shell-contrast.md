---
name: Navy-shell inner-card contrast trap
description: In the cockpit's layered navy theme, inner cards must use bg-secondary not bg-background or text goes invisible.
---

# Navy-shell inner-card contrast trap

In `artifacts/cockpit`, the theme is a layered deep-navy app shell with white `bg-card` panels floating inside it. `--background` is dark navy; `--card`/`text-card-foreground` are light-panel/dark-text; `--secondary` is light steel.

**Rule:** Any nested card, row, or hover surface that lives *inside* a white `bg-card` panel and renders `text-card-foreground` (dark) text must use `bg-secondary` (light steel), NEVER `bg-background` (dark navy). Using `bg-background` puts dark text on a dark surface = invisible.

**Why:** A redesign swapped the global background token to dark navy but left many inner cards on `bg-background` with dark `text-card-foreground`, making titles unreadable across Home, Brain, Risk, Pulse, Financial, Decisions (including `hover:bg-background` states).

**How to apply:** When adding inner cards/rows, default to `bg-secondary`. Reserve `bg-background` for surfaces that intentionally use light `text-foreground` (e.g. the dark CLP strip, dark sidebar/header). After theme-token changes, grep `bg-background` / `hover:bg-background` in pages and verify each one's text color.

**Related:** Milestone `date` field holds display strings like "Q3 2025" (not ISO) — render it raw; `new Date(mile.date)` yields "Invalid Date". Guardrail `status` value is "Active" (capitalized), not "enforced" — compare case-insensitively.
