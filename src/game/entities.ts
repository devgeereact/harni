import type { Entity, EntityKind, HazardKind } from './types.ts';

interface Shape {
  w: number;
  h: number;
  y: number;
  drift: number;
}

export const SHAPES: Record<EntityKind, Shape> = {
  bench: { w: 58, h: 30, y: 0, drift: 0 },
  bin: { w: 24, h: 40, y: 0, drift: 0 },
  crab: { w: 34, h: 18, y: 0, drift: 60 },
  ball: { w: 30, h: 30, y: 0, drift: 100 },
  puddle: { w: 72, h: 4, y: 0, drift: 0 },
  gullLow: { w: 42, h: 22, y: 44, drift: 50 },
  gullHigh: { w: 42, h: 22, y: 80, drift: 50 },
  bunting: { w: 150, h: 22, y: 42, drift: 0 },
  book: { w: 18, h: 22, y: 0, drift: 0 },
  heart: { w: 24, h: 22, y: 0, drift: 0 },
  iceCream: { w: 26, h: 34, y: 0, drift: 0 },
  kite: { w: 30, h: 34, y: 0, drift: 0 },
  tea: { w: 28, h: 28, y: 0, drift: 0 },
};

const HAZARDS: ReadonlySet<EntityKind> = new Set<HazardKind>([
  'bench', 'bin', 'crab', 'ball', 'puddle', 'gullLow', 'gullHigh', 'bunting',
]);

export const isHazard = (kind: EntityKind): kind is HazardKind => HAZARDS.has(kind);

export const makeEntity = (id: number, kind: EntityKind, x: number, y: number | null, group: number, variant = 0): Entity => {
  const shape = SHAPES[kind];
  return {
    id,
    kind,
    x,
    y: y ?? shape.y,
    w: shape.w,
    h: shape.h,
    drift: shape.drift,
    variant,
    group,
    minSep: Number.POSITIVE_INFINITY,
    resolved: false,
  };
};
