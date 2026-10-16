# ZIP / repository audit (2026-10-16)

Repository main at intake: `aa8fbed49e06c9d83435b8821b7fa36dd0091749`, README and gitignore only. Work branch: `feat/v0.3-life-simulation`. Imported the supplied ZIP, not a recreated substitute. Synced `sources/` was not edited.

Observed in source (not inferred from README):

| Area | v0.2 code | v0.3 change |
|---|---|---|
| Stack | React 19, Vite 6, TypeScript 5.7, Vitest 2 | Preserved; AI SDK is server-only, Node types for server tests |
| Content | 12 core events + 100 stage/theme templates | Original narratives retained; 143 total definitions after replacing one rare event with staged routes |
| Time | UI chose first unmarked event even if expired; engine had a different scheduler | One eligibility/scheduler path, repeat intervals, dead-state guard |
| RNG | Seeded LCG existed | Preserved, persisted; cohort seeds mixed to reduce adjacent-seed correlation |
| Death | Incremented age before testing; infancy skipped | Test interval [age,age+1), midpoint death age |
| Mortality | Uncalibrated piecewise placeholder | Documented synthetic curve fitted to one WHO period aggregate; not an observed life table |
| Common origin | Recruitment and simulated AI interview existed; prerequisites not enforced | Recruitment required, failed interview still completes that stage |
| Rare routes | Choice itself granted nationality/eligibility flags | Separate migration, residence, naturalization, politics and fictional reform prerequisites |
| Endings | 500 catalog combinations; many careers had no producing choice | 585 fact-based IDs, all careers have producing transitions; sample coverage reported separately |
| Family | `family` initialized but not used by choices | Marital status, relationship score, children, grandchildren, bereavement, inheritance |
| Save | Raw JSON.parse, no validation | v3 schema validation, import/export, RNG and ending retained; old saves preserved, no unsafe automatic migration |
| AI prose | Not connected | Optional server-only constrained composition, disk cache, fallback |
| Build | unused `ti` breaks strict TypeScript | Fixed; build and tests executed |

`src/legacy-events.ts` contains extracted original event definitions. The initial package/footer incorrectly said v0.1; updated to v0.3.
