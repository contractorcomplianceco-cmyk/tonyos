---
name: Reviewer identity for note authorship
description: How the note author is determined in the cockpit (no real auth)
---

# Reviewer identity

Note authorship across decisions, brands, and projects comes from a **client-side reviewer identity**, not real authentication.

**Why:** The product has no signed-in identity / auth layer. Notes previously always defaulted to "Tony Casella". To attribute notes consistently, reviewers are picked from a **DB-backed roster** (the `reviewers` table) instead of typed free-text — typed names fragmented attribution ("T. Casella" vs "Tony Casella"). Only the *active selection* is per-browser (`localStorage`); the roster itself is shared/persisted.

**How to apply:**
- Active reviewer state lives in `context/Reviewer.tsx` (`useReviewer`, `ReviewerProvider`); the selected name persists in `localStorage` (key `tonyos.reviewer`), default "Tony Casella".
- The `ReviewerIdentity` control (Shell header) is a picker: it lists the roster from `GET /reviewers` and can add a new one via `POST /reviewers`. `POST` is idempotent on `name` (returns the existing row with 200 instead of 201 on duplicate).
- The roster comes from the `reviewersTable` (name is `unique`), seeded in `scripts/src/seed-cockpit.ts`.
- The shared `ParticipationNotes` component reads the reviewer and passes it through its `onSubmit(body, author, callbacks)` signature; pages forward `author` into the note mutation.
- The server still defaults note `author` to "Tony Casella" when none is provided — keep that as a safe fallback.
- If real auth is ever added, the reviewer should come from the authenticated user instead of the picker.
