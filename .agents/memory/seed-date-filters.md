---
name: Seed date filters
description: Cockpit seed data uses fixed future dueDates, so relative date filters need fallbacks.
---

The cockpit's seeded decisions carry fixed `dueDate` values set weeks into the future (e.g. July dates) rather than dates relative to "now".

**Why:** The seed is static reference data, not generated relative to the current clock. A strict "due this week" window (now..now+7d) matches nothing against this seed, so any panel gated solely on that window renders empty even though the data is meaningful.

**How to apply:** When building near-term/"this week" views (e.g. On Deck on `/tonyos`), implement the date window but fall back to the soonest-upcoming items when the window is empty, and caption the panel to reflect which mode it's showing. Don't assume seed dates are anchored to the current date.
