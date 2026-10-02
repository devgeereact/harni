import { COMBO, SCORE } from './config.ts';
import type { ComboState } from './types.ts';

export const comboMultiplier = (count: number): number =>
  Math.min(COMBO.maxMultiplier, 1 + Math.floor(Math.max(0, count) / COMBO.perStep));

/** Register a pickup or near miss. Returns the multiplier to score it at. */
export const bumpCombo = (combo: ComboState): number => {
  combo.count += 1;
  combo.timer = COMBO.window;
  return comboMultiplier(combo.count);
};

/** Returns true on the frame the chain runs out. */
export const tickCombo = (combo: ComboState, dt: number): boolean => {
  if (combo.count === 0) return false;
  combo.timer -= dt;
  if (combo.timer > 0) return false;
  combo.count = 0;
  combo.timer = 0;
  return true;
};

export const resetCombo = (combo: ComboState): void => {
  combo.count = 0;
  combo.timer = 0;
};

export const bookValue = (variant: number): number => SCORE.bookValues[Math.max(0, Math.min(2, Math.floor(variant)))] ?? 10;
