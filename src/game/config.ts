/* All tuning in one place. Units are world units (about one CSS pixel at the
   default zoom) and seconds. Heights are measured upwards from the ground. */

export const STORAGE_KEY = 'harni.pier-run.best';

/** Fixed simulation step. Rendering runs at display rate, physics does not. */
export const STEP = 1 / 120;
/** Never simulate more than this in one frame, so a slow frame cannot snowball. */
export const MAX_FRAME = 0.1;

/** The renderer always shows at least this much world (narrow phones, then wide screens). */
export const VIEW = { minWidth: 460, wideWidth: 660, minHeight: 360, groundMargin: 70 } as const;

export const PLAYER = {
  width: 28,
  standHeight: 56,
  duckHeight: 32,
  /** Hitboxes are smaller than the drawing, so near things feel fair. */
  hitInsetX: 6,
  hitInsetY: 4,
  /** Fraction of the view width the runner sits at. */
  anchor: 0.22,
} as const;

export const PHYSICS = {
  gravityUp: 1900,
  /** Pulling harder once the key is let go gives a short hop. */
  cutGravity: 4300,
  gravityDown: 2300,
  fastFallGravity: 5200,
  jumpVelocity: 700,
  airJumpVelocity: 620,
  ballBounceVelocity: 580,
  maxFall: 1100,
  glideGravity: 360,
  glideMaxFall: 140,
  coyote: 0.09,
  buffer: 0.12,
  /** An air jump needs this much height, otherwise the press waits for the ground. */
  airJumpMinHeight: 26,
  landSquash: 0.16,
} as const;

export const PACE = {
  startSpeed: 300,
  maxSpeed: 570,
  /** Calmer cap when the visitor prefers reduced motion. */
  reducedMaxSpeed: 430,
  /** Seconds for the speed ramp to cover about 63% of its range. */
  tau: 75,
  boostMultiplier: 1.28,
  puddleMultiplier: 0.62,
  idleSpeed: 70,
  /** How quickly the speed multiplier eases, per second. */
  easeRate: 5,
  hitKnock: 0.86,
} as const;

export const HEARTS = { start: 3, max: 3, invulnerable: 1.6, shieldInvulnerable: 1.0 } as const;
export const POWER = { glide: 7, boost: 4, boostGrace: 0.6, puddleSlow: 0.9 } as const;
export const COMBO = { window: 2.4, perStep: 4, maxMultiplier: 5 } as const;
export const SCORE = { bookValues: [5, 8, 15], nearMiss: 10, ballBounce: 20, power: 10, spareHeart: 25 } as const;
/** Clearance, in world units, that counts as a near miss. */
export const NEAR_MISS = 8;

export const METRES_PER_UNIT = 0.05;
export const ZONE_METRES = 500;
export const ZONE_BLEND_SECONDS = 1.6;

/** Hazards that lunge only start moving this close, so gaps stay fair. */
export const LUNGE_RANGE = 420;
/** How far past the right edge new things appear. */
export const SPAWN_MARGIN = 140;
/** Things this far behind the runner are forgotten. */
export const CULL_BEHIND = 160;
export const RUN_START_LEAD = 760;
