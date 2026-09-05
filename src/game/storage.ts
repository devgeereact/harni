import { STORAGE_KEY } from './config';

/* localStorage can throw outright (private windows, blocked site data) as well
   as return nothing, so every access is guarded and the caller gets a number. */

export const readBest = (): number => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const value = Number.parseInt(raw, 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
};

export const writeBest = (value: number): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Math.round(value)));
  } catch {
    // Score keeping is a convenience; losing it must never break play.
  }
};
