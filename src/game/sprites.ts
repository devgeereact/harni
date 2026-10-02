import { isHazard } from './entities.ts';
import { PLAYER } from './config.ts';
import { CORAL, CORAL_DEEP, INK, MINT, SKIN, SKY_BLUE, SUN, WHITE } from './palette.ts';
import type { Entity } from './types.ts';

type Ctx = CanvasRenderingContext2D;
export type Pose = 'run' | 'jump' | 'duck' | 'hurt' | 'glide' | 'idle';

const TAU = Math.PI * 2;
const BOOK_COLOURS = [CORAL, SKY_BLUE, SUN] as const;

const rrect = (c: Ctx, x: number, y: number, w: number, h: number, r: number): void => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
};

const limb = (c: Ctx, from: [number, number], to: [number, number], bend: number, width: number, colour: string, upper?: string): void => {
  // Two-bone limb: the middle joint bends sideways by `bend`.
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const kx = mx + (-dy / len) * bend;
  const ky = my + (dx / len) * bend;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.strokeStyle = upper ?? colour;
  c.lineWidth = width;
  c.beginPath();
  c.moveTo(from[0], from[1]);
  c.lineTo(kx, ky);
  c.stroke();
  c.strokeStyle = colour;
  c.beginPath();
  c.lineTo(kx, ky);
  c.lineTo(to[0], to[1]);
  c.stroke();
};

export interface RunnerLook {
  x: number;
  /** Ground line. */
  groundY: number;
  /** Feet height above ground. */
  lift: number;
  pose: Pose;
  /** Run cycle angle in radians. */
  phase: number;
  squash: number;
  vy: number;
  alpha: number;
  shield: boolean;
  boost: boolean;
  glide: boolean;
  time: number;
}

/** Original seaside platform hero. A bold outline keeps the small sprite readable. */
export const drawRunner = (c: Ctx, o: RunnerLook): void => {
  const edge = '#365867';
  const teal = '#269ea7';
  const hair = '#70422f';
  const duck = o.pose === 'duck';
  const hurt = o.pose === 'hurt';
  const air = o.pose === 'jump' || o.pose === 'glide';
  const idle = o.pose === 'idle';
  const stride = idle ? 0 : Math.sin(o.phase);
  const stamp = (x: number, y: number, w: number, h: number, r: number, fill: string): void => {
    c.fillStyle = fill; c.strokeStyle = edge; c.lineWidth = 1.6;
    rrect(c, x, y, w, h, r); c.fill(); c.stroke();
  };
  c.save();
  c.translate(o.x, o.groundY - o.lift);
  c.globalAlpha = o.alpha;
  const stretch = Math.max(-0.08, Math.min(0.12, -o.vy / 5000));
  const squash = o.squash > 0 ? Math.sin((o.squash / 0.16) * Math.PI) * 0.14 : 0;
  c.scale(1 - stretch * 0.5 + squash, 1 + stretch - squash);
  if (duck) c.scale(1.13, 0.55);
  if (hurt) c.rotate(-0.16);

  // Compact legs and broad trainers make the motion easy to follow.
  const feet: Array<[number, number]> = air ? [[-10, -10], [12, -14]] : [[-stride * 10 - 3, -Math.max(0, -stride) * 7], [stride * 10 + 3, -Math.max(0, stride) * 7]];
  for (const [i, foot] of feet.entries()) {
    limb(c, [i ? 4 : -4, -19], foot, i ? 3 : -3, 9, edge);
    limb(c, [i ? 4 : -4, -19], foot, i ? 3 : -3, 6, teal);
    stamp(foot[0] - 7, foot[1] - 6, 17, 8, 4, '#fffaf0');
    c.fillStyle = CORAL; c.fillRect(foot[0] - 5, foot[1] - 1, 13, 2);
  }
  // Book bag and a short scarf that trails behind the shoulder.
  stamp(-18, -34, 11, 18, 3, '#edbc63');
  c.fillStyle = WHITE; c.fillRect(-15, -35, 6, 3);
  c.fillStyle = CORAL_DEEP;
  c.beginPath(); c.moveTo(-5, -37); c.quadraticCurveTo(-19, -39 + stride * 2, -28, -31);
  c.lineTo(-20, -30); c.lineTo(-24, -26); c.quadraticCurveTo(-12, -32, -3, -33); c.closePath(); c.fill();

  const rearHand: [number, number] = air ? [-15, -45] : [stride * 9 - 6, -20];
  limb(c, [-7, -31], rearHand, -3, 8, edge);
  limb(c, [-7, -31], rearHand, -3, 5, CORAL);
  stamp(rearHand[0] - 3.5, rearHand[1] - 3, 8, 7, 3, WHITE);
  stamp(-12, -35, 25, 20, 7, CORAL);
  stamp(-10, -19, 22, 7, 2, teal);
  // Windbreaker zip and pocket, rather than a uniform or borrowed costume.
  c.strokeStyle = '#fff3c9'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(2, -32); c.lineTo(2, -20); c.stroke();
  c.fillStyle = '#ffb0bb'; c.fillRect(6, -27, 4, 3);

  // Oversized face, clear eyes and a soft sun cap.
  c.fillStyle = hair; c.strokeStyle = edge; c.lineWidth = 1.6;
  c.beginPath(); c.ellipse(0, -44, 13, 12, 0, 0, TAU); c.fill(); c.stroke();
  c.fillStyle = SKIN;
  c.beginPath(); c.ellipse(3, -43, 11.5, 10.5, 0, 0, TAU); c.fill(); c.stroke();
  c.beginPath(); c.arc(-8, -43, 3.3, 0, TAU); c.fill();
  c.fillStyle = '#f4bd3f'; c.strokeStyle = edge;
  c.beginPath(); c.moveTo(-12, -50); c.quadraticCurveTo(-14, -62, -2, -62); c.quadraticCurveTo(10, -63, 12, -51); c.closePath(); c.fill(); c.stroke();
  stamp(-14, -53, 31, 5, 2.5, '#ffdc72');
  c.fillStyle = '#fff8cf'; c.fillRect(-3, -60, 6, 3);

  if (hurt) {
    c.strokeStyle = edge; c.lineWidth = 1.7;
    c.beginPath(); c.moveTo(3, -45); c.lineTo(7, -42); c.moveTo(7, -45); c.lineTo(3, -42); c.stroke();
  } else {
    c.fillStyle = WHITE; c.beginPath(); c.ellipse(6, -44, 3.3, 4, 0, 0, TAU); c.fill();
    c.fillStyle = edge; c.beginPath(); c.ellipse(7.3, -43.5, 1.5, 2.4, 0, 0, TAU); c.fill();
    c.fillStyle = WHITE; c.beginPath(); c.arc(7.7, -44.5, .65, 0, TAU); c.fill();
  }
  c.fillStyle = SKIN; c.beginPath(); c.ellipse(13, -40.5, 3.6, 2.8, 0, 0, TAU); c.fill();
  c.strokeStyle = edge; c.lineWidth = 1.3; c.lineCap = 'round';
  c.beginPath(); c.moveTo(5, -36); c.quadraticCurveTo(8, hurt ? -39 : -33.5, 10, -37); c.stroke();
  c.fillStyle = '#e8a18b'; c.beginPath(); c.ellipse(0, -39, 3, 1.5, 0, 0, TAU); c.fill();

  const frontHand: [number, number] = air ? [17, -49] : [-stride * 10 + 9, -20];
  limb(c, [10, -31], frontHand, 3, 8, edge);
  limb(c, [10, -31], frontHand, 3, 5, CORAL);
  stamp(frontHand[0] - 4, frontHand[1] - 3.5, 9, 8, 3.5, WHITE);
  c.restore();

  // Shield bubble and speed streaks sit outside the squash transform.
  if (o.shield) {
    c.save();
    c.translate(o.x, o.groundY - o.lift - 30);
    c.fillStyle = 'rgb(255 255 255 / 30%)';
    c.strokeStyle = 'rgb(255 56 92 / 65%)';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(0, 0, 40, 0, TAU);
    c.fill();
    c.stroke();
    c.strokeStyle = 'rgb(255 255 255 / 90%)';
    c.beginPath();
    c.arc(0, 0, 33, Math.PI * 1.15, Math.PI * 1.45);
    c.stroke();
    c.restore();
  }
  if (o.boost) {
    c.save();
    c.strokeStyle = 'rgb(255 255 255 / 85%)';
    c.lineWidth = 3;
    c.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const y = o.groundY - o.lift - 14 - i * 14;
      const len = 24 + ((o.time * 90 + i * 17) % 22);
      c.beginPath();
      c.moveTo(o.x - 22, y);
      c.lineTo(o.x - 22 - len, y);
      c.stroke();
    }
    c.restore();
  }
  if (o.glide) drawKiteOverhead(c, o.x + 4, o.groundY - o.lift - 62, o.time);
};

const drawKiteOverhead = (c: Ctx, x: number, y: number, time: number): void => {
  c.save();
  c.strokeStyle = '#6b7a88';
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(x, y + 8);
  c.lineTo(x + 2, y + 8 + 14);
  c.stroke();
  c.translate(x, y - 14 + Math.sin(time * 5) * 1.5);
  c.rotate(Math.sin(time * 3) * 0.06);
  kiteShape(c, 20, 26);
  c.restore();
};

const kiteShape = (c: Ctx, w: number, h: number): void => {
  c.fillStyle = CORAL;
  c.beginPath();
  c.moveTo(0, -h / 2);
  c.lineTo(w / 2, -h / 8);
  c.lineTo(0, h / 2);
  c.lineTo(-w / 2, -h / 8);
  c.closePath();
  c.fill();
  c.fillStyle = SUN;
  c.beginPath();
  c.moveTo(0, -h / 2);
  c.lineTo(w / 2, -h / 8);
  c.lineTo(0, -h / 8);
  c.closePath();
  c.fill();
  c.fillStyle = WHITE;
  c.beginPath();
  c.moveTo(0, -h / 8);
  c.lineTo(-w / 2, -h / 8);
  c.lineTo(0, h / 2);
  c.closePath();
  c.globalAlpha *= 0.55;
  c.fill();
  c.globalAlpha /= 0.55;
};

/* ------------------------------------------------------------------ entities */

const bench = (c: Ctx, w: number, h: number): void => {
  c.fillStyle = '#273e47';
  c.fillRect(5, -h + 12, 4, h - 12);
  c.fillRect(w - 9, -h + 12, 4, h - 12);
  c.fillStyle = '#b65b28';
  rrect(c, 0, -h, w, 6, 2);
  c.fill();
  rrect(c, 1, -h + 8, w - 2, 6, 2);
  c.fill();
  c.fillStyle = '#e69a4b';
  rrect(c, 0, -h + 18, w, 5, 2);
  c.fill();
};

const bin = (c: Ctx, w: number, h: number): void => {
  c.fillStyle = '#147d85';
  rrect(c, 1, -h + 6, w - 2, h - 6, 4);
  c.fill();
  c.fillStyle = '#24434d';
  rrect(c, -1, -h, w + 2, 7, 3);
  c.fill();
  c.fillStyle = '#ffffff';
  c.globalAlpha = 0.7;
  c.fillRect(w / 2 - 5, -h + 16, 10, 12);
  c.fillStyle = '#24434d';
  c.fillRect(w / 2 - 3, -h + 19, 6, 2);
  c.globalAlpha = 1;
};

const crab = (c: Ctx, w: number, h: number, time: number): void => {
  const wig = Math.sin(time * 14) * 1.5;
  c.strokeStyle = '#e8563a';
  c.lineWidth = 2;
  c.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    for (const side of [-1, 1]) {
      c.beginPath();
      c.moveTo(w / 2 + side * 6, -5);
      c.lineTo(w / 2 + side * (12 + i * 3), -1 + (i % 2 ? wig : -wig) * 0.5);
      c.stroke();
    }
  }
  c.fillStyle = '#ff7a59';
  c.beginPath();
  c.ellipse(w / 2, -h / 2 - 1, w / 2 - 3, h / 2 - 2, 0, 0, TAU);
  c.fill();
  c.beginPath();
  c.arc(3, -h + 3 + wig * 0.3, 4.5, 0, TAU);
  c.arc(w - 3, -h + 3 - wig * 0.3, 4.5, 0, TAU);
  c.fill();
  c.fillStyle = WHITE;
  c.beginPath();
  c.arc(w / 2 - 5, -h + 1, 2.4, 0, TAU);
  c.arc(w / 2 + 5, -h + 1, 2.4, 0, TAU);
  c.fill();
  c.fillStyle = INK;
  c.beginPath();
  c.arc(w / 2 - 5, -h + 1.4, 1.1, 0, TAU);
  c.arc(w / 2 + 5, -h + 1.4, 1.1, 0, TAU);
  c.fill();
};

const ball = (c: Ctx, w: number, h: number, spin: number): void => {
  c.save();
  c.translate(w / 2, -h / 2);
  c.rotate(spin);
  const r = w / 2;
  const colours = [CORAL, WHITE, SUN, WHITE, SKY_BLUE, WHITE] as const;
  for (let i = 0; i < 6; i++) {
    c.fillStyle = colours[i] ?? WHITE;
    c.beginPath();
    c.moveTo(0, 0);
    c.arc(0, 0, r, (i / 6) * TAU, ((i + 1) / 6) * TAU);
    c.closePath();
    c.fill();
  }
  c.strokeStyle = 'rgb(34 34 34 / 18%)';
  c.lineWidth = 1;
  c.beginPath();
  c.arc(0, 0, r, 0, TAU);
  c.stroke();
  c.fillStyle = WHITE;
  c.beginPath();
  c.arc(0, 0, 3, 0, TAU);
  c.fill();
  c.restore();
};

const puddle = (c: Ctx, w: number): void => {
  c.fillStyle = '#219cc8';
  c.strokeStyle = '#17566d';
  c.lineWidth = 2;
  c.beginPath();
  c.ellipse(w / 2, -2, w / 2, 5, 0, 0, TAU);
  c.fill();
  c.stroke();
  c.fillStyle = 'rgb(255 255 255 / 70%)';
  c.beginPath();
  c.ellipse(w * 0.36, -3.4, w * 0.16, 1.6, 0, 0, TAU);
  c.fill();
};

const gull = (c: Ctx, w: number, h: number, time: number, seed: number): void => {
  const flap = Math.sin(time * 9 + seed);
  c.save();
  c.translate(w / 2, -h / 2 + Math.sin(time * 3 + seed) * 2);
  c.fillStyle = WHITE;
  c.beginPath();
  c.ellipse(0, 2, 14, 6, 0, 0, TAU);
  c.fill();
  c.beginPath();
  c.arc(-13, 0, 5.5, 0, TAU);
  c.fill();
  c.fillStyle = '#ffa63d';
  c.beginPath();
  c.moveTo(-17, 0);
  c.lineTo(-24, 2);
  c.lineTo(-17, 3.4);
  c.closePath();
  c.fill();
  c.fillStyle = INK;
  c.beginPath();
  c.arc(-14.2, -1, 1, 0, TAU);
  c.fill();
  c.fillStyle = '#d6e3ee';
  c.beginPath();
  c.moveTo(-4, 0);
  c.quadraticCurveTo(4, -22 * flap - 4, 14, -6 * flap - 2);
  c.quadraticCurveTo(6, 2, -4, 4);
  c.closePath();
  c.fill();
  c.fillStyle = '#9fb4c6';
  c.beginPath();
  c.moveTo(8, 1);
  c.lineTo(20, 3 + flap * 2);
  c.lineTo(10, 5);
  c.closePath();
  c.fill();
  c.restore();
};

const bunting = (c: Ctx, w: number, h: number): void => {
  const top = -h - 4;
  c.strokeStyle = '#9aa7b3';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(-6, top - 2);
  c.quadraticCurveTo(w / 2, top + 10, w + 6, top - 2);
  c.stroke();
  const colours = [CORAL, SUN, SKY_BLUE, MINT, WHITE] as const;
  const flags = 8;
  for (let i = 0; i < flags; i++) {
    const t = (i + 0.5) / flags;
    const x = -6 + t * (w + 12);
    const y = top - 2 + 4 * 2 * t * (1 - t) * 2.2 + 0.2;
    c.fillStyle = colours[i % colours.length] ?? CORAL;
    c.beginPath();
    c.moveTo(x - 7, y);
    c.lineTo(x + 7, y);
    c.lineTo(x, y + h + 4);
    c.closePath();
    c.fill();
  }
  // Two posts hold the line up, drawn behind the runner's lane.
  c.fillStyle = '#b8c4cd';
  c.fillRect(-9, top - 4, 4, 70);
  c.fillRect(w + 5, top - 4, 4, 70);
};

export const drawBook = (c: Ctx, variant: number, bob: number): void => {
  c.save();
  c.translate(9, -11 + bob);
  const colour = BOOK_COLOURS[Math.max(0, Math.min(2, variant))] ?? CORAL;
  c.fillStyle = colour;
  rrect(c, -8, -10, 16, 20, 2.5);
  c.fill();
  c.fillStyle = 'rgb(255 255 255 / 85%)';
  c.fillRect(-5, -7, 2.5, 14);
  // A wave and bookmark make these recognisable little seaside editions.
  c.strokeStyle = WHITE; c.lineWidth = 1.2;
  c.beginPath(); c.moveTo(-1, -3); c.quadraticCurveTo(1, -6, 3, -3); c.quadraticCurveTo(5, 0, 6, -3); c.stroke();
  c.fillStyle = '#fff3c9'; c.fillRect(2, -10, 2, 5);
  c.strokeStyle = 'rgb(34 34 34 / 25%)';
  c.lineWidth = 1;
  rrect(c, -8, -10, 16, 20, 2.5);
  c.stroke();
  c.restore();
};

const heart = (c: Ctx, w: number, bob: number): void => {
  c.save();
  c.translate(w / 2, -11 + bob);
  c.fillStyle = CORAL;
  c.beginPath();
  c.moveTo(0, 9);
  c.bezierCurveTo(-16, -2, -9, -14, 0, -6);
  c.bezierCurveTo(9, -14, 16, -2, 0, 9);
  c.fill();
  c.fillStyle = 'rgb(255 255 255 / 55%)';
  c.beginPath();
  c.arc(-5, -4, 2.2, 0, TAU);
  c.fill();
  c.restore();
};

const iceCream = (c: Ctx, w: number, h: number, bob: number): void => {
  c.save();
  c.translate(w / 2, -h + bob);
  c.fillStyle = '#f0c27a';
  c.beginPath();
  c.moveTo(-8, 14);
  c.lineTo(8, 14);
  c.lineTo(0, 34);
  c.closePath();
  c.fill();
  c.strokeStyle = '#d79f4f';
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(-4, 16);
  c.lineTo(3, 28);
  c.moveTo(4, 16);
  c.lineTo(-3, 28);
  c.stroke();
  c.fillStyle = '#ffb3c6';
  c.beginPath();
  c.arc(0, 11, 9, 0, TAU);
  c.fill();
  c.fillStyle = '#b8ecd6';
  c.beginPath();
  c.arc(0, 3, 8, 0, TAU);
  c.fill();
  c.fillStyle = CORAL;
  c.beginPath();
  c.arc(2, -5, 2.6, 0, TAU);
  c.fill();
  c.restore();
};

const kite = (c: Ctx, w: number, h: number, bob: number): void => {
  c.save();
  c.translate(w / 2, -h / 2 + bob);
  c.rotate(0.35);
  kiteShape(c, 24, 30);
  c.strokeStyle = '#6b7a88';
  c.beginPath();
  c.moveTo(0, 15);
  c.quadraticCurveTo(-6, 20, 0, 24);
  c.stroke();
  c.restore();
};

const tea = (c: Ctx, w: number, h: number, bob: number, time: number): void => {
  c.save();
  c.translate(w / 2, -h / 2 + bob + 3);
  c.fillStyle = '#e9eef2';
  c.beginPath();
  c.ellipse(0, 10, 13, 3.4, 0, 0, TAU);
  c.fill();
  c.fillStyle = WHITE;
  c.strokeStyle = '#c9d6e0';
  c.lineWidth = 1.2;
  rrect(c, -9, -4, 18, 14, 5);
  c.fill();
  c.stroke();
  c.beginPath();
  c.arc(10, 3, 4.5, -1.2, 1.2);
  c.stroke();
  c.fillStyle = '#c98a4b';
  c.beginPath();
  c.ellipse(0, -3, 8, 2, 0, 0, TAU);
  c.fill();
  c.fillStyle = CORAL;
  c.beginPath();
  c.arc(0, 4, 2.2, 0, TAU);
  c.fill();
  c.strokeStyle = 'rgb(34 34 34 / 25%)';
  c.lineWidth = 1.6;
  c.lineCap = 'round';
  for (const dx of [-3, 3]) {
    c.beginPath();
    c.moveTo(dx, -7);
    c.quadraticCurveTo(dx + Math.sin(time * 2 + dx) * 3, -12, dx, -17);
    c.stroke();
  }
  c.restore();
};

export interface EntityLook {
  time: number;
  motion: boolean;
}

/** Draws one entity with its bottom-left corner at (x, groundY - e.y). */
export const drawEntity = (c: Ctx, e: Entity, x: number, groundY: number, look: EntityLook): void => {
  const t = look.time;
  const bob = look.motion ? Math.sin(t * 3 + e.id * 1.7) * 2.2 : 0;
  c.save();
  c.translate(x, groundY - e.y);
  const hazard = isHazard(e.kind);
  if (hazard) {
    // A white silhouette separates interactive obstacles from the scenery.
    c.shadowColor = WHITE;
    c.shadowBlur = 3;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
  }
  switch (e.kind) {
    case 'bench': bench(c, e.w, e.h); break;
    case 'bin': bin(c, e.w, e.h); break;
    case 'crab': crab(c, e.w, e.h, look.motion ? t : 0); break;
    case 'ball': ball(c, e.w, e.h, look.motion ? -t * 6 - e.id : -e.id); break;
    case 'puddle': puddle(c, e.w); break;
    case 'gullLow':
    case 'gullHigh': gull(c, e.w, e.h, look.motion ? t : 0, e.id); break;
    case 'bunting': bunting(c, e.w, e.h); break;
    case 'book': drawBook(c, e.variant, bob); break;
    case 'heart': heart(c, e.w, bob); break;
    case 'iceCream': iceCream(c, e.w, e.h, bob); break;
    case 'kite': kite(c, e.w, e.h, bob); break;
    case 'tea': tea(c, e.w, e.h, bob, t); break;
  }
  if (hazard) {
    c.shadowBlur = 0;
    const labels = { bench: 'BENCH · JUMP', bin: 'BIN · JUMP', crab: 'CRAB · JUMP', ball: 'BALL · BOUNCE', puddle: 'PUDDLE · JUMP', gullLow: 'GULL · DUCK', gullHigh: 'GULL · STAY LOW', bunting: 'FLAGS · DUCK' };
    const label = labels[e.kind as keyof typeof labels];
    c.font = 'bold 10px sans-serif';
    const width = c.measureText(label).width + 14;
    const top = -e.h - 29;
    c.fillStyle = '#fffdf7';
    c.strokeStyle = '#38535b';
    c.lineWidth = 1;
    rrect(c, (e.w - width) / 2, top, width, 19, 5);
    c.fill();
    c.stroke();
    c.fillStyle = '#243d45';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(label, e.w / 2, top + 10);
    c.beginPath();
    c.moveTo(e.w / 2 - 3, top + 19);
    c.lineTo(e.w / 2 + 3, top + 19);
    c.lineTo(e.w / 2, top + 23);
    c.fill();
  }
  c.restore();
};

export const RUNNER_HEIGHT = PLAYER.standHeight;
