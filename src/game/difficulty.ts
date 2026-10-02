import { PACE } from './config.ts';

/** 0 at the start, easing towards 1. Gentle: about 0.5 after 620 metres. */
export const difficultyAt = (metres: number): number => 1 - Math.exp(-Math.max(0, metres) / 900);

/** Target running speed after `seconds` of play, before power-ups and puddles. */
export const baseSpeed = (seconds: number, reducedMotion: boolean): number => {
  const cap = reducedMotion ? PACE.reducedMaxSpeed : PACE.maxSpeed;
  return PACE.startSpeed + (cap - PACE.startSpeed) * (1 - Math.exp(-Math.max(0, seconds) / PACE.tau));
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Seconds of running between the end of one pattern and the start of the next.
 * Measured in time so the breathing room holds as the speed climbs. The floor
 * stays well above a jump's landing time, which is what keeps every run beatable.
 */
export const gapSeconds = (difficulty: number): { min: number; max: number } => ({
  min: lerp(1.15, 0.9, difficulty),
  max: lerp(1.9, 1.2, difficulty),
});
