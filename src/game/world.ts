import { GROUND_Y, PACE, RUNNER, SCORING, SPAWN, WORLD_HEIGHT } from './config';
import type { Box, Intent, World } from './types';

const random = (min: number, max: number): number => min + Math.random() * (max - min);

export const createWorld = (width: number, best: number): World => ({
  status: 'ready',
  width,
  height: WORLD_HEIGHT,
  speed: PACE.startSpeed,
  distance: 0,
  lights: 0,
  score: 0,
  best,
  runner: {
    x: Math.round(width * RUNNER.anchor),
    y: GROUND_Y,
    vy: 0,
    grounded: true,
    ducking: false,
    airborneFor: 0,
    stride: 0,
  },
  obstacles: [],
  collectibles: [],
  nextSpawnAt: 420,
  flash: 0,
  elapsed: 0,
});

/** Re-anchor the runner and keep play sane when the canvas changes shape. */
export const resizeWorld = (world: World, width: number): void => {
  world.width = width;
  world.runner.x = Math.round(width * RUNNER.anchor);
};

export const runnerBox = (world: World): Box => {
  const height = world.runner.ducking && world.runner.grounded ? RUNNER.duckHeight : RUNNER.standHeight;
  return { x: world.runner.x, y: world.runner.y - height, w: RUNNER.width, h: height };
};

const overlaps = (a: Box, b: Box): boolean =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const spawn = (world: World): void => {
  const x = world.width + 40;

  if (Math.random() < SPAWN.gullChance) {
    // Swoops low enough that running upright will not clear it.
    const bottom = random(246, 260);
    world.obstacles.push({ kind: 'gull', x, y: 0, w: random(30, 46), h: bottom });
  } else {
    const h = random(28, 46);
    world.obstacles.push({ kind: 'bench', x, y: GROUND_Y - h, w: random(30, 56), h });
  }

  if (Math.random() < SPAWN.lightChance) {
    // Either a low pick-up or one that has to be jumped for.
    const high = Math.random() < 0.5;
    world.collectibles.push({
      x: x + random(90, 190),
      y: GROUND_Y - (high ? random(96, 132) : random(48, 70)),
      w: 20,
      h: 20,
      taken: false,
      phase: Math.random() * Math.PI * 2,
      fade: 0,
    });
  }

  const gapSeconds = random(SPAWN.minGapSeconds, SPAWN.maxGapSeconds);
  world.nextSpawnAt = world.distance + world.speed * gapSeconds;
};

/** Advances the simulation by one fixed step. Pure apart from mutating `world`. */
export const step = (world: World, intent: Intent, dt: number): void => {
  const { runner } = world;

  if (world.status !== 'running') {
    // Idle jog on the attract screen so the panel is never a still image.
    runner.stride += PACE.startSpeed * dt;
    world.elapsed += dt;
    if (world.flash > 0) world.flash = Math.max(0, world.flash - dt);
    return;
  }

  world.elapsed += dt;
  world.speed = Math.min(PACE.maxSpeed, world.speed + PACE.acceleration * dt);
  const travel = world.speed * dt;
  world.distance += travel;
  runner.stride += travel;
  world.score = world.distance * SCORING.perUnit + world.lights * SCORING.perLight;

  // --- Input -------------------------------------------------------------
  runner.ducking = intent.duck && !intent.jumpHeld;

  const canJump = runner.grounded || runner.airborneFor <= RUNNER.coyoteTime;
  if (intent.jumpPressed && canJump) {
    runner.vy = RUNNER.jumpVelocity;
    runner.grounded = false;
    runner.airborneFor = RUNNER.coyoteTime + 1;
    intent.jumpPressed = false;
  }

  // --- Physics -----------------------------------------------------------
  const rising = runner.vy < 0;
  const gravity = rising && !intent.jumpHeld ? RUNNER.releaseGravity : RUNNER.gravity;
  runner.vy = Math.min(RUNNER.maxFallSpeed, runner.vy + gravity * dt);
  runner.y += runner.vy * dt;

  if (runner.y >= GROUND_Y) {
    runner.y = GROUND_Y;
    runner.vy = 0;
    runner.grounded = true;
    runner.airborneFor = 0;
  } else {
    runner.grounded = false;
    runner.airborneFor += dt;
  }

  // --- Course ------------------------------------------------------------
  if (world.distance >= world.nextSpawnAt) spawn(world);

  for (const obstacle of world.obstacles) obstacle.x -= travel;
  for (const collectible of world.collectibles) {
    collectible.x -= travel;
    collectible.phase += dt * 4;
    if (collectible.taken) collectible.fade += dt;
  }

  world.obstacles = world.obstacles.filter((o) => o.x + o.w > -60);
  world.collectibles = world.collectibles.filter((c) => c.x + c.w > -60 && c.fade < 0.5);

  // --- Contact -----------------------------------------------------------
  const body = runnerBox(world);

  for (const collectible of world.collectibles) {
    if (collectible.taken || !overlaps(body, collectible)) continue;
    collectible.taken = true;
    world.lights += 1;
    world.score += SCORING.perLight;
  }

  for (const obstacle of world.obstacles) {
    if (!overlaps(body, obstacle)) continue;
    world.status = 'over';
    world.flash = 0.45;
    if (world.score > world.best) world.best = Math.round(world.score);
    break;
  }

  if (world.flash > 0) world.flash = Math.max(0, world.flash - dt);
};

export const startRun = (world: World): void => {
  const best = Math.max(world.best, Math.round(world.score));
  const fresh = createWorld(world.width, best);
  Object.assign(world, fresh, { status: 'running' as const });
};
