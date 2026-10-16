# Changelog

## 0.3 lifestyle and narrative update — 2026-10-16

- Replace numeric success probabilities with qualitative likelihood labels while preserving deterministic engine rolls.
- Describe choices through event-specific consequences and actual career/country/asset changes; remove success/failure badges.
- Add persistent time and spending priorities, annual effects/costs, affordability and confinement handling, with paused automatic playback while editing.
- Display assets as a documented fictional USD valuation instead of a score/bar. Preserve old saved ending text and use monetary values in new summaries.
- Fix sale proceeds being credited on a rejected business sale.
- Add six regression tests covering habits, tradeoffs, persistence, narrative outcomes, rejected proceeds, and old/new ending compatibility.

## 0.3 family and world update — 2026-10-16

- Reduce the stat panel to five visible attributes; keep suspicion and loyalty hidden, with occasional consequential daily incidents.
- Add independently seeded fictional political fluctuations, bounded surveillance/legal strictness and modest domestic risk effects.
- Generate 3–4 automatic childhood entries per year, without additional prompts or mortality rolls.
- Add dating and household-work choices, earlier marriage/parenthood, and optional family-companion selection at departure. Persist outcomes, costs and separation in saves/history/endings.
- Keep old v3 saves compatible; validate optional world and journey fields. Add six social/world regression tests.

## 0.3 pacing update — 2026-10-16

- Replace 100 recurring mundane prompts with annual contextual logs and gradual skill development; retain the original definitions as reference.
- Automatically advance between crossroads, with pause, 3x speed, and skip-to-next controls. Pause on hidden tabs, other views, reload and import.
- Remove the extra result-confirmation click and repeated practice/old-age/care/happiness questions; continue the chosen practice annually.
- Preserve prior repeat markers and immutable saved endings. Add four pacing/replay regression tests and refresh population results.

## 0.3.0 — 2026-10-16

- Import supplied v0.2 implementation into the existing README-only repository on a dedicated branch.
- Unify event eligibility, prerequisite/exclusion rules, repeat timing, choice validation and deterministic progression; prohibit post-death actions.
- Fix skipped infant mortality, expired-event stalls, duplicate event choices, missing family effects and unused-variable build error.
- Add a documented WHO-aggregate-calibrated synthetic mortality model, conditional expectancy and reproducible cohort/gameplay reports.
- Add staged rare careers with residence, citizenship, skill and fictional succession conditions; preserve lifetime achievements.
- Add persistent hidden risk/family state and late-life business, relationship, chronic disease, care, inheritance and happiness events. 143 event definitions, including 100 retained templates.
- Replace contradictory legacy ending axes with 585 fact-based IDs, immutable facts and deterministic fallback prose.
- Add optional server-only AI fact composition, schema checking, disk caching, fallback and local request limits.
- Add v3 save validation/import/export, seed entry, accessible choice availability and future art slots.
- Add CI, regression/API tests, setup/research/verification documentation and deferred graphics backlog.
