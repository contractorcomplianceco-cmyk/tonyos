---
name: Cockpit dark command modules
description: Content cards are dark navy modules (not white); how the design tokens encode that and the --secondary dual-use trap.
---

# Cockpit content surfaces are dark navy "command modules"

The cockpit content cards are dark navy surfaces elevated above the (darker) shell — NOT white admin cards. This is driven entirely by CSS design tokens in `artifacts/cockpit/src/index.css` (`:root` and the mirrored `.dark` block, which are kept identical): `--card` and `--popover` are dark navy, `--card-foreground` is near-white, `--card-border` is steel-on-navy.

**Why:** the shell was already dark; white work surfaces clashed with the "command center" intent. This supersedes the old replit.md "light/white work surfaces" line.

**How to apply:** retheme via tokens, not per-component bg colors. Pages already use `bg-card`/`text-card-foreground`/`text-muted-foreground`, so they follow the tokens automatically. `--muted-foreground` must stay LIGHT (~`215 20% 68%`) for readability on dark cards.

## The --secondary dual-use trap (the thing that bites)
`--secondary` is used two incompatible ways:
1. As the inner sub-card / row surface (`bg-secondary` in Risk/Pulse/Decisions/Brain/Home risk cards, panel header tint, hover states). For dark modules this MUST be a dark steel (~`217 30% 18%`), or those inner cards render as light blocks — i.e. white admin cards return inside the dark modules.
2. Historically as the silver "Plan" chart series fill (`fill="hsl(var(--secondary))"`).

Because (1) forces secondary dark, the chart Plan series can no longer use it — switch Plan bars + their legend swatch to `hsl(var(--muted-foreground))` (light graphite reads as silver on navy). Decision-band/panel-header tints stay as `bg-secondary/40` (subtle lighten over the card).

## Status chips on dark
Light pastel chips (`bg-emerald-50 text-emerald-700`) are unreadable/garish on dark. Use translucent-on-dark everywhere: `bg-<hue>-500/15 text-<hue>-300 border-<hue>-500/30` (StatusBadge tones, Home KPI tones, Financial/Brain/ReviewDetail callouts). Trend/icon colors go `-600`→`-400`; tinted callout text goes `-800/-900`→`-100/-200`.

## Recharts on dark
Tooltips need explicit light text or they default to dark-on-dark: set `contentStyle.color`, `itemStyle.color` to `hsl(var(--card-foreground))` and `labelStyle.color` to `hsl(var(--muted-foreground))`. Grid/axis use `hsl(var(--card-border))` / `hsl(var(--muted-foreground))`.
