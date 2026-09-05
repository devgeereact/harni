import { GROUND_Y, PALETTE, RUNNER } from './config';
import type { Collectible, Obstacle, World } from './types';

const HORIZON = 198;
/** The sea meets the promenade railing exactly here. */
const SEA_BOTTOM = 236;

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

/** Sky, low sun, sea, the ruined pier, railings, deck. Three parallax rates. */
const drawShore = (ctx: CanvasRenderingContext2D, world: World, reducedMotion: boolean): void => {
  const { width, height } = world;
  const drift = reducedMotion ? 0 : world.distance;

  const sky = ctx.createLinearGradient(0, 0, 0, HORIZON);
  sky.addColorStop(0, PALETTE.ink);
  sky.addColorStop(0.45, PALETTE.skyHigh);
  sky.addColorStop(1, PALETTE.skyLow);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, HORIZON);

  // The sun sits still: it is the one thing on the horizon that does not pass.
  const sunX = width * 0.68;
  const sunY = 124;
  const glow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 132);
  glow.addColorStop(0, 'rgba(240, 221, 166, 0.85)');
  glow.addColorStop(0.18, 'rgba(217, 189, 124, 0.28)');
  glow.addColorStop(1, 'rgba(217, 189, 124, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, SEA_BOTTOM);

  ctx.fillStyle = PALETTE.goldBright;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 13, 0, Math.PI * 2);
  ctx.fill();

  // Sea.
  const sea = ctx.createLinearGradient(0, HORIZON, 0, SEA_BOTTOM);
  sea.addColorStop(0, PALETTE.skyLow);
  sea.addColorStop(1, PALETTE.sea);
  ctx.fillStyle = sea;
  ctx.fillRect(0, HORIZON, width, SEA_BOTTOM - HORIZON);

  // The sun's track on the water: broken glitter rather than a solid cone,
  // which is what it actually looks like and avoids a hard-edged wedge.
  ctx.strokeStyle = PALETTE.goldBright;
  ctx.lineWidth = 1.5;
  const rows = 7;
  for (let i = 0; i < rows; i += 1) {
    const t = i / (rows - 1);
    const y = HORIZON + 2 + t * (SEA_BOTTOM - HORIZON - 4);
    const spread = 7 + t * 20;
    ctx.globalAlpha = 0.4 * (1 - t * 0.85);
    ctx.beginPath();
    for (let j = -2; j <= 2; j += 1) {
      const cx = sunX + (j / 2) * spread + Math.sin(i * 2.3 + j) * 3;
      const half = (3 + Math.abs(j) * 1.5) * (1 - t * 0.4);
      ctx.moveTo(cx - half, y);
      ctx.lineTo(cx + half, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = PALETTE.haze;
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 4; i += 1) {
    const y = HORIZON + 8 + i * 7;
    const offset = (drift * (0.06 + i * 0.02)) % 90;
    for (let x = -90 + offset; x < width + 90; x += 90) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + 34, y);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  // The West Pier out on the water, drifting slowest of everything.
  const ruinX = ((-drift * 0.06) % (width + 460)) + width * 0.12;
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(ruinX, HORIZON - 2);
  ctx.lineTo(ruinX, HORIZON - 26);
  ctx.lineTo(ruinX + 74, HORIZON - 26);
  ctx.lineTo(ruinX + 74, HORIZON - 2);
  for (let i = 1; i < 6; i += 1) {
    ctx.moveTo(ruinX + i * 12, HORIZON - 2);
    ctx.lineTo(ruinX + i * 12, HORIZON - 26);
  }
  ctx.moveTo(ruinX + 30, HORIZON - 26);
  ctx.lineTo(ruinX + 30, HORIZON - 44);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Promenade railing, mid rate.
  const railTop = 236;
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, railTop);
  ctx.lineTo(width, railTop);
  ctx.moveTo(0, railTop + 14);
  ctx.lineTo(width, railTop + 14);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.beginPath();
  const postGap = 74;
  const postOffset = (drift * 0.45) % postGap;
  for (let x = -postGap + postOffset; x < width + postGap; x += postGap) {
    ctx.moveTo(x, railTop - 4);
    ctx.lineTo(x, GROUND_Y);
  }
  ctx.stroke();

  // Deck.
  ctx.fillStyle = PALETTE.deck;
  ctx.fillRect(0, GROUND_Y, width, height - GROUND_Y);
  ctx.strokeStyle = PALETTE.gold;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 0.75);
  ctx.lineTo(width, GROUND_Y + 0.75);
  ctx.stroke();

  // Deck boards, full speed, so the floor reads as the ground truth.
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = PALETTE.haze;
  ctx.lineWidth = 2;
  ctx.beginPath();
  const boardGap = 58;
  const boardOffset = drift % boardGap;
  for (let x = -boardGap - boardOffset; x < width + boardGap; x += boardGap) {
    ctx.moveTo(x, GROUND_Y + 15);
    ctx.lineTo(x + 30, GROUND_Y + 15);
    ctx.moveTo(x + 29, GROUND_Y + 38);
    ctx.lineTo(x + 59, GROUND_Y + 38);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
};

const drawObstacle = (ctx: CanvasRenderingContext2D, obstacle: Obstacle, elapsed: number): void => {
  if (obstacle.kind === 'bench') {
    const { x, y, w, h } = obstacle;
    const seatY = y + h * 0.45;

    // Contact shadow: without it the bench floats above the deck.
    ctx.fillStyle = 'rgba(5, 9, 14, 0.55)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, GROUND_Y + 2, w * 0.62, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // A lit body rather than a silhouette, or it disappears into the deck.
    ctx.fillStyle = PALETTE.slat;
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 1.5;
    for (const [bx, by, bw, bh, br] of [
      [x, seatY, w, 6, 2],
      [x + 1, y, w - 2, 5, 2],
      [x + 3, y + 2, 4, h - 2, 1],
      [x + w - 7, y + 2, 4, h - 2, 1],
    ] as const) {
      roundRect(ctx, bx, by, bw, bh, br);
      ctx.fill();
      ctx.stroke();
    }

    // Rim light along the top edges, picked out by the low sun behind.
    ctx.strokeStyle = PALETTE.goldBright;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 1, y + 0.5);
    ctx.lineTo(x + w - 1, y + 0.5);
    ctx.moveTo(x, seatY + 0.5);
    ctx.lineTo(x + w, seatY + 0.5);
    ctx.stroke();
    ctx.globalAlpha = 1;
    return;
  }

  // Gull: white bird with a dark outline, so it holds up over the bright sky
  // glow as well as over the sea.
  const cx = obstacle.x + obstacle.w / 2;
  const cy = obstacle.h - 8;
  const beat = Math.sin(elapsed * 9 + obstacle.x * 0.05);
  const span = obstacle.w / 2;

  const wings = (): void => {
    ctx.beginPath();
    ctx.moveTo(cx - span, cy - beat * 9);
    ctx.quadraticCurveTo(cx - span * 0.4, cy - 8, cx, cy);
    ctx.quadraticCurveTo(cx + span * 0.4, cy - 8, cx + span, cy - beat * 9);
    ctx.stroke();
  };

  ctx.lineCap = 'round';
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 7;
  wings();
  ctx.strokeStyle = PALETTE.bone;
  ctx.lineWidth = 3.5;
  wings();

  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 2;
  ctx.fillStyle = PALETTE.bone;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 1, 7.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy);
  ctx.lineTo(cx + 13, cy + 1.5);
  ctx.lineTo(cx + 6, cy + 3.5);
  ctx.closePath();
  ctx.fill();
};

const drawLight = (ctx: CanvasRenderingContext2D, light: Collectible): void => {
  const bob = Math.sin(light.phase) * 3;
  const cx = light.x + light.w / 2;
  const cy = light.y + light.h / 2 + bob;

  ctx.save();
  if (light.taken) {
    const t = Math.min(1, light.fade / 0.5);
    ctx.globalAlpha = 1 - t;
    ctx.translate(cx, cy - t * 26);
    ctx.scale(1 + t * 0.7, 1 + t * 0.7);
    ctx.translate(-cx, -cy);
  }

  const halo = ctx.createRadialGradient(cx, cy, 1, cx, cy, 22);
  halo.addColorStop(0, 'rgba(240, 221, 166, 0.55)');
  halo.addColorStop(1, 'rgba(240, 221, 166, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PALETTE.goldBright;
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const drawRunner = (ctx: CanvasRenderingContext2D, world: World): void => {
  const { runner } = world;
  const ducking = runner.ducking && runner.grounded;
  const h = ducking ? RUNNER.duckHeight : RUNNER.standHeight;
  const w = RUNNER.width;
  const x = runner.x;
  const top = runner.y - h;

  // Contact shadow, which also reads as height while airborne.
  const airborne = Math.max(0, GROUND_Y - runner.y);
  ctx.fillStyle = `rgba(5, 9, 14, ${(0.55 - airborne / 260).toFixed(3)})`;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, GROUND_Y + 2, w * 0.5 + airborne * 0.05, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.fillStyle = PALETTE.bone;

  const headR = ducking ? 7 : 8;
  const headX = x + w / 2 + (ducking ? 4 : 0);
  ctx.beginPath();
  ctx.arc(headX, top + headR, headR, 0, Math.PI * 2);
  ctx.fill();

  const torsoTop = top + headR * 2 + 1;
  const torsoH = (ducking ? h * 0.45 : h * 0.42) + 2;
  ctx.save();
  if (ducking) {
    ctx.translate(x + w / 2, torsoTop);
    ctx.rotate(0.45);
    ctx.translate(-(x + w / 2), -torsoTop);
  }
  roundRect(ctx, x + 5, torsoTop, w - 10, torsoH, 5);
  ctx.fill();
  ctx.fillStyle = PALETTE.gold;
  roundRect(ctx, x + 5, torsoTop + torsoH - 5, w - 10, 4, 2);
  ctx.fill();
  ctx.restore();

  // Legs: a two-phase stride, frozen into a tuck while airborne.
  ctx.strokeStyle = PALETTE.bone;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const hipY = torsoTop + torsoH;
  const hipX = x + w / 2;
  const swing = runner.grounded ? Math.sin(runner.stride / 22) : 0.55;
  const lift = runner.grounded ? 0 : 8;

  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX + swing * 9, runner.y - lift);
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - swing * 9, runner.y - lift * 0.5);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hipX, torsoTop + 6);
  ctx.lineTo(hipX + (ducking ? 12 : -swing * 10), torsoTop + 16);
  ctx.stroke();

  ctx.restore();
};

const drawVignette = (ctx: CanvasRenderingContext2D, world: World): void => {
  const grad = ctx.createRadialGradient(
    world.width * 0.45,
    world.height * 0.5,
    world.height * 0.25,
    world.width * 0.45,
    world.height * 0.5,
    world.width * 0.78,
  );
  grad.addColorStop(0, 'rgba(5, 9, 14, 0)');
  grad.addColorStop(1, 'rgba(5, 9, 14, 0.7)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, world.width, world.height);
};

export const render = (
  ctx: CanvasRenderingContext2D,
  world: World,
  reducedMotion: boolean,
): void => {
  ctx.clearRect(0, 0, world.width, world.height);
  drawShore(ctx, world, reducedMotion);

  for (const obstacle of world.obstacles) drawObstacle(ctx, obstacle, world.elapsed);
  for (const light of world.collectibles) drawLight(ctx, light);
  drawRunner(ctx, world);
  drawVignette(ctx, world);

  if (world.flash > 0) {
    ctx.fillStyle = `rgba(240, 221, 166, ${(world.flash / 0.45) * 0.26})`;
    ctx.fillRect(0, 0, world.width, world.height);
  }
};
