export function random(seed: number): [number, number] {
  const next = (Math.imul(1664525, seed) + 1013904223) >>> 0;
  return [next / 4294967296, next];
}
/** Mix independent seeds to avoid correlated infant deaths from adjacent seeds. */
export function mixSeed(n: number) {
  n = Math.imul(n ^ (n >>> 16), 0x21f0aaad);
  n = Math.imul(n ^ (n >>> 15), 0x735a2d97);
  return (n ^ (n >>> 15)) >>> 0;
}
