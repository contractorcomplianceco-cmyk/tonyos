---
name: cockpit theme (bright coastal)
description: How the TonyOS cockpit light/dark token split works and the trap that breaks it
---

# TonyOS cockpit — bright coastal theme

The cockpit is a **single bright theme**, not a light/dark toggle: `:root` and `.dark` in `artifacts/cockpit/src/index.css` are deliberately mirrored to the SAME light workspace palette. Do not "add dark mode" by diverging them without checking the product owner — the mirroring is intentional.

The look is a **dark frame around a light workspace**: a dark graphite/navy sidebar + top command bar wrap a light, pearl/mist main content area.

**Why:** the design brief asked for a "bright coastal executive command center" — dark frame, light spacious workspace — reference image `@assets/ChatGPT_Image_Jun_22,_2026,_10_02_59_AM_1782137004416.png`.

**How to apply (the trap):**
- The dark frame is driven ONLY by `--sidebar*` tokens. Anything rendered in MAIN content must use `card` / `background` / `border` / `foreground` / `muted-foreground` tokens.
- Using `sidebar-*` tokens (e.g. `text-sidebar-foreground`, `border-sidebar-border`, `bg-sidebar`) in main content renders light text / dark borders on the light canvas and is invisible or visually wrong. This bit several callout strips, guardrail panels, and the header controls (Reviewer/Access/AuthorityMode) during the dark→light conversion.
- Status chips must use mid-tone shades on light surfaces: emerald/amber/red `600/700` text, `/10` fills, `/30` borders. The old dark theme used pale `300/400` text on `/15` fills — those wash out on white.
- After any theme-token edit, grep main content (excluding `components/layout/Shell.tsx`, `components/ui/*`, `not-found.tsx`) for `sidebar-` to catch stragglers.
