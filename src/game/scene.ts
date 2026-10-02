import { hash01 } from './rng.ts';
import { CORAL, INK, SKY_BLUE, SUN, WHITE, mix, mixPalette, PALETTES } from './palette.ts';
import type { Palette } from './palette.ts';
import { zoneFor } from './zones.ts';
import type { ZoneKey } from './zones.ts';

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

export interface View {
  w: number;
  h: number;
  groundY: number;
}

export interface SceneState {
  dist: number;
  time: number;
  zone: number;
  previous: number;
  blend: number;
  /** False under reduced motion: parallax stops, clouds and wheels hold still. */
  motion: boolean;
}

const PASTELS = ['#f4a6af', '#f4d88d', '#a9d8df', '#b8d6be', '#efc5a4', '#c3dce5'] as const;
const pastel = (i: number, salt: number): string => PASTELS[Math.floor(hash01(i, salt) * PASTELS.length)] ?? '#ffd6de';

/** Calls `draw` for every repeating item that is on screen. `offset` is how far the layer has scrolled. */
const tiles = (width: number, offset: number, spacing: number, draw: (index: number, x: number) => void): void => {
  const first = Math.floor(offset / spacing) - 1;
  const count = Math.ceil(width / spacing) + 3;
  for (let k = 0; k < count; k++) {
    const i = first + k;
    draw(i, i * spacing - offset);
  }
};

const rr = (c: Ctx, x: number, y: number, w: number, h: number, r: number): void => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
};

const cloud = (c: Ctx, x: number, y: number, s: number): void => {
  c.beginPath();
  c.ellipse(x, y, 34 * s, 12 * s, 0, 0, TAU);
  c.ellipse(x - 20 * s, y + 3 * s, 20 * s, 9 * s, 0, 0, TAU);
  c.ellipse(x + 22 * s, y + 3 * s, 22 * s, 9 * s, 0, 0, TAU);
  c.ellipse(x - 4 * s, y - 9 * s, 18 * s, 12 * s, 0, 0, TAU);
  c.fill();
};

/** A recognisable landmark for this little fictional coast. */
const lighthouse = (c: Ctx, x: number, base: number): void => {
  c.save();
  c.translate(x, base);
  // Low headland keeps the tower separate from the running lane.
  c.fillStyle = '#bad8c2';
  c.beginPath(); c.ellipse(0, 4, 74, 13, 0, 0, TAU); c.fill();
  c.fillStyle = '#fffaf0';
  c.beginPath(); c.moveTo(-14, 0); c.lineTo(-9, -75); c.lineTo(9, -75); c.lineTo(14, 0); c.closePath(); c.fill();
  c.fillStyle = '#ef8290';
  c.beginPath(); c.moveTo(-12, -20); c.lineTo(-11, -35); c.lineTo(11, -35); c.lineTo(12, -20); c.closePath(); c.fill();
  c.fillRect(-10, -60, 20, 11);
  c.fillStyle = '#526c76';
  rr(c, -4, -17, 8, 17, 4); c.fill();
  c.fillRect(-15, -76, 30, 3);
  c.fillStyle = '#fff0bd'; c.fillRect(-10, -90, 20, 14);
  c.strokeStyle = '#526c76'; c.lineWidth = 1.5; c.strokeRect(-10, -90, 20, 14);
  c.fillStyle = '#ef8290';
  c.beginPath(); c.moveTo(-15, -91); c.lineTo(0, -104); c.lineTo(15, -91); c.closePath(); c.fill();
  c.restore();
};

/** A tiny reading room gives the author’s game its own place in the scene. */
const readingRoom = (c: Ctx, x: number, base: number): void => {
  c.save(); c.translate(x, base);
  c.fillStyle = '#fff8e8'; rr(c, 0, -78, 94, 78, 4); c.fill();
  c.strokeStyle = '#ba9a80'; c.lineWidth = 1.25; c.stroke();
  c.fillStyle = '#bfe4e2'; c.fillRect(8, -49, 48, 35); c.fillRect(66, -49, 19, 49);
  c.strokeStyle = '#608d8d'; c.strokeRect(8, -49, 48, 35); c.strokeRect(66, -49, 19, 49);
  for (let shelf = 0; shelf < 2; shelf++) {
    for (let k = 0; k < 7; k++) {
      c.fillStyle = [CORAL, '#729caa', '#e4b656', '#87ae9c'][k % 4] ?? CORAL;
      const height = 7 + (k * 3 % 5);
      c.fillRect(12 + k * 6, -19 - shelf * 14 - height, 4, height);
    }
    c.fillStyle = '#a98f72'; c.fillRect(10, -19 - shelf * 14, 44, 2);
  }
  stripes(c, -5, -59, 104, 10, '#ef8290', '#fffaf0', 10);
  c.fillStyle = '#526c76';
  c.font = '600 8px sans-serif'; c.textAlign = 'center'; c.fillText('HARNI’S READING ROOM', 47, -66);
  c.fillStyle = '#e4b656'; c.beginPath(); c.arc(80, -23, 1.7, 0, TAU); c.fill();
  // A little book-return box beside the door.
  c.fillStyle = '#729caa'; rr(c, 104, -24, 19, 24, 3); c.fill();
  c.fillStyle = '#fffaf0'; c.fillRect(108, -19, 11, 2);
  c.restore();
};

/* ------------------------------------------------------------------ far layers */

const farBeach = (c: Ctx, v: View, p: Palette, off: number, horizon: number): void => {
  c.fillStyle = p.far;
  c.beginPath();
  c.moveTo(0, horizon + 2);
  for (let x = 0; x <= v.w; x += 20) {
    const t = (x + off * 0.5) / 190;
    c.lineTo(x, horizon - 16 - Math.sin(t) * 12 - Math.sin(t * 2.3 + 1) * 6);
  }
  c.lineTo(v.w, horizon + 2);
  c.fill();
  tiles(v.w, off, 1150, (_i, x) => lighthouse(c, x + 290, horizon - 5));
  tiles(v.w, off * 1.6, 520, (i, x) => {
    const y = horizon + 18 + hash01(i, 3) * 26;
    c.fillStyle = WHITE;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + 16, y);
    c.lineTo(x + 9, y - 20);
    c.closePath();
    c.fill();
    c.fillStyle = pastel(i, 5);
    c.beginPath();
    c.moveTo(x - 2, y + 1);
    c.lineTo(x + 18, y + 1);
    c.lineTo(x + 14, y + 6);
    c.lineTo(x + 2, y + 6);
    c.closePath();
    c.fill();
  });
};

const farPier = (c: Ctx, v: View, p: Palette, off: number, horizon: number): void => {
  tiles(v.w, off, 760, (i, x) => {
    const w = 230 + hash01(i, 1) * 90;
    c.fillStyle = p.far;
    c.fillRect(x, horizon - 6, w, 8);
    c.fillStyle = mix(p.far, WHITE, 0.4);
    for (let sx = 12; sx < w; sx += 22) c.fillRect(x + sx, horizon + 2, 3, 22);
    // arcade hall with a dome and flag
    rr(c, x + 40, horizon - 42, 90, 36, 4);
    c.fillStyle = mix(p.far, WHITE, 0.45);
    c.fill();
    c.fillStyle = pastel(i, 8);
    c.beginPath();
    c.arc(x + 85, horizon - 42, 22, Math.PI, 0);
    c.fill();
    c.fillStyle = CORAL;
    c.fillRect(x + 84, horizon - 80, 2, 16);
    c.beginPath();
    c.moveTo(x + 86, horizon - 80);
    c.lineTo(x + 98, horizon - 76);
    c.lineTo(x + 86, horizon - 72);
    c.fill();
    c.fillStyle = 'rgb(255 255 255 / 80%)';
    for (let wx = 52; wx < 120; wx += 18) c.fillRect(x + wx, horizon - 30, 8, 12);
  });
};

const farPromenade = (c: Ctx, v: View, p: Palette, off: number, base: number): void => {
  tiles(v.w, off, 74, (i, x) => {
    const h = 96 + hash01(i, 2) * 70;
    c.fillStyle = mix(pastel(i, 11), WHITE, 0.25);
    c.fillRect(x, base - h, 72, h);
    c.fillStyle = mix(p.far, '#c98a70', 0.45);
    c.beginPath();
    c.moveTo(x - 3, base - h);
    c.lineTo(x + 36, base - h - 20);
    c.lineTo(x + 75, base - h);
    c.fill();
    c.fillStyle = 'rgb(255 255 255 / 85%)';
    for (let row = 0; row < Math.floor(h / 38); row++) {
      c.fillRect(x + 12, base - h + 14 + row * 38, 14, 20);
      c.fillRect(x + 44, base - h + 14 + row * 38, 14, 20);
    }
  });
};

const farFunfair = (c: Ctx, v: View, p: Palette, off: number, base: number, s: SceneState): void => {
  tiles(v.w, off, 980, (i, x) => {
    const cx = x + 120;
    const r = 86;
    const cy = base - r - 24;
    const spin = s.motion ? s.time * 0.1 : 0.3;
    c.strokeStyle = mix(p.far, '#9bb3d6', 0.55);
    c.lineWidth = 3;
    c.beginPath();
    c.arc(cx, cy, r, 0, TAU);
    c.stroke();
    c.beginPath();
    c.arc(cx, cy, r * 0.62, 0, TAU);
    c.stroke();
    for (let k = 0; k < 8; k++) {
      const a = spin + (k / 8) * TAU;
      const gx = cx + Math.cos(a) * r;
      const gy = cy + Math.sin(a) * r;
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(gx, gy);
      c.stroke();
      c.fillStyle = pastel(k + i * 8, 4);
      rr(c, gx - 8, gy - 3, 16, 14, 4);
      c.fill();
    }
    c.strokeStyle = mix(p.far, '#9bb3d6', 0.55);
    c.beginPath();
    c.moveTo(cx - 30, base);
    c.lineTo(cx, cy);
    c.lineTo(cx + 30, base);
    c.stroke();
    c.fillStyle = CORAL;
    c.beginPath();
    c.arc(cx, cy, 6, 0, TAU);
    c.fill();
    // a few flags on the skyline
    const fx = x + 470;
    c.fillStyle = mix(p.far, WHITE, 0.4);
    c.fillRect(fx, base - 70, 3, 70);
    c.fillStyle = pastel(i, 6);
    c.beginPath();
    c.moveTo(fx + 3, base - 70);
    c.lineTo(fx + 26, base - 62);
    c.lineTo(fx + 3, base - 54);
    c.fill();
  });
};

/* ------------------------------------------------------------------ mid layers */

const stripes = (c: Ctx, x: number, y: number, w: number, h: number, a: string, b: string, n: number): void => {
  const sw = w / n;
  for (let k = 0; k < n; k++) {
    c.fillStyle = k % 2 === 0 ? a : b;
    c.fillRect(x + k * sw, y, sw + 0.5, h);
  }
};

const midBeach = (c: Ctx, v: View, off: number, base: number): void => {
  tiles(v.w, off, 300, (i, x) => {
    const ox = x + hash01(i, 9) * 120;
    if (i % 5 === 1) { readingRoom(c, ox, base); return; }
    const colour = pastel(i, 21);
    c.fillStyle = colour;
    c.fillRect(ox, base - 44, 46, 44);
    stripes(c, ox, base - 44, 46, 44, colour, WHITE, 6);
    c.fillStyle = mix(colour, '#d58a6a', 0.45);
    c.beginPath();
    c.moveTo(ox - 5, base - 44);
    c.lineTo(ox + 23, base - 62);
    c.lineTo(ox + 51, base - 44);
    c.fill();
    c.fillStyle = '#fff6e4';
    rr(c, ox + 15, base - 28, 16, 28, 3);
    c.fill();
    c.fillStyle = CORAL;
    c.fillRect(ox + 21, base - 62, 2, 0);
  });
};

const midPier = (c: Ctx, v: View, off: number, base: number): void => {
  tiles(v.w, off, 380, (i, x) => {
    const ox = x + hash01(i, 5) * 90;
    if (i % 3 === 0) { readingRoom(c, ox, base); return; }
    c.fillStyle = '#fff5e0';
    c.fillRect(ox, base - 48, 58, 48);
    stripes(c, ox - 4, base - 62, 66, 14, CORAL, WHITE, 6);
    c.fillStyle = '#cfe9f7';
    c.fillRect(ox + 8, base - 42, 42, 20);
    c.fillStyle = pastel(i, 2);
    c.fillRect(ox + 12, base - 18, 34, 18);
    c.fillStyle = INK;
    c.globalAlpha = 0.35;
    c.fillRect(ox + 28, base - 78, 2, 16);
    c.globalAlpha = 1;
  });
};

const lamp = (c: Ctx, x: number, base: number, h: number, colour: string): void => {
  c.fillStyle = colour;
  c.fillRect(x - 2, base - h, 4, h);
  c.fillRect(x - 6, base - 5, 12, 5);
  c.fillStyle = '#fff4c2';
  c.beginPath();
  c.arc(x, base - h - 5, 7, 0, TAU);
  c.fill();
  c.strokeStyle = colour;
  c.lineWidth = 2;
  c.stroke();
};

const swag = (c: Ctx, x1: number, x2: number, y: number, i: number): void => {
  c.strokeStyle = '#9aa7b3';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(x1, y);
  c.quadraticCurveTo((x1 + x2) / 2, y + 26, x2, y);
  c.stroke();
  const n = 9;
  for (let k = 1; k < n; k++) {
    const t = k / n;
    const px = x1 + (x2 - x1) * t;
    const py = y + 26 * 2 * t * (1 - t) * 0.5 * 2 - 0.5;
    c.fillStyle = k % 2 ? pastel(i + k, 3) : (k % 4 === 0 ? CORAL : SUN);
    c.beginPath();
    c.moveTo(px - 5, py);
    c.lineTo(px + 5, py);
    c.lineTo(px, py + 12);
    c.fill();
  }
};

const midPromenade = (c: Ctx, v: View, off: number, base: number): void => {
  const spacing = 260;
  tiles(v.w, off, spacing, (i, x) => {
    lamp(c, x, base, 76, '#7d97ad');
    swag(c, x, x + spacing, base - 70, i);
  });
};

const midFunfair = (c: Ctx, v: View, off: number, base: number): void => {
  tiles(v.w, off, 420, (i, x) => {
    const ox = x + hash01(i, 7) * 80;
    const colour = i % 2 ? CORAL : SKY_BLUE;
    stripes(c, ox, base - 46, 70, 46, colour, WHITE, 8);
    c.fillStyle = colour;
    c.beginPath();
    c.moveTo(ox - 6, base - 46);
    c.lineTo(ox + 35, base - 78);
    c.lineTo(ox + 76, base - 46);
    c.fill();
    c.fillStyle = SUN;
    c.beginPath();
    c.arc(ox + 35, base - 80, 4, 0, TAU);
    c.fill();
    c.fillStyle = 'rgb(255 255 255 / 70%)';
    rr(c, ox + 22, base - 30, 26, 30, 3);
    c.fill();
  });
};

/* ------------------------------------------------------------------ near layers */

const nearBeach = (c: Ctx, v: View, off: number, base: number): void => {
  tiles(v.w, off, 170, (i, x) => {
    const r = hash01(i, 4);
    const ox = x + hash01(i, 6) * 90;
    if (r < 0.34) {
      // deckchair
      stripes(c, ox, base - 20, 20, 5, CORAL, WHITE, 4);
      c.save();
      c.translate(ox + 2, base - 14);
      c.rotate(-0.5);
      stripes(c, 0, 0, 5, 22, CORAL, WHITE, 1);
      c.fillStyle = CORAL;
      c.fillRect(0, 0, 6, 22);
      c.fillStyle = WHITE;
      c.fillRect(2, 0, 2, 22);
      c.restore();
      c.strokeStyle = '#c99a62';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(ox + 4, base - 15);
      c.lineTo(ox + 1, base);
      c.moveTo(ox + 18, base - 15);
      c.lineTo(ox + 22, base);
      c.stroke();
    } else if (r < 0.67) {
      // sandcastle with a flag
      c.fillStyle = '#f0cc8a';
      c.fillRect(ox, base - 14, 26, 14);
      for (let k = 0; k < 3; k++) c.fillRect(ox + k * 10, base - 19, 6, 5);
      c.fillRect(ox + 8, base - 26, 10, 12);
      c.fillStyle = CORAL;
      c.fillRect(ox + 13, base - 36, 1.6, 10);
      c.beginPath();
      c.moveTo(ox + 14.6, base - 36);
      c.lineTo(ox + 22, base - 33);
      c.lineTo(ox + 14.6, base - 30);
      c.fill();
    } else {
      // parasol
      c.strokeStyle = '#b8c4cd';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(ox + 14, base);
      c.lineTo(ox + 14, base - 38);
      c.stroke();
      c.fillStyle = pastel(i, 12);
      c.beginPath();
      c.arc(ox + 14, base - 38, 22, Math.PI, 0);
      c.fill();
      c.fillStyle = WHITE;
      c.beginPath();
      c.arc(ox + 14, base - 38, 22, Math.PI * 1.34, Math.PI * 1.66);
      c.lineTo(ox + 14, base - 38);
      c.fill();
    }
  });
};

const nearPier = (c: Ctx, v: View, off: number, base: number): void => {
  // A continuous white railing with a lifebuoy now and then.
  c.fillStyle = 'rgb(255 255 255 / 90%)';
  c.fillRect(0, base - 26, v.w, 3);
  tiles(v.w, off, 44, (_i, x) => {
    c.fillRect(x, base - 26, 4, 26);
  });
  tiles(v.w, off, 620, (i, x) => {
    const cx = x + hash01(i, 2) * 100;
    c.strokeStyle = CORAL;
    c.lineWidth = 6;
    c.beginPath();
    c.arc(cx, base - 17, 9, 0, TAU);
    c.stroke();
    c.strokeStyle = WHITE;
    c.lineWidth = 6;
    c.setLineDash([6, 15]);
    c.beginPath();
    c.arc(cx, base - 17, 9, 0, TAU);
    c.stroke();
    c.setLineDash([]);
  });
};

const nearPromenade = (c: Ctx, v: View, off: number, base: number): void => {
  tiles(v.w, off, 190, (i, x) => {
    const ox = x + hash01(i, 8) * 70;
    c.fillStyle = '#8fb4c9';
    rr(c, ox, base - 14, 30, 14, 3);
    c.fill();
    for (let k = 0; k < 5; k++) {
      c.fillStyle = k % 2 ? CORAL : pastel(i + k, 14);
      c.beginPath();
      c.arc(ox + 4 + k * 5.5, base - 18 - ((k * 7) % 5), 4.6, 0, TAU);
      c.fill();
    }
  });
};

const nearFunfair = (c: Ctx, v: View, off: number, base: number, s: SceneState): void => {
  tiles(v.w, off, 230, (i, x) => {
    const ox = x + hash01(i, 3) * 90;
    const sway = s.motion ? Math.sin(s.time * 1.4 + i) * 2 : 0;
    c.strokeStyle = 'rgb(34 34 34 / 22%)';
    c.lineWidth = 1;
    for (let k = 0; k < 3; k++) {
      const bx = ox + k * 13 + sway;
      const by = base - 58 - k * 8;
      c.beginPath();
      c.moveTo(ox + 13, base);
      c.lineTo(bx, by);
      c.stroke();
      c.fillStyle = [CORAL, SUN, SKY_BLUE][k] ?? CORAL;
      c.beginPath();
      c.ellipse(bx, by - 8, 8, 10, 0, 0, TAU);
      c.fill();
    }
  });
};

/* ------------------------------------------------------------------ ground */

const groundMarks = (c: Ctx, v: View, key: ZoneKey, p: Palette, dist: number): void => {
  const top = v.groundY;
  const depth = v.h - top;
  c.fillStyle = p.groundMark;
  if (key === 'beach') {
    tiles(v.w, dist, 46, (i, x) => {
      const y = top + 10 + hash01(i, 1) * (depth - 16);
      c.beginPath();
      c.ellipse(x + hash01(i, 2) * 30, y, 2 + hash01(i, 3) * 2.4, 1.4, 0, 0, TAU);
      c.fill();
    });
  } else if (key === 'pier') {
    c.fillRect(0, top + depth * 0.5, v.w, 1.5);
    tiles(v.w, dist, 64, (_i, x) => c.fillRect(x, top, 1.5, depth));
  } else if (key === 'promenade') {
    c.fillRect(0, top + depth * 0.5, v.w, 1.5);
    tiles(v.w, dist, 90, (i, x) => c.fillRect(x + (i % 2) * 45, top + (i % 2 ? depth * 0.5 : 0), 1.5, depth * 0.5));
  } else {
    tiles(v.w, dist, 52, (i, x) => {
      c.fillStyle = i % 2 ? p.groundMark : mix(p.ground, WHITE, 0.4);
      c.fillRect(x, top + 5, 52, depth);
    });
  }
};

/* ------------------------------------------------------------------ scene */

const withAlpha = (c: Ctx, alpha: number, fn: () => void): void => {
  if (alpha <= 0.01) return;
  c.save();
  c.globalAlpha = alpha;
  fn();
  c.restore();
};

export const drawScene = (c: Ctx, v: View, s: SceneState): void => {
  const to = PALETTES[zoneFor(s.zone).key];
  const from = PALETTES[zoneFor(s.previous).key];
  const p = mixPalette(from, to, s.blend);
  const parallax = s.motion ? 1 : 0;
  const slowDrift = s.motion ? s.time : 0;
  const horizon = v.groundY - Math.max(96, Math.min(210, v.h * 0.4));
  const back = v.groundY - 26;

  const sky = c.createLinearGradient(0, 0, 0, v.groundY);
  sky.addColorStop(0, p.skyTop);
  sky.addColorStop(1, p.skyBottom);
  c.fillStyle = sky;
  c.fillRect(0, 0, v.w, v.h);

  // Sun with a soft halo, and a few slow clouds.
  const sx = v.w * 0.8;
  const sy = Math.max(46, horizon * 0.42);
  const halo = c.createRadialGradient(sx, sy, 6, sx, sy, 90);
  halo.addColorStop(0, 'rgb(255 244 190 / 85%)');
  halo.addColorStop(1, 'rgb(255 244 190 / 0%)');
  c.fillStyle = halo;
  c.fillRect(sx - 100, sy - 100, 200, 200);
  c.fillStyle = p.sun;
  c.beginPath();
  c.arc(sx, sy, 24, 0, TAU);
  c.fill();
  c.fillStyle = 'rgb(255 255 255 / 92%)';
  tiles(v.w, s.dist * 0.02 * parallax + slowDrift * 5, 340, (i, x) => {
    cloud(c, x + hash01(i, 1) * 140, 28 + hash01(i, 2) * Math.max(20, horizon * 0.5), 0.7 + hash01(i, 3) * 0.7);
  });

  // The sea, with light stripes of waves and glints.
  const sea = c.createLinearGradient(0, horizon, 0, back);
  sea.addColorStop(0, p.seaLight);
  sea.addColorStop(1, p.sea);
  c.fillStyle = sea;
  c.fillRect(0, horizon, v.w, back - horizon + 2);
  c.strokeStyle = 'rgb(255 255 255 / 55%)';
  c.lineWidth = 2;
  c.lineCap = 'round';
  for (let row = 0; row < 3; row++) {
    const y = horizon + 18 + row * ((back - horizon - 24) / 3);
    tiles(v.w, s.dist * (0.05 + row * 0.04) * parallax + slowDrift * (4 + row * 3), 120 - row * 10, (i, x) => {
      const ox = x + hash01(i + row * 50, 1) * 50;
      c.beginPath();
      c.moveTo(ox, y);
      c.quadraticCurveTo(ox + 9, y - 4, ox + 18, y);
      c.quadraticCurveTo(ox + 27, y + 4, ox + 36, y);
      c.stroke();
    });
  }

  const farOff = s.dist * 0.1 * parallax;
  const midOff = s.dist * 0.32 * parallax;
  const nearOff = s.dist * 0.62 * parallax;
  const layers = (key: ZoneKey, alpha: number): void => {
    withAlpha(c, alpha, () => {
      if (key === 'beach') farBeach(c, v, p, farOff, horizon);
      else if (key === 'pier') farPier(c, v, p, farOff, horizon);
      else if (key === 'promenade') farPromenade(c, v, p, farOff, back);
      else farFunfair(c, v, p, farOff, back, s);
    });
  };
  if (s.blend < 1) layers(zoneFor(s.previous).key, 1 - s.blend);
  layers(zoneFor(s.zone).key, s.blend < 1 ? s.blend : 1);

  // Back strip: the pavement or sand just behind the running lane.
  c.fillStyle = p.back;
  c.fillRect(0, back, v.w, v.groundY - back + 1);

  const mid = (key: ZoneKey, alpha: number): void => {
    withAlpha(c, alpha, () => {
      const base = back + 4;
      if (key === 'beach') midBeach(c, v, midOff, base);
      else if (key === 'pier') midPier(c, v, midOff, base);
      else if (key === 'promenade') midPromenade(c, v, midOff, base);
      else midFunfair(c, v, midOff, base);
    });
  };
  if (s.blend < 1) mid(zoneFor(s.previous).key, 1 - s.blend);
  mid(zoneFor(s.zone).key, s.blend < 1 ? s.blend : 1);

  // Ground.
  c.fillStyle = p.ground;
  c.fillRect(0, v.groundY, v.w, v.h - v.groundY);
  groundMarks(c, v, zoneFor(s.blend > 0.5 ? s.zone : s.previous).key, p, s.dist);
  c.fillStyle = p.groundEdge;
  c.fillRect(0, v.groundY, v.w, 4);

  const near = (key: ZoneKey, alpha: number): void => {
    withAlpha(c, alpha * 0.6, () => {
      // Decorative furniture stays behind the playable lane, lighter than hazards.
      const base = v.groundY - 34;
      if (key === 'beach') nearBeach(c, v, nearOff, base);
      else if (key === 'pier') nearPier(c, v, nearOff, base);
      else if (key === 'promenade') nearPromenade(c, v, nearOff, base);
      else nearFunfair(c, v, nearOff, base, s);
    });
  };
  if (s.blend < 1) near(zoneFor(s.previous).key, 1 - s.blend);
  near(zoneFor(s.zone).key, s.blend < 1 ? s.blend : 1);
};
