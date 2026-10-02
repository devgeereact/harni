import type { Rng } from './rng.ts';

export type Status = 'ready' | 'running' | 'paused' | 'over';

export type HazardKind = 'bench' | 'bin' | 'crab' | 'ball' | 'puddle' | 'gullLow' | 'gullHigh' | 'bunting';
export type PowerKind = 'iceCream' | 'kite' | 'tea';
export type PickupKind = 'book' | 'heart' | PowerKind;
export type EntityKind = HazardKind | PickupKind;

/** One thing on the promenade. `x` is the left edge in distance coordinates, `y` the bottom above ground. */
export interface Entity {
  id: number;
  kind: EntityKind;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Extra speed towards the runner once close (crabs, balls, gulls). */
  drift: number;
  /** Book colour 0 to 2, otherwise unused. */
  variant: number;
  /** Which spawned pattern it belongs to. */
  group: number;
  /** Smallest vertical clearance seen while passing. */
  minSep: number;
  /** Hit, passed, collected or otherwise finished with. */
  resolved: boolean;
}

export interface Intent {
  jumpHeld: boolean;
  /** One-shot press edge. The simulation clears it. */
  jumpPressed: boolean;
  duck: boolean;
}

export interface Player {
  /** Feet height above the ground. */
  y: number;
  /** Upwards speed. */
  vy: number;
  grounded: boolean;
  ducking: boolean;
  coyote: number;
  buffer: number;
  airJumps: number;
  /** Seconds left of the landing squash. */
  squash: number;
  /** Seconds left of the hurt pose. */
  hurt: number;
}

export interface PowerState {
  shield: boolean;
  glide: number;
  boost: number;
}

export interface ComboState {
  count: number;
  timer: number;
}

export type EventType =
  | 'start' | 'jump' | 'airJump' | 'land' | 'book' | 'heart' | 'power' | 'hit' | 'shieldBreak'
  | 'smash' | 'bounce' | 'near' | 'puddle' | 'zone' | 'comboLost' | 'over';

export interface GameEvent {
  type: EventType;
  /** Meaning depends on the type: book value, hearts left, zone index and so on. */
  value: number;
}

export interface ZoneState {
  index: number;
  previous: number;
  /** 0 just changed, 1 fully settled. */
  blend: number;
}

export interface Spawner {
  cursor: number;
  patterns: number;
  sinceRest: number;
  sinceHeart: number;
  sincePower: number;
  nextId: number;
}

export interface World {
  status: Status;
  seed: number;
  rng: Rng;
  reducedMotion: boolean;
  /** Width of the visible world, used to decide how far ahead to spawn. */
  viewWidth: number;
  time: number;
  dist: number;
  metres: number;
  speed: number;
  slow: number;
  grace: number;
  player: Player;
  hearts: number;
  invulnerable: number;
  power: PowerState;
  combo: ComboState;
  bonus: number;
  score: number;
  books: number;
  nearMisses: number;
  best: number;
  newBest: boolean;
  entities: Entity[];
  spawner: Spawner;
  zone: ZoneState;
  events: GameEvent[];
}
