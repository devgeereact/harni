import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HEARTS, LUNGE_RANGE, PLAYER } from '../../src/game/config.ts';
import { difficultyAt } from '../../src/game/difficulty.ts';
import { isHazard, makeEntity } from '../../src/game/entities.ts';
import { createRng } from '../../src/game/rng.ts';
import { createSpawner, spawnAhead } from '../../src/game/spawner.ts';
import { createWorld, drainEvents, idle, pause, resume, startRun, step } from '../../src/game/world.ts';
import type { Entity, Intent, World } from '../../src/game/types.ts';

const DT = 1 / 120;
const idleIntent = (): Intent => ({ jumpHeld: false, jumpPressed: false, duck: false });

const kinds = (entities: Entity[]): Set<string> => new Set(entities.map((e) => e.kind));

test('a new world is ready and does nothing until a run starts', () => {
  const w = createWorld({ seed: 3 });
  assert.equal(w.status, 'ready');
  step(w, idleIntent(), DT);
  assert.equal(w.dist, 0);
  startRun(w, 3);
  assert.equal(w.status, 'running');
  assert.equal(w.hearts, HEARTS.start);
  assert.ok(w.entities.length > 0);
  assert.ok(drainEvents(w).some((e) => e.type === 'start'));
});

test('pause freezes the simulation and resume continues it', () => {
  const w = createWorld({ seed: 4 });
  startRun(w, 4);
  for (let i = 0; i < 60; i++) step(w, idleIntent(), DT);
  assert.equal(pause(w), true);
  const dist = w.dist;
  for (let i = 0; i < 60; i++) step(w, idleIntent(), DT);
  assert.equal(w.dist, dist);
  assert.equal(resume(w), true);
  step(w, idleIntent(), DT);
  assert.ok(w.dist > dist);
  assert.equal(pause(createWorld()), false);
});

test('idle scroll moves the title scene only when motion is welcome', () => {
  const calm = createWorld({ reducedMotion: true });
  idle(calm, 1);
  assert.equal(calm.dist, 0);
  const lively = createWorld();
  idle(lively, 1);
  assert.ok(lively.dist > 0);
});

test('running into a bench costs one heart, then a brief grace, then game over at zero', () => {
  const w = createWorld({ seed: 5, best: 10 });
  startRun(w, 5);
  w.entities = [];
  w.spawner.cursor = 1e9;
  const bench = (): void => { w.entities.push(makeEntity(99 + w.entities.length, 'bench', w.dist + 10, null, 0)); };
  bench();
  step(w, idleIntent(), DT);
  assert.equal(w.hearts, HEARTS.start - 1);
  assert.ok(w.invulnerable > 1);
  assert.equal(w.status, 'running');
  // grace period: another bench straight away does not cost a heart
  bench();
  step(w, idleIntent(), DT);
  assert.equal(w.hearts, HEARTS.start - 1);
  // wait out the grace and lose the rest
  w.invulnerable = 0;
  bench();
  step(w, idleIntent(), DT);
  w.invulnerable = 0;
  bench();
  step(w, idleIntent(), DT);
  assert.equal(w.hearts, 0);
  assert.equal(w.status, 'over');
  assert.ok(drainEvents(w).some((e) => e.type === 'over'));
  const frozen = w.dist;
  step(w, idleIntent(), DT);
  assert.equal(w.dist, frozen);
});

test('a shield absorbs one hit, and tea makes the runner smash through', () => {
  const w = createWorld({ seed: 6 });
  startRun(w, 6);
  w.entities = [];
  w.spawner.cursor = 1e9;
  w.power.shield = true;
  w.entities.push(makeEntity(500, 'bin', w.dist + 5, null, 0));
  step(w, idleIntent(), DT);
  assert.equal(w.hearts, HEARTS.start);
  assert.equal(w.power.shield, false);
  assert.ok(drainEvents(w).some((e) => e.type === 'shieldBreak'));

  w.invulnerable = 0;
  w.power.boost = 2;
  w.entities.push(makeEntity(501, 'bench', w.dist + 5, null, 0));
  step(w, idleIntent(), DT);
  assert.equal(w.hearts, HEARTS.start);
  assert.ok(drainEvents(w).some((e) => e.type === 'smash'));
});

test('puddles slow the runner without costing a heart', () => {
  const w = createWorld({ seed: 7 });
  startRun(w, 7);
  w.entities = [];
  w.spawner.cursor = 1e9;
  w.entities.push(makeEntity(700, 'puddle', w.dist + 5, null, 0));
  const before = w.speed;
  for (let i = 0; i < 120; i++) step(w, idleIntent(), DT);
  assert.equal(w.hearts, HEARTS.start);
  assert.ok(w.speed < before);
});

test('books raise the score and combo, and hearts restore wellbeing', () => {
  const w = createWorld({ seed: 8 });
  startRun(w, 8);
  w.entities = [];
  w.spawner.cursor = 1e9;
  w.hearts = 2;
  for (let i = 0; i < 4; i++) w.entities.push(makeEntity(800 + i, 'book', w.dist + 4, 10, 0, 0));
  w.entities.push(makeEntity(900, 'heart', w.dist + 4, 10, 0));
  step(w, idleIntent(), DT);
  assert.equal(w.books, 4);
  assert.equal(w.hearts, 3);
  assert.ok(w.combo.count >= 4);
  assert.ok(w.score >= 20);
});

test('power-ups switch on shield, glide and speed boost', () => {
  const w = createWorld({ seed: 9 });
  startRun(w, 9);
  w.entities = [];
  w.spawner.cursor = 1e9;
  for (const [i, kind] of (['iceCream', 'kite', 'tea'] as const).entries()) {
    w.entities.push(makeEntity(950 + i, kind, w.dist + 4, 6, 0));
  }
  step(w, idleIntent(), DT);
  assert.equal(w.power.shield, true);
  assert.ok(w.power.glide > 0);
  assert.ok(w.power.boost > 0);
});

test('zone changes are announced as an event once per 500 metres', () => {
  const w = createWorld({ seed: 10 });
  startRun(w, 10);
  w.entities = [];
  w.spawner.cursor = 1e9;
  w.invulnerable = 1e9;
  w.dist = 499 / 0.05;
  drainEvents(w);
  step(w, idleIntent(), 0.1);
  const zones = drainEvents(w).filter((e) => e.type === 'zone');
  assert.equal(zones.length, 1);
  assert.equal(w.zone.index, 1);
  assert.ok(w.zone.blend < 1);
});

test('spawning is deterministic for a seed and never places hazards on top of each other', () => {
  const run = (seed: number, speed: number, difficulty: number): Entity[] => {
    const out: Entity[] = [];
    const s = createSpawner();
    const rng = createRng(seed);
    spawnAhead(s, out, rng, { dist: 0, viewWidth: 30000, speed, difficulty, hearts: 3, maxHearts: 3, shieldHeld: false });
    return out;
  };
  assert.deepEqual(run(11, 400, 0.3), run(11, 400, 0.3));
  assert.notDeepEqual(run(11, 400, 0.3), run(12, 400, 0.3));

  for (const [speed, difficulty] of [[300, 0], [400, 0.3], [520, 0.6], [600, 1]] as const) {
    for (let seed = 1; seed <= 20; seed++) {
      const hazards = run(seed, speed, difficulty).filter((e) => isHazard(e.kind) && e.kind !== 'puddle').sort((a, b) => a.x - b.x);
      for (let i = 1; i < hazards.length; i++) {
        const a = hazards[i - 1];
        const b = hazards[i];
        if (!a || !b) continue;
        const gap = b.x - (a.x + a.w);
        const sameGroup = a.group === b.group;
        // Inside a pattern, spacing is hand-made. Between patterns it is at least 0.9 s of running.
        assert.ok(gap >= (sameGroup ? 20 : speed * 0.9 - 1), `seed ${seed} speed ${speed}: gap ${gap} between ${a.kind} and ${b.kind}`);
      }
    }
  }
});

test('spawning offers variety and rest breaks across a long run', () => {
  const out: Entity[] = [];
  const s = createSpawner();
  const rng = createRng(77);
  spawnAhead(s, out, rng, { dist: 0, viewWidth: 120000, speed: 450, difficulty: 0.7, hearts: 2, maxHearts: 3, shieldHeld: false });
  const present = kinds(out);
  for (const kind of ['bench', 'bin', 'gullLow', 'gullHigh', 'bunting', 'puddle', 'book']) assert.ok(present.has(kind), `missing ${kind}`);
  assert.ok(present.has('heart') || present.has('tea') || present.has('kite') || present.has('iceCream'));
  // never more than four hazard patterns in a row without a book-only breather
  const groups = new Map<number, boolean>();
  for (const e of out) groups.set(e.group, (groups.get(e.group) ?? false) || (isHazard(e.kind) && e.kind !== 'puddle' ? true : false));
  let streak = 0;
  for (const hazardous of [...groups.values()]) {
    streak = hazardous ? streak + 1 : 0;
    assert.ok(streak <= 5, 'too many hazard patterns in a row');
  }
});

/**
 * A simple autopilot: jump at ground hazards, duck under low ones, otherwise
 * run. If a run is always beatable, this player survives it untouched.
 */
const pilot = (w: World): Intent => {
  const intent = idleIntent();
  let next: Entity | undefined;
  for (const e of w.entities) {
    if (!isHazard(e.kind) || e.kind === 'puddle' || e.kind === 'gullHigh' || e.resolved) continue;
    if (e.x - w.dist + e.w < -PLAYER.width / 2) continue;
    if (!next || e.x < next.x) next = e;
  }
  if (!w.player.grounded) intent.jumpHeld = true;
  if (!next) return intent;
  const rx = next.x - w.dist - PLAYER.width / 2;
  const closing = w.speed + (next.x - w.dist < LUNGE_RANGE ? next.drift : 0);
  const lead = rx / closing;
  if (next.kind === 'bunting' || next.kind === 'gullLow') {
    if (lead < 0.5 && next.x - w.dist + next.w > -PLAYER.width / 2) intent.duck = true;
  } else if (w.player.grounded && lead < 0.17 && lead > -0.2) {
    intent.jumpPressed = true;
    intent.jumpHeld = true;
  }
  return intent;
};

test('every seeded run is beatable: the autopilot finishes two minutes untouched', () => {
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    const w = createWorld({ seed, viewWidth: 900 });
    startRun(w, seed);
    for (let i = 0; i < 120 * 150 && w.status === 'running'; i++) {
      step(w, pilot(w), DT);
    }
    assert.equal(w.status, 'running', `seed ${seed} ended at ${Math.round(w.metres)} m`);
    assert.equal(w.hearts, HEARTS.start, `seed ${seed} lost a heart at ${Math.round(w.metres)} m`);
    assert.ok(w.metres > 500, `seed ${seed} only reached ${Math.round(w.metres)} m`);
    assert.ok(difficultyAt(w.metres) > 0.3);
  }
});

test('the autopilot control: standing still loses the run', () => {
  const w = createWorld({ seed: 1, viewWidth: 900 });
  startRun(w, 1);
  for (let i = 0; i < 120 * 150 && w.status === 'running'; i++) step(w, idleIntent(), DT);
  assert.equal(w.status, 'over');
});

test('reduced motion keeps the pace lower than full motion', () => {
  const run = (reducedMotion: boolean): number => {
    const w = createWorld({ seed: 2, reducedMotion });
    startRun(w, 2);
    w.invulnerable = 1e9;
    w.entities = [];
    w.spawner.cursor = 1e12;
    for (let i = 0; i < 120 * 300; i++) step(w, idleIntent(), DT);
    return w.speed;
  };
  assert.ok(run(true) < run(false) - 80);
});

test('a run allows one air jump without a power-up, but not an unlimited third jump', () => {
  const w = createWorld({ seed: 17 });
  startRun(w, 17);
  w.entities = [];
  w.spawner.cursor = 1e9;
  step(w, { jumpPressed: true, jumpHeld: true, duck: false }, DT);
  for (let i = 0; i < 20; i++) step(w, { jumpPressed: false, jumpHeld: true, duck: false }, DT);
  drainEvents(w);
  step(w, { jumpPressed: true, jumpHeld: true, duck: false }, DT);
  assert.ok(drainEvents(w).some(e => e.type === 'airJump'));
  assert.equal(w.player.airJumps, 1);
  step(w, { jumpPressed: true, jumpHeld: true, duck: false }, DT);
  assert.ok(!drainEvents(w).some(e => e.type === 'airJump'));
  for (let i = 0; i < 200; i++) step(w, idleIntent(), DT);
  assert.equal(w.player.grounded, true);
  assert.equal(w.player.airJumps, 0);
});

test('landing on a beach ball springs the hero upwards, removes the ball and awards a bonus', () => {
  const w = createWorld({ seed: 18 });
  startRun(w, 18);
  w.spawner.cursor = 1e9;
  w.entities = [makeEntity(100, 'ball', -10, null, 0)];
  w.player.y = 28;
  w.player.vy = -300;
  w.player.grounded = false;
  w.player.airJumps = 1;
  const hearts = w.hearts;
  step(w, idleIntent(), DT);
  assert.equal(w.hearts, hearts);
  assert.ok(w.player.vy > 0);
  assert.equal(w.player.airJumps, 0);
  assert.equal(w.entities.length, 0);
  assert.equal(w.bonus, 20);
  assert.ok(drainEvents(w).some(e => e.type === 'bounce'));
  step(w, idleIntent(), DT);
  assert.equal(w.bonus, 20, 'one ball must not award its bonus twice');
});

test('beach-ball side collisions and rising contact still cost a heart', () => {
  for (const rising of [false, true]) {
    const w = createWorld({ seed: 19 });
    startRun(w, 19);
    w.spawner.cursor = 1e9;
    w.entities = [makeEntity(100, 'ball', -10, null, 0)];
    if (rising) {
      w.player.y = 20;
      w.player.vy = 200;
      w.player.grounded = false;
    }
    step(w, idleIntent(), DT);
    assert.equal(w.hearts, HEARTS.start - 1);
    assert.ok(!drainEvents(w).some(e => e.type === 'bounce'));
  }
});
