import type { ZoneKey } from './zones.ts';

/** Bright daytime palettes. Nothing here is dark: every zone is sunny or soft golden hour. */
export interface Palette {
  skyTop: string;
  skyBottom: string;
  sun: string;
  sea: string;
  seaLight: string;
  far: string;
  mid: string;
  back: string;
  ground: string;
  groundEdge: string;
  groundMark: string;
}

export const PALETTES: Record<ZoneKey, Palette> = {
  beach: {
    skyTop: '#b4e6ff', skyBottom: '#f2fbff', sun: '#fff1b8', sea: '#7fd8e6', seaLight: '#b9eef4',
    far: '#cfe9f4', mid: '#f4ead2', back: '#fbeccb', ground: '#f8e3b0', groundEdge: '#efc98a', groundMark: '#e6bd7a',
  },
  pier: {
    skyTop: '#c2ecff', skyBottom: '#fff7e1', sun: '#fff0b0', sea: '#6ec7e0', seaLight: '#add9ea',
    far: '#d6e8f3', mid: '#f1e2c8', back: '#f3dcb6', ground: '#ecd0a2', groundEdge: '#d9ae78', groundMark: '#cf9f68',
  },
  promenade: {
    skyTop: '#cbeeff', skyBottom: '#fff0db', sun: '#ffe2a0', sea: '#92d2e2', seaLight: '#cbe8ee',
    far: '#f5dccb', mid: '#f7e8da', back: '#f3e3d2', ground: '#f2e4d4', groundEdge: '#ddc8b2', groundMark: '#cdb59c',
  },
  funfair: {
    skyTop: '#bdeef7', skyBottom: '#fff0f5', sun: '#fff0b8', sea: '#8bdce4', seaLight: '#c6f0f2',
    far: '#e1ecfa', mid: '#fff0d8', back: '#fdeccf', ground: '#fbe8c9', groundEdge: '#f4c4cf', groundMark: '#f0b3c2',
  },
};

/** Fixed accents shared by every zone. The coral is the highlight, as on the rest of the site. */
export const INK = '#222222';
export const CORAL = '#ff385c';
export const CORAL_DEEP = '#e00b41';
export const SUN = '#ffc93c';
export const SKY_BLUE = '#3da5f4';
export const MINT = '#7ed6b2';
export const SKIN = '#c98d62';
export const WHITE = '#ffffff';

const cache = new Map<string, [number, number, number]>();

const parse = (hex: string): [number, number, number] => {
  const hit = cache.get(hex);
  if (hit) return hit;
  let rgb: [number, number, number];
  if (hex.startsWith('rgb')) {
    const parts = hex.match(/\d+/g) ?? [];
    rgb = [Number(parts[0] ?? 0), Number(parts[1] ?? 0), Number(parts[2] ?? 0)];
  } else {
    const n = Number.parseInt(hex.slice(1), 16);
    rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  cache.set(hex, rgb);
  return rgb;
};

export const mix = (a: string, b: string, t: number): string => {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const f = (x: number, y: number): number => Math.round(x + (y - x) * t);
  return `rgb(${f(ar, br)} ${f(ag, bg)} ${f(ab, bb)})`;
};

export const mixPalette = (a: Palette, b: Palette, t: number): Palette => {
  const out = { ...a };
  for (const key of Object.keys(a) as Array<keyof Palette>) {
    out[key] = mix(a[key], b[key], t);
  }
  return out;
};
