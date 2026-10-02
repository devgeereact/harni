import assert from 'node:assert/strict';
import { test } from 'node:test';
import { COMBO, HEARTS, PHYSICS, PLAYER } from '../../src/game/config.ts';
import { contact } from '../../src/game/collision.ts';
import { baseSpeed, difficultyAt, gapSeconds } from '../../src/game/difficulty.ts';
import { makeEntity } from '../../src/game/entities.ts';
import { createPlayer, stepPlayer } from '../../src/game/physics.ts';
import type { Abilities } from '../../src/game/physics.ts';
import { createRng, hash01 } from '../../src/game/rng.ts';
import { bumpCombo, comboMultiplier, tickCombo } from '../../src/game/scoring.ts';
import { zoneFor, zoneIndexAt } from '../../src/game/zones.ts';
import type { Intent } from '../../src/game/types.ts';

const DT = 1 / 120;
const intent = (over: Partial<Intent> = {}): Intent => ({ jumpHeld: false, jumpPressed: false, duck: false, ...over });
const none: Abilities = { doubleJump: false, glide: false };

test('seeded rng repeats and stays in range', () => {
  const a = createRng(42);
  const b = createRng(42);
  const seqA = Array.from({ length: 50 }, () => a.next());
  const seqB = Array.from({ length: 50 }, () => b.next());
  assert.deepEqual(seqA, seqB);
  assert.ok(seqA.every((v) => v >= 0 && v < 1));
  const c = createRng(43);
  assert.notDeepEqual(seqA, Array.from({ length: 50 }, () => c.next()));
  const r = createRng(7);
  for (let i = 0; i < 200; i++) {
    const n = r.int(5);
    assert.ok(Number.isInteger(n) && n >= 0 && n < 5);
    const x = r.range(2, 3);
    assert.ok(x >= 2 && x < 3);
  }
  assert.equal(hash01(5, 1), hash01(5, 1));
  assert.ok(hash01(5, 1) >= 0 && hash01(5, 1) < 1);
});

const fly = (held: boolean, frames: number, can: Abilities = none): { peak: number; p: ReturnType<typeof createPlayer> } => {
  const p = createPlayer();
  let peak = 0;
  stepPlayer(p, intent({ jumpPressed: true, jumpHeld: true }), DT, can);
  for (let i = 0; i < frames; i++) {
    stepPlayer(p, intent({ jumpHeld: held && i < 40 }), DT, can);
    peak = Math.max(peak, p.y);
  }
  return { peak, p };
};

test('a held jump goes higher than a tap, and both land', () => {
  const full = fly(true, 120).peak;
  const hop = fly(false, 120).peak;
  assert.ok(full > 115 && full < 145, `full jump peak ${full}`);
  assert.ok(hop > 30 && hop < full - 20, `hop peak ${hop}`);
  assert.equal(fly(true, 140).p.grounded, true);
});

test('jump buffer and coyote time forgive early and late presses', () => {
  const p = createPlayer();
  p.grounded = false;
  p.coyote = 0;
  p.y = 12;
  p.vy = -400;
  // pressed just before landing: the jump fires once the runner touches down
  stepPlayer(p, intent({ jumpPressed: true, jumpHeld: true }), DT, none);
  let jumped = false;
  for (let i = 0; i < 20 && !jumped; i++) jumped = stepPlayer(p, intent({ jumpHeld: true }), DT, none).jumped === 'ground';
  assert.equal(jumped, true);

  // just walked off an edge: the coyote window still allows a jump
  const q = createPlayer();
  q.grounded = false;
  q.coyote = PHYSICS.coyote;
  q.y = 1;
  assert.equal(stepPlayer(q, intent({ jumpPressed: true, jumpHeld: true }), DT, none).jumped, 'ground');
});

test('double jump needs a power-up and only works once', () => {
  const airborne = (can: Abilities): ReturnType<typeof createPlayer> => {
    const p = createPlayer();
    stepPlayer(p, intent({ jumpPressed: true, jumpHeld: true }), DT, can);
    for (let i = 0; i < 25; i++) stepPlayer(p, intent({ jumpHeld: true }), DT, can);
    return p;
  };
  const without = airborne(none);
  assert.equal(stepPlayer(without, intent({ jumpPressed: true, jumpHeld: true }), DT, none).jumped, null);

  const can: Abilities = { doubleJump: true, glide: false };
  const p = airborne(can);
  assert.equal(stepPlayer(p, intent({ jumpPressed: true, jumpHeld: true }), DT, can).jumped, 'air');
  for (let i = 0; i < 10; i++) stepPlayer(p, intent({ jumpHeld: true }), DT, can);
  assert.equal(stepPlayer(p, intent({ jumpPressed: true, jumpHeld: true }), DT, can).jumped, null);
});

test('gliding slows the fall, fast fall speeds it up', () => {
  const fall = (can: Abilities, duck: boolean): number => {
    const p = createPlayer();
    p.grounded = false;
    p.y = 120;
    p.vy = 0;
    for (let i = 0; i < 30; i++) stepPlayer(p, intent({ jumpHeld: !duck, duck }), DT, can);
    return p.y;
  };
  const plain = fall(none, false);
  assert.ok(fall({ doubleJump: true, glide: true }, false) > plain + 15);
  assert.ok(fall(none, true) < plain - 5);
});

test('ducking only happens on the ground and lowers the hitbox', () => {
  const p = createPlayer();
  stepPlayer(p, intent({ duck: true }), DT, none);
  assert.equal(p.ducking, true);
  const bunting = makeEntity(1, 'bunting', 0, null, 0);
  assert.equal(contact({ y: 0, ducking: true }, bunting, 0).hit, false);
  assert.equal(contact({ y: 0, ducking: false }, bunting, 0).hit, true);
  const air = createPlayer();
  air.grounded = false;
  air.y = 40;
  stepPlayer(air, intent({ duck: true }), DT, none);
  assert.equal(air.ducking, false);
});

test('collision: bench hits on the ground, clears when high enough, ignores far away', () => {
  const bench = makeEntity(1, 'bench', -20, null, 0);
  assert.equal(contact({ y: 0, ducking: false }, bench, 0).hit, true);
  assert.equal(contact({ y: 34, ducking: false }, bench, 0).hit, false);
  const far = makeEntity(2, 'bench', 300, null, 0);
  assert.equal(contact({ y: 0, ducking: false }, far, 0).across, false);
  // grazing the edge is forgiven by the hitbox inset
  const edge = makeEntity(3, 'bench', PLAYER.width / 2 - 2, null, 0);
  assert.equal(contact({ y: 0, ducking: false }, edge, 0).hit, false);
  assert.equal(contact({ y: 0, ducking: false }, edge, 0).across, true);
});

test('combo multiplier builds, caps and expires', () => {
  const combo = { count: 0, timer: 0 };
  let mult = 1;
  for (let i = 0; i < 40; i++) mult = bumpCombo(combo);
  assert.equal(mult, COMBO.maxMultiplier);
  assert.equal(comboMultiplier(0), 1);
  assert.equal(comboMultiplier(COMBO.perStep), 2);
  assert.equal(tickCombo(combo, COMBO.window - 0.1), false);
  assert.equal(tickCombo(combo, 0.2), true);
  assert.equal(combo.count, 0);
  assert.equal(tickCombo(combo, 1), false);
});

test('difficulty and speed rise gently and respect the reduced-motion cap', () => {
  assert.ok(difficultyAt(0) < 0.01);
  assert.ok(difficultyAt(500) < difficultyAt(2000));
  assert.ok(difficultyAt(100000) <= 1);
  let last = 0;
  for (let t = 0; t <= 400; t += 20) {
    const s = baseSpeed(t, false);
    assert.ok(s >= last);
    last = s;
  }
  assert.ok(baseSpeed(1000, false) <= 600);
  assert.ok(baseSpeed(1000, true) <= 430);
  assert.ok(baseSpeed(1000, true) < baseSpeed(1000, false));
  // the pause between patterns never drops below a safe floor
  for (const d of [0, 0.3, 0.7, 1]) assert.ok(gapSeconds(d).min >= 0.9);
});

test('zones change every 500 metres and cycle', () => {
  assert.equal(zoneIndexAt(0), 0);
  assert.equal(zoneIndexAt(499), 0);
  assert.equal(zoneIndexAt(500), 1);
  assert.equal(zoneFor(0).key, 'beach');
  assert.equal(zoneFor(1).key, 'pier');
  assert.equal(zoneFor(2).key, 'promenade');
  assert.equal(zoneFor(3).key, 'funfair');
  assert.equal(zoneFor(4).key, 'beach');
  assert.equal(HEARTS.start, 3);
});
