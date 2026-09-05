/* All tuning in one place. Units are world pixels and seconds; the world is a
   fixed 360 units tall and the renderer scales it to whatever the canvas is. */

export const WORLD_HEIGHT = 360;
export const GROUND_Y = 296;

export const RUNNER = {
  width: 26,
  standHeight: 54,
  duckHeight: 32,
  /** Fraction of the viewport width the runner sits at. */
  anchor: 0.24,
  gravity: 2100,
  /** Extra pull once the jump key is released, for a variable-height jump. */
  releaseGravity: 4200,
  jumpVelocity: -720,
  maxFallSpeed: 1400,
  coyoteTime: 0.09,
  jumpBuffer: 0.12,
} as const;

export const PACE = {
  startSpeed: 330,
  maxSpeed: 900,
  /** Speed gained per second of running. */
  acceleration: 11,
} as const;

export const SPAWN = {
  /** Gap between hazards, expressed in seconds of travel so it stays fair as speed climbs. */
  minGapSeconds: 0.78,
  maxGapSeconds: 1.5,
  /** Chance a spawn is a swooping gull rather than a promenade bench. */
  gullChance: 0.38,
  /** Chance a pier light rides along with a spawn. */
  lightChance: 0.55,
} as const;

export const SCORING = {
  /** Score per world unit travelled. */
  perUnit: 0.1,
  perLight: 25,
} as const;

export const STORAGE_KEY = 'harni.pier-run.best';

export const PALETTE = {
  ink: '#05090e',
  skyHigh: '#101c29',
  skyLow: '#2a4459',
  haze: '#7d919e',
  sea: '#16232f',
  deck: '#0a1119',
  /** Bench bodies: light enough to read against the deck and the railing. */
  slat: '#4a6072',
  gold: '#d9bd7c',
  goldBright: '#f0dda6',
  bone: '#eef2f3',
} as const;
