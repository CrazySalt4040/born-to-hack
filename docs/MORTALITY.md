# Mortality model v0.3

## Evidence and limits

Reference: WHO, Democratic People's Republic of Korea HRH country profile (2024), **2021 life expectancy at birth: 72.6 years**, both sexes combined. [WHO PDF](https://cdn.who.int/media/docs/default-source/searo/his/hrh-profiles/dpr-korea_hrh_countryprofile_final_09232024.pdf?sfvrsn=3db384d8_3); corroborating [WHO country indicator](https://www.who.int/data/gho/data/countries/country-details/GHO/democratic-people%27s-republic-of-korea?countryProfileId=f9396807-7886-4350-87e0-889f93e1fcbe).

This is a **period** expectation: it assumes the mortality conditions of the reference period persist over a hypothetical lifetime. The protagonist's birth year 1998 does NOT make this a measured or forecast 1998 cohort life table. No sex-specific mortality is implemented. The single aggregate cannot identify the real age curve. The age-specific hazards below and ALL risk multipliers are **game design assumptions**, not measured North Korean statistics.

## Reproducible calculation

`src/mortality.ts` defines an annual synthetic hazard h(x):

- age 0: .017; ages 1–4: .0015; ages 5–14: .00035.
- ages 15+: .00055 + .00075 × exp((x−30)/10.5).
- q(x) = 1 − exp(−scale × h(x)). At 119, q=1 (explicit game ceiling).
- Death occurs at the interval midpoint x+.5. Survivors advance to x+1. Infancy is therefore included.
- Binary search fits scale so Σ survival(x) × (1 − q(x)/2) = 72.6. This gives approximately .992808876.
- Conditional remaining years at age a restart survival at a. Expected age at death conditional on reaching 15 is **15 + e15**, not e15 itself.

Base calibration assumes health 70, North Korean residence, and no modifiers. Health uses exp((70−health)/110); foreign residence multiplies hazard by .85. Nutrition/medical access/stress/childhood health contribute exponential modifiers; chronic disease ×1.35, imprisonment ×1.8, hazardous work/accident exposure ×1.15. These are bounded game inputs, not causal estimates. Hazards include all causes: no claim is made about an individual's actual cause of death. Country effects are deliberately simplified rather than falsely precise country tables.

Childhood choices persist in `risks.childhoodHealth`, nutrition and flags. Annual aging reduces health after 55. Treatment and care affect health/access, and migration immediately changes the residence multiplier. Hazard conversion keeps probabilities in [0,1].

## Validation

Run `pnpm simulate`. Machine-readable output: [simulation-results.json](simulation-results.json). 100,000 independently mixed seeds test the baseline, then 2,000 full games use a separate uniform eligible-choice RNG. Gameplay mortality is not expected to equal the calibration population because health, decisions, migration and family differ.

CI asserts baseline mean within four Monte Carlo standard errors of 72.6, conditional-age arithmetic, nonzero infant deaths, rising old-age risk, deterministic replay, and broad full-game guardrails. Passing these tests verifies the implemented assumptions, **not the accuracy of North Korean age-specific mortality**. Real age/sex/year tables, uncertainty bounds and historical famine/cohort effects remain release-quality work.
