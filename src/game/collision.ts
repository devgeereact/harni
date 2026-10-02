import { PLAYER } from './config.ts';
import type { Entity, Player } from './types.ts';

const HALF = PLAYER.width / 2;

export const playerTop = (p: Pick<Player, 'y' | 'ducking'>): number =>
  p.y + (p.ducking ? PLAYER.duckHeight : PLAYER.standHeight);

export interface Contact {
  /** Overlaps in the forgiving hitbox. */
  hit: boolean;
  /** Overlaps along the ground at all, ignoring the forgiveness. */
  across: boolean;
  /** Vertical gap between runner and thing, negative when they overlap. */
  separation: number;
}

/** Compares the runner with one entity. `dist` is how far the world has scrolled. */
export const contact = (p: Pick<Player, 'y' | 'ducking'>, e: Entity, dist: number): Contact => {
  const left = e.x - dist;
  const right = left + e.w;
  const across = left < HALF && right > -HALF;
  const insideX = left < HALF - PLAYER.hitInsetX && right > -HALF + PLAYER.hitInsetX;
  const bottom = p.y;
  const top = playerTop(p);
  const separation = Math.max(bottom - (e.y + e.h), e.y - top);
  const insideY = bottom + 2 < e.y + e.h && top - PLAYER.hitInsetY > e.y;
  return { hit: insideX && insideY, across, separation };
};

/** Pickups are a little generous so grabbing them feels good. */
export const reaches = (p: Pick<Player, 'y' | 'ducking'>, e: Entity, dist: number): boolean => {
  const pad = 6;
  const left = e.x - dist;
  return left < HALF + pad && left + e.w > -HALF - pad && p.y < e.y + e.h + pad && playerTop(p) > e.y - pad;
};

/** True once the entity is wholly behind the runner. */
export const isBehind = (e: Entity, dist: number): boolean => e.x - dist + e.w < -HALF;
