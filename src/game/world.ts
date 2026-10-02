import {
  CULL_BEHIND, HEARTS, PHYSICS, LUNGE_RANGE, METRES_PER_UNIT, NEAR_MISS, PACE, POWER, RUN_START_LEAD, SCORE, ZONE_BLEND_SECONDS,
} from './config.ts';
import { contact, isBehind, reaches } from './collision.ts';
import { baseSpeed, difficultyAt } from './difficulty.ts';
import { isHazard } from './entities.ts';
import { createPlayer, stepPlayer } from './physics.ts';
import { createRng } from './rng.ts';
import { bookValue, bumpCombo, resetCombo, tickCombo } from './scoring.ts';
import { createSpawner, spawnAhead } from './spawner.ts';
import { zoneIndexAt } from './zones.ts';
import type { Entity, EventType, Intent, PowerKind, World } from './types.ts';

export interface WorldOptions {
  seed?: number;
  best?: number;
  reducedMotion?: boolean;
  viewWidth?: number;
}

const fresh = (seed: number, best: number, reducedMotion: boolean, viewWidth: number): World => ({
  status: 'ready',
  seed,
  rng: createRng(seed),
  reducedMotion,
  viewWidth,
  time: 0,
  dist: 0,
  metres: 0,
  speed: baseSpeed(0, reducedMotion),
  slow: 0,
  grace: 0,
  player: createPlayer(),
  hearts: HEARTS.start,
  invulnerable: 0,
  power: { shield: false, glide: 0, boost: 0 },
  combo: { count: 0, timer: 0 },
  bonus: 0,
  score: 0,
  books: 0,
  nearMisses: 0,
  best,
  newBest: false,
  entities: [],
  spawner: createSpawner(RUN_START_LEAD),
  zone: { index: 0, previous: 0, blend: 1 },
  events: [],
});

export const createWorld = (options: WorldOptions = {}): World =>
  fresh(options.seed ?? 1, options.best ?? 0, options.reducedMotion ?? false, options.viewWidth ?? 800);

/** Begins (or restarts) a run. Keeps the best score, view size and motion setting. */
export const startRun = (w: World, seed: number): void => {
  const next = fresh(seed, w.best, w.reducedMotion, w.viewWidth);
  Object.assign(w, next);
  w.status = 'running';
  w.events.push({ type: 'start', value: 0 });
  spawnAhead(w.spawner, w.entities, w.rng, spawnContext(w));
};

export const resize = (w: World, viewWidth: number): void => {
  w.viewWidth = viewWidth;
};

const spawnContext = (w: World) => ({
  dist: w.dist,
  viewWidth: w.viewWidth,
  speed: w.speed,
  difficulty: difficultyAt(w.metres),
  hearts: w.hearts,
  maxHearts: HEARTS.max,
  shieldHeld: w.power.shield,
});

const emit = (w: World, type: EventType, value = 0): void => {
  w.events.push({ type, value });
};

const invincible = (w: World): boolean => w.invulnerable > 0 || w.power.boost > 0 || w.grace > 0;

const applyPower = (w: World, kind: PowerKind): void => {
  if (kind === 'iceCream') w.power.shield = true;
  else if (kind === 'kite') w.power.glide = POWER.glide;
  else w.power.boost = POWER.boost;
  const mult = bumpCombo(w.combo);
  w.bonus += SCORE.power * mult;
  emit(w, 'power', kind === 'iceCream' ? 0 : kind === 'kite' ? 1 : 2);
};

const takeHit = (w: World, e: Entity): void => {
  e.resolved = true;
  if (w.power.shield) {
    w.power.shield = false;
    w.invulnerable = HEARTS.shieldInvulnerable;
    emit(w, 'shieldBreak');
    return;
  }
  w.hearts -= 1;
  w.invulnerable = HEARTS.invulnerable;
  w.player.hurt = 0.5;
  w.speed *= PACE.hitKnock;
  if (w.combo.count > 0) emit(w, 'comboLost');
  resetCombo(w.combo);
  emit(w, 'hit', w.hearts);
  if (w.hearts <= 0) finish(w);
};

const finish = (w: World): void => {
  w.status = 'over';
  w.score = Math.floor(w.metres) + Math.round(w.bonus);
  w.newBest = w.score > w.best;
  if (w.newBest) w.best = w.score;
  emit(w, 'over', w.score);
};

const handleEntity = (w: World, e: Entity): boolean => {
  if (isHazard(e.kind)) {
    if (e.resolved) return true;
    const c = contact(w.player, e, w.dist);
    if (e.kind === 'puddle') {
      if (c.hit) {
        e.resolved = true;
        if (!invincible(w)) w.slow = POWER.puddleSlow;
        emit(w, 'puddle');
      }
      return true;
    }
    if (c.hit) {
      // A falling landing on a beach ball gives a friendly spring and a score bonus.
      // Side hits still cost a heart. The narrow landing window avoids accidental bounces.
      if (e.kind === 'ball' && w.player.vy < 0 && !w.player.grounded && w.player.y >= e.y + e.h - 12) {
        w.player.y = e.y + e.h;
        w.player.vy = PHYSICS.ballBounceVelocity;
        w.player.airJumps = 0;
        w.player.ducking = false;
        w.bonus += SCORE.ballBounce * bumpCombo(w.combo);
        emit(w, 'bounce');
        return false;
      }
      if (w.power.boost > 0) {
        e.resolved = true;
        emit(w, 'smash');
      } else if (!invincible(w)) takeHit(w, e);
    } else if (c.across && c.separation >= 0) {
      e.minSep = Math.min(e.minSep, c.separation);
    }
    if (!e.resolved && isBehind(e, w.dist)) {
      e.resolved = true;
      if (e.minSep >= 0 && e.minSep < NEAR_MISS) {
        w.nearMisses += 1;
        const mult = bumpCombo(w.combo);
        w.bonus += SCORE.nearMiss * mult;
        emit(w, 'near', mult);
      }
    }
    return true;
  }
  if (!reaches(w.player, e, w.dist)) return true;
  if (e.kind === 'book') {
    const mult = bumpCombo(w.combo);
    w.books += 1;
    w.bonus += bookValue(e.variant) * mult;
    emit(w, 'book', mult);
  } else if (e.kind === 'heart') {
    if (w.hearts < HEARTS.max) w.hearts += 1;
    else w.bonus += SCORE.spareHeart;
    emit(w, 'heart', w.hearts);
  } else {
    applyPower(w, e.kind);
  }
  return false;
};

/** Advances a running game by one fixed step. Does nothing in any other state. */
export const step = (w: World, intent: Intent, dt: number): void => {
  if (w.status !== 'running') return;
  w.time += dt;

  // Speed eases towards its target so boosts and puddles feel smooth.
  let multiplier = 1;
  if (w.power.boost > 0) multiplier *= PACE.boostMultiplier;
  if (w.slow > 0) multiplier *= PACE.puddleMultiplier;
  const target = baseSpeed(w.time, w.reducedMotion) * multiplier;
  w.speed += (target - w.speed) * Math.min(1, PACE.easeRate * dt);
  w.dist += w.speed * dt;
  w.metres = w.dist * METRES_PER_UNIT;

  const result = stepPlayer(w.player, intent, dt, {
    doubleJump: true,
    glide: w.power.glide > 0,
  });
  if (result.jumped === 'ground') emit(w, 'jump');
  else if (result.jumped === 'air') emit(w, 'airJump');
  if (result.landed) emit(w, 'land');

  // Lunging hazards only start moving once they are close, which keeps gaps honest.
  for (const e of w.entities) {
    if (e.drift !== 0 && e.x - w.dist < LUNGE_RANGE) e.x -= e.drift * dt;
  }
  const kept: Entity[] = [];
  for (const e of w.entities) {
    if (handleEntity(w, e) && e.x - w.dist + e.w > -CULL_BEHIND) kept.push(e);
    if (w.status !== 'running') break;
  }
  if (w.status !== 'running') {
    w.score = Math.floor(w.metres) + Math.round(w.bonus);
    return;
  }
  w.entities = kept;

  spawnAhead(w.spawner, w.entities, w.rng, spawnContext(w));

  w.invulnerable = Math.max(0, w.invulnerable - dt);
  w.slow = Math.max(0, w.slow - dt);
  w.grace = Math.max(0, w.grace - dt);
  w.power.glide = Math.max(0, w.power.glide - dt);
  if (w.power.boost > 0) {
    w.power.boost = Math.max(0, w.power.boost - dt);
    if (w.power.boost === 0) w.grace = POWER.boostGrace;
  }
  if (tickCombo(w.combo, dt)) emit(w, 'comboLost');

  const zone = zoneIndexAt(w.metres);
  if (zone !== w.zone.index) {
    w.zone.previous = w.zone.index;
    w.zone.index = zone;
    w.zone.blend = 0;
    emit(w, 'zone', zone);
  } else if (w.zone.blend < 1) {
    w.zone.blend = Math.min(1, w.zone.blend + dt / ZONE_BLEND_SECONDS);
  }

  w.score = Math.floor(w.metres) + Math.round(w.bonus);
};

/** Gentle scroll for the title screen. The runner jogs on the spot. */
export const idle = (w: World, dt: number): void => {
  if (w.status === 'running' || w.reducedMotion) return;
  w.dist += PACE.idleSpeed * dt;
  w.time += dt;
};

export const pause = (w: World): boolean => {
  if (w.status !== 'running') return false;
  w.status = 'paused';
  return true;
};

export const resume = (w: World): boolean => {
  if (w.status !== 'paused') return false;
  w.status = 'running';
  return true;
};

export const drainEvents = (w: World): ReadonlyArray<{ type: EventType; value: number }> => {
  const events = w.events.slice();
  w.events.length = 0;
  return events;
};
