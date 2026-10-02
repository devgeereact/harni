import { STORAGE_KEY } from './config.ts';

// Consent is deliberately in memory: each visit begins with optional storage off.
let enabled = false;
export const allowScoreStorage = (value: boolean): void => { enabled = value; };

export const readBest = (): number => {
  if (!enabled) return 0;
  try {
    const value = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(value) && value > 0 ? Math.round(value) : 0;
  } catch { return 0; }
};

export const writeBest = (value: number): boolean => {
  if (!enabled || !Number.isFinite(value) || value < 0) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Math.round(value)));
    return true;
  } catch { return false; }
};

// Removal is an explicit user request and does not require permission to read a score.
export const deleteBest = (): boolean => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch { return false; }
};
