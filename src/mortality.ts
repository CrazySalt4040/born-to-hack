/** Synthetic PERIOD model, both sexes. Age shape/risk modifiers are assumptions.
 * Fitted to WHO 2021 e0=72.6, NOT observed qx or a 1998 cohort forecast. */
export const mortalitySource = {
  year: 2021, sex: 'both sexes', targetE0: 72.6,
  url: 'https://cdn.who.int/media/docs/default-source/searo/his/hrh-profiles/dpr-korea_hrh_countryprofile_final_09232024.pdf',
  method: 'Synthetic age curve, scalar hazard fitted to period e0; midpoint deaths, terminal age 120',
} as const;
function shape(age: number): number {
  if (age === 0) return .017;
  if (age < 5) return .0015;
  if (age < 15) return .00035;
  return .00055 + .00075 * Math.exp((age - 30) / 10.5);
}
function q(age: number, scale: number) { return age >= 119 ? 1 : -Math.expm1(-shape(age) * scale); }
function expectation(scale: number, from = 0) {
  let survival = 1, years = 0;
  for (let age = from; age < 120; age++) {
    const rate = q(age, scale);
    years += survival * (1 - rate / 2); survival *= 1 - rate;
  }
  return years;
}
let low = .01, high = 20;
for (let i = 0; i < 80; i++) {
  const mid = (low + high) / 2;
  if (expectation(mid) > mortalitySource.targetE0) low = mid; else high = mid;
}
export const hazardScale = (low + high) / 2;
export const remainingLifeExpectancy = (age = 0) => expectation(hazardScale, age);
export type Risks = {nutrition: number; medical: number; stress: number; childhoodHealth: number};
export function mortality(age: number, health = 70, country = '北朝鮮', risks?: Risks, flags: string[] = []): number {
  if (!Number.isFinite(age) || age < 0) throw Error('Invalid age');
  let factor = Math.exp((70 - health) / 110) * (country === '北朝鮮' ? 1 : .85);
  if (risks) factor *= Math.exp((50-risks.nutrition)/250+(50-risks.medical)/250+risks.stress/350+(70-risks.childhoodHealth)/400);
  if (flags.includes('chronic')) factor *= 1.35;
  if (flags.includes('imprisoned')) factor *= 1.8;
  if (flags.includes('hazardous_work')) factor *= 1.15;
  return age >= 119 ? 1 : -Math.expm1(-shape(age) * hazardScale * factor);
}
