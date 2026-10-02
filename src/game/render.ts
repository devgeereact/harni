import { PLAYER, VIEW } from './config.ts';
import type { Effects } from './effects.ts';
import { drawScene } from './scene.ts';
import type { View } from './scene.ts';
import { drawEntity, drawRunner } from './sprites.ts';
import type { Pose } from './sprites.ts';
import type { World } from './types.ts';

export type { View } from './scene.ts';

/** Works out how the world fits a canvas of the given CSS size. */
export const fitView = (cssWidth: number, cssHeight: number): { scale: number; view: View } => {
  // Wider screens show a little more world, so there is time to read what is coming.
  const t = Math.max(0, Math.min(1, (cssWidth - 390) / 610));
  const minWidth = VIEW.minWidth + (VIEW.wideWidth - VIEW.minWidth) * t;
  const scale = Math.min(cssHeight / VIEW.minHeight, cssWidth / minWidth);
  const w = cssWidth / scale;
  const h = cssHeight / scale;
  return { scale, view: { w, h, groundY: h - VIEW.groundMargin } };
};

export const anchorX = (view: View): number => Math.max(64, Math.min(200, view.w * PLAYER.anchor));

const poseOf = (w: World): Pose => {
  const p = w.player;
  if (p.hurt > 0) return 'hurt';
  if (w.status === 'ready') return 'idle';
  if (!p.grounded) return w.power.glide > 0 && p.vy < 0 ? 'glide' : 'jump';
  return p.ducking ? 'duck' : 'run';
};

/** Draws a whole frame. The context must already be scaled to world units. */
export const render = (c: CanvasRenderingContext2D, w: World, view: View, fx: Effects, motion: boolean): void => {
  const ax = anchorX(view);
  c.clearRect(0, 0, view.w, view.h);
  drawScene(c, view, {
    dist: w.dist,
    time: w.time,
    zone: w.zone.index,
    previous: w.zone.previous,
    blend: w.zone.blend,
    motion,
  });

  const look = { time: w.time, motion };
  const visible = view.w - ax + 80;
  for (const e of w.entities) {
    const rx = e.x - w.dist;
    if (rx > visible || rx + e.w < -ax - 80) continue;
    drawEntity(c, e, ax + rx, view.groundY, look);
  }

  // Invulnerable runner pulses gently (never faster than about 2 Hz).
  const pulsing = w.invulnerable > 0 && w.power.boost <= 0;
  const alpha = pulsing ? (motion ? 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(w.time * 12)) : 0.65) : 1;
  drawRunner(c, {
    x: ax,
    groundY: view.groundY,
    lift: w.player.y,
    pose: poseOf(w),
    phase: w.dist * 0.05,
    squash: motion ? w.player.squash : 0,
    vy: motion ? w.player.vy : 0,
    alpha,
    shield: w.power.shield,
    boost: w.power.boost > 0,
    glide: w.power.glide > 0 && !w.player.grounded,
    time: w.time,
  });

  for (const p of fx.list) {
    const t = Math.max(0, p.life / p.max);
    c.globalAlpha = Math.min(1, t * 1.6);
    c.fillStyle = p.colour;
    const x = ax + p.x;
    const y = view.groundY - p.y;
    if (p.kind === 'streak') {
      c.fillRect(x, y, p.size, 2);
    } else if (p.kind === 'confetti' || p.kind === 'spark') {
      c.save();
      c.translate(x, y);
      c.rotate(p.life * 9);
      c.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      c.restore();
    } else {
      c.beginPath();
      c.arc(x, y, p.size * (p.kind === 'dust' ? 0.5 + (1 - t) * 0.6 : 0.5), 0, Math.PI * 2);
      c.fill();
    }
  }
  c.globalAlpha = 1;
};
