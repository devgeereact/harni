import { SPAWN_MARGIN, RUN_START_LEAD } from './config.ts';
import { gapSeconds } from './difficulty.ts';
import { makeEntity, SHAPES } from './entities.ts';
import type { Rng } from './rng.ts';
import type { Entity, EntityKind, HazardKind, PowerKind, Spawner } from './types.ts';

/*
 * Fair spawning. Every obstacle comes from a hand-made pattern whose parts are
 * spaced for the speed at the time. Between patterns there is always a gap of
 * at least 0.9 seconds of running, which is longer than a jump needs to land
 * and set up again. Tokens are laid along the arc a good jump would take.
 */

interface Item {
  kind: EntityKind;
  dx: number;
  y?: number;
  variant?: number;
}

interface Built {
  items: Item[];
  /** Pattern width from its first to its last item. */
  extent: number;
}

export interface SpawnContext {
  dist: number;
  viewWidth: number;
  speed: number;
  difficulty: number;
  hearts: number;
  maxHearts: number;
  shieldHeld: boolean;
}

export const createSpawner = (start = RUN_START_LEAD): Spawner => ({
  cursor: start, patterns: 0, sinceRest: 0, sinceHeart: 0, sincePower: 0, nextId: 1,
});

type PatternId = 'single' | 'puddle' | 'bunting' | 'gullLow' | 'gullHigh' | 'double' | 'mix' | 'rest';

interface Option {
  id: PatternId;
  from: number;
  weight: number;
}

const OPTIONS: readonly Option[] = [
  { id: 'single', from: 0, weight: 5 },
  { id: 'puddle', from: 0, weight: 1.5 },
  { id: 'bunting', from: 0.04, weight: 2.5 },
  { id: 'gullLow', from: 0.1, weight: 2 },
  { id: 'gullHigh', from: 0.16, weight: 1.5 },
  { id: 'double', from: 0.22, weight: 2 },
  { id: 'mix', from: 0.3, weight: 2 },
  { id: 'rest', from: 0, weight: 1.2 },
];

const pickPattern = (s: Spawner, d: number, rng: Rng): PatternId => {
  if (s.patterns === 0) return 'rest';
  if (s.patterns === 1) return 'single';
  if (s.sinceRest >= 4) return 'rest';
  const pool = OPTIONS.filter((o) => d >= o.from);
  const total = pool.reduce((sum, o) => sum + o.weight, 0);
  let roll = rng.next() * total;
  for (const o of pool) {
    roll -= o.weight;
    if (roll <= 0) return o.id;
  }
  return 'single';
};

const groundHazard = (d: number, rng: Rng): HazardKind => {
  const pool: HazardKind[] = ['bench', 'bin'];
  if (d > 0.08) pool.push('crab');
  if (d > 0.15) pool.push('ball');
  return pool[rng.int(pool.length)] ?? 'bench';
};

const bookVariant = (rng: Rng): number => {
  const r = rng.next();
  return r < 0.6 ? 0 : r < 0.9 ? 1 : 2;
};

/** Books along the arc of a good jump, centred on `centre`. */
const arc = (centre: number, span: number, count: number, base: number, peak: number, variant: number): Item[] => {
  const items: Item[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    items.push({ kind: 'book', dx: centre + (t - 0.5) * span, y: base + peak * 4 * t * (1 - t), variant });
  }
  return items;
};

const row = (from: number, count: number, spacing: number, y: number, variant: number): Item[] =>
  Array.from({ length: count }, (_, i) => ({ kind: 'book' as const, dx: from + i * spacing, y, variant }));

const width = (kind: EntityKind): number => SHAPES[kind].w;

const build = (id: PatternId, speed: number, d: number, rng: Rng): Built => {
  const items: Item[] = [];
  const variant = bookVariant(rng);
  switch (id) {
    case 'single': {
      const kind = groundHazard(d, rng);
      const w = width(kind);
      items.push({ kind, dx: 0 });
      if (rng.chance(0.75)) items.push(...arc(w / 2, Math.max(speed * 0.5, w + 120), 5, 18, 78, variant));
      break;
    }
    case 'puddle': {
      items.push({ kind: 'puddle', dx: 0 });
      if (rng.chance(0.6)) items.push(...arc(36, 200, 4, 14, 52, variant));
      break;
    }
    case 'bunting': {
      items.push({ kind: 'bunting', dx: 0 });
      items.push(...row(14, 6, 24, 8, variant));
      break;
    }
    case 'gullLow': {
      items.push({ kind: 'gullLow', dx: 0 });
      items.push(...row(-30, 5, 28, 8, variant));
      break;
    }
    case 'gullHigh': {
      items.push({ kind: 'gullHigh', dx: 0 });
      items.push(...row(-20, 5, 26, 10, variant));
      break;
    }
    case 'double': {
      // Two low things close enough to clear in one held jump. Never two benches: too wide.
      const pairs: ReadonlyArray<readonly [HazardKind, HazardKind]> = [['bin', 'bin'], ['bin', 'bench'], ['bench', 'bin']];
      const [first, second] = pairs[rng.int(pairs.length)] ?? (['bin', 'bin'] as const);
      const gap = speed * 0.12;
      items.push({ kind: first, dx: 0 }, { kind: second, dx: width(first) + gap });
      const span = width(first) + gap + width(second);
      items.push(...arc(span / 2, Math.max(span + 110, speed * 0.55), 6, 24, 74, variant));
      break;
    }
    case 'mix': {
      // A jump, then a duck. 1.05 seconds between starts leaves room to land and react.
      const ground: HazardKind = rng.chance(0.5) ? 'bench' : 'bin';
      const low: HazardKind = rng.chance(0.55) ? 'bunting' : 'gullLow';
      const reverse = rng.chance(0.4);
      const offset = width(reverse ? low : ground) + speed * 1.05;
      if (reverse) items.push({ kind: low, dx: 0 }, { kind: ground, dx: offset });
      else items.push({ kind: ground, dx: 0 }, { kind: low, dx: offset });
      items.push(...arc(width(ground) / 2 + (reverse ? offset : 0), 180, 4, 20, 64, variant));
      break;
    }
    case 'rest': {
      // A breather: a lazy wave of books, no hazards.
      const count = 8 + rng.int(4);
      for (let i = 0; i < count; i++) {
        items.push({ kind: 'book', dx: i * 34, y: 22 + 32 * (0.5 + 0.5 * Math.sin(i * 0.8)), variant });
      }
      break;
    }
  }
  return normalise(items);
};

const normalise = (items: Item[]): Built => {
  const min = Math.min(...items.map((i) => i.dx));
  let max = 0;
  const shifted = items.map((i) => {
    const dx = i.dx - min;
    max = Math.max(max, dx + width(i.kind));
    return { ...i, dx };
  });
  return { items: shifted, extent: max };
};

const POWERS: readonly PowerKind[] = ['iceCream', 'kite', 'tea'];

/** Swap the middle book of a pattern for a heart or a power-up when one is due. */
const decorate = (built: Built, s: Spawner, ctx: SpawnContext, rng: Rng): void => {
  const books = built.items.filter((i) => i.kind === 'book');
  const middle = books[Math.floor(books.length / 2)];
  if (!middle || books.length < 4) return;
  const heartDue = ctx.hearts < ctx.maxHearts && s.sinceHeart >= (ctx.hearts <= 1 ? 6 : 11);
  const powerDue = s.sincePower >= 7 && ctx.difficulty > 0.12;
  if (heartDue && rng.chance(0.5)) {
    middle.kind = 'heart';
    s.sinceHeart = 0;
  } else if (powerDue && rng.chance(0.5)) {
    const pool = ctx.shieldHeld ? POWERS.filter((k) => k !== 'iceCream') : POWERS;
    middle.kind = pool[rng.int(pool.length)] ?? 'tea';
    middle.y = Math.max(middle.y ?? 0, 30);
    s.sincePower = 0;
  }
};

/** Adds patterns until the world is filled a little beyond the right edge. */
export const spawnAhead = (s: Spawner, out: Entity[], rng: Rng, ctx: SpawnContext): void => {
  const limit = ctx.dist + ctx.viewWidth + SPAWN_MARGIN;
  while (s.cursor < limit) {
    const id = pickPattern(s, ctx.difficulty, rng);
    const built = build(id, ctx.speed, ctx.difficulty, rng);
    decorate(built, s, ctx, rng);
    const group = s.patterns;
    for (const item of built.items) {
      out.push(makeEntity(s.nextId++, item.kind, s.cursor + item.dx, item.y ?? null, group, item.variant ?? 0));
    }
    s.patterns += 1;
    s.sinceRest = id === 'rest' ? 0 : s.sinceRest + 1;
    s.sinceHeart += 1;
    s.sincePower += 1;
    const gap = gapSeconds(ctx.difficulty);
    s.cursor += built.extent + ctx.speed * rng.range(gap.min, gap.max);
  }
};
