---
name: Reviewer identity for note authorship
description: How the note author is determined in the cockpit (no real auth)
---

# Reviewer identity

Note authorship across decisions, brands, and projects comes from a **client-side reviewer identity**, not real authentication.

**Why:** The product has no signed-in identity / auth layer. Notes previously always defaulted to "Tony Casella". To attribute notes to the actual reviewer, an editable name is persisted in `localStorage` and sent as the `author` field on note creation.

**How to apply:**
- The active reviewer lives in `context/Reviewer.tsx` (`useReviewer`, `ReviewerProvider`, `ReviewerIdentity` control in the Shell header). Default name is "Tony Casella".
- The shared `ParticipationNotes` component reads the reviewer and passes it through its `onSubmit(body, author, callbacks)` signature; pages forward `author` into the note mutation.
- The server still defaults `author` to "Tony Casella" when none is provided — keep that as a safe fallback.
- If real auth is ever added, the reviewer name should come from the authenticated user instead of localStorage.
