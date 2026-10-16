# v0.3 verification

Local environment: Windows, Node 24.19.0, pnpm 11.25.0. Checked 2026-10-16.

## Automated checks

- TypeScript: `tsc -p tsconfig.server.json --noEmit` (browser, API, scripts and tests).
- Vitest: 25 tests passed, engine and actual HTTP/API/cache tests.
- Production Vite build: passed. Browser JS approximately 270 KB uncompressed / 87 KB gzip; no server AI SDK or key in browser bundle.
- Optional Node API SSR build: passed.
- Browser smoke check: seed42 start, nutrition choice, reload persistence, completed-life import, ending API fallback, saved-result reload; no browser warnings/errors observed. Full mobile/device testing is deferred.
- Baseline and actual gameplay population script: passed; results saved to `simulation-results.json`.

Tests include actual age-15 actions, childhood consequences, recruitment and both interview outcomes, expired/repeated events, infancy, no actions after death, all four legendary successes and subsequent life, legal prerequisites, families, 585 distinct fact-to-ID mappings, save/load (including death/AI result), whole-life deterministic replay, mortality guardrails, HTTP validation, concurrent cache requests and persisted fallback across service restarts.

## Baseline lifetime simulation

100,000 mixed seeds, starting seed 123, health70, North Korea, no additional modifiers:

| Measure | Result |
|---|---:|
| Calibrated analytic e0 | 72.6000 years |
| Simulated mean age at death | 72.51873 years |
| Monte Carlo standard error | .057733 years |
| Approx. 95% interval for simulation mean | 72.4056–72.6319 years |
| Conditional expected death age, survived to15 | 74.41314 years |
| Remaining years at15 | 59.41314 years |
| Infant deaths in synthetic model | 1.659% |

The confidence interval describes sampling error of this model, not demographic uncertainty. Infant mortality is a model output, not a measured statistic. Analytic remaining life at15 is59.47405 years; at60 is18.89542 years.

## Actual game simulation

2,000 complete lives, seed9001, uniform random choice among eligible options using a separate RNG stream:

- Mean death age72.62 years.
- Recruited97.9%; interview completed97.65%. Earlier deaths explain most missing common-route completions.
- 26 final careers observed, 245 distinct ending IDs, 142/143 event definitions encountered.
- Legendary achievements0/2000. A rare event's absence is flagged as a coverage limit, not called unreachable.
- All30 careers have executable producing transitions; four rare outcomes tested by searching valid RNG states of qualified fixtures. This is not an exhaustive search of newborn seeds.
- 585 catalog IDs have unique mappings from compatible fact states. This is not 585 independent full-playthrough witnesses.

## External services and remaining checks

- No real AI provider call was made because no key/model was supplied. Validated composition, rejection/fallback, storage and HTTP tests use deterministic providers or no provider.
- CI configuration is included; remote Actions results are checked separately on the PR.
- Age-specific official mortality tables, broad device QA, detailed legal review and exhaustive seeded reachability remain in BACKLOG.
