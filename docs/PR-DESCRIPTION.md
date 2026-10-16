# v0.3: import prototype and stabilize deterministic life simulation

The repository contained only its initial README. This change imports the supplied v0.2 React/Vite/TypeScript game and fixes progression stalls, skipped infant mortality, unenforced event conditions and incomplete career/family state.

The engine now owns event scheduling, outcomes, history, death and 585 fact-based ending IDs. Added late-life scenes, staged legal/fictional prerequisites for the three rare career families, validated v3 saves, optional server-only AI composition with persistent fallback/cache, and CI. Original event narratives are preserved. The 100 repetitive supplemental prompts are archived outside the decision queue: annual daily-life logs now advance automatically between 44 crossroads, with pause, 3x speed and skip-to-next controls. Practice continues annually from one chosen focus; recurring old-age prompts and result-confirmation clicks are removed. New graphics are deliberately deferred.

Validation: 41 Vitest tests pass; browser/server TypeScript checks and production builds pass. Browser smoke checks cover new life, choice, reload, completed-save import and persisted endpoint fallback. 100,000 baseline lives average72.51873 years against analytic72.6; 2,000 full games average69.794, observe186 IDs and26 careers. All30 careers have tested producing transitions, and all4 rare successes continue living.

Limitations: age-specific mortality remains synthetic, calibrated to WHO2021 both-sex e0 rather than an official age/sex life table. The random-policy cohort observes no legendary achievement. Qualified-transition witnesses do not establish complete newborn fixed-seed paths for every rare route/ending. AI is constrained sentence composition; no real provider call was tested without credentials. Detailed legal modeling, full seeded reachability and graphics remain in `docs/BACKLOG.md`.

See `docs/AUDIT-v0.2.md`, `docs/MORTALITY.md`, `docs/RARE-ROUTES.md`, `docs/VERIFICATION.md` and `docs/simulation-results.json` for evidence and scope.

The interface now shows five stats. Hidden suspicion/loyalty influence occasional daily incidents; independent fictional political changes slightly shift domestic scrutiny and risky outcomes. Childhood years contain 3–4 automatic entries. Dating, marriage, parenting, household work and family-companion selection add simple personal decisions with persisted consequences. Existing v3 saves remain supported.

Choices now show qualitative likelihood and narrate actual consequences. Persistent daily time/spending preferences affect annual development and resources, and editing pauses automatic progress. Assets display as a documented fictional USD valuation; old saved ending prose is retained. Rejected business sales no longer award proceeds.
