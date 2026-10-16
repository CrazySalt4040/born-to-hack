# Backlog

## P0 / release-quality validation

- Import and license an authoritative DPRK age/sex/year life table. Current age shape is synthetic, fitted only to WHO 2021 aggregate e0. Add historical cohort changes and sensitivity intervals.
- Find and preserve complete newborn-to-achievement fixed-seed playthroughs for all rare routes; measure targeted strategies as well as random-policy rates. Current tests cover qualified transitions, not exhaustive seed reachability.
- Demonstrate newborn-to-death witnesses for all 585 IDs; current validation proves catalog mapping and samples 245 distinct IDs, not exhaustive reachability.
- Validate detailed Japanese employment/immigration, French/US naturalization and candidate eligibility, rights/disqualification and future-year legal changes. Current system captures principal constraints but abstracts individual review.
- Test optional AI service against a real configured provider. No credentials were used during development. Current AI output composes immutable fact sentences; richer independently authored prose and semantic contradiction checks remain future work.
- Public API hosting needs persistent storage, authentication, distributed quotas and deployment-specific origin/proxy configuration. Current Node API is localhost-only with local rate limiting and per-process AI budget.

## P1 / content and mechanics

- Replace the 100 inherited theme/stage templates with individually authored scenes.
- Model distinct relatives, child ages, caregiver load, multiple marriages, chronic disease severity and attributed death causes.
- Expand career-specific post-achievement governance/production scenes; current rare winners continue through shared late-life events.
- Add optional interactive LLM interview. The existing AI interview is a deterministic choice-based narrative event, not a live model interview.
- Add v0.2 save migration with explicit review of inconsistent legacy states; currently preserve old key and start v3 separately.
- Improve salary, economic conditions, political background and tax/inheritance systems beyond bounded scores.

## Graphics — intentionally deferred for v0.3

- [ ] Title main visual
- [ ] Childhood, youth, adult, middle-age and old-age background images
- [ ] Event-specific icons
- [ ] Simple character portraits
- [ ] Dedicated images for all three legendary families (Paris/NYC variants)
- [ ] Ending screen visual
- [ ] Mobile presentation optimization and device QA
- [ ] Image asset license, author, attribution and provenance register

Use `src/ArtSlot.tsx` for later image injection. It renders nothing without a supplied asset, accepts alt text and lazy-loads images. Title, event and ending slots are present. Existing Lucide icons/CSS are retained; no generated art or external image assets were added.
