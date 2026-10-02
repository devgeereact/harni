/** Small seeded random generator (mulberry32), so a run can be replayed and tested. */
export interface Rng {
  /** Float in [0, 1). */
  next: () => number;
  range: (min: number, max: number) => number;
  /** Integer in [0, n). */
  int: (n: number) => number;
  chance: (p: number) => boolean;
}

export const createRng = (seed: number): Rng => {
  let a = seed >>> 0;
  const next = (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (min, max) => min + (max - min) * next(),
    int: (n) => Math.floor(next() * Math.max(1, n)),
    chance: (p) => next() < p,
  };
};

/** Cheap deterministic hash to [0, 1), for scenery that must not change between frames. */
export const hash01 = (index: number, salt = 0): number => {
  let h = Math.imul(index | 0, 0x27d4eb2d) ^ Math.imul((salt | 0) + 0x165667b1, 0x85ebca6b);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12;
  return ((h >>> 0) % 100000) / 100000;
};
