export type ParticleKind = 'dust' | 'spark' | 'splash' | 'confetti' | 'streak';

export interface Particle {
  kind: ParticleKind;
  /** Position relative to the runner's feet: x forwards, y up. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  colour: string;
}

export interface Effects {
  list: Particle[];
  burst: (kind: ParticleKind, count: number, x: number, y: number, colours: readonly string[]) => void;
  update: (dt: number, scroll: number) => void;
  clear: () => void;
}

const LIMIT = 140;

interface Look {
  life: [number, number];
  speed: number;
  up: number;
  gravity: number;
  size: [number, number];
}

const LOOKS: Record<ParticleKind, Look> = {
  dust: { life: [0.3, 0.5], speed: 40, up: 22, gravity: -20, size: [3, 6] },
  spark: { life: [0.4, 0.7], speed: 90, up: 70, gravity: 160, size: [2, 4] },
  splash: { life: [0.35, 0.55], speed: 70, up: 120, gravity: 520, size: [2, 4] },
  confetti: { life: [0.7, 1.1], speed: 110, up: 150, gravity: 300, size: [3, 5] },
  streak: { life: [0.18, 0.28], speed: 30, up: 6, gravity: 0, size: [14, 26] },
};

/** Tiny particle pool. `random` is injected so tests can run it without any DOM. */
export const createEffects = (random: () => number): Effects => {
  const list: Particle[] = [];
  return {
    list,
    burst: (kind, count, x, y, colours) => {
      const look = LOOKS[kind];
      for (let i = 0; i < count && list.length < LIMIT; i++) {
        const life = look.life[0] + (look.life[1] - look.life[0]) * random();
        list.push({
          kind,
          x: x + (random() - 0.5) * 8,
          y: y + (random() - 0.5) * 6,
          vx: (random() - 0.5) * 2 * look.speed - (kind === 'streak' || kind === 'dust' ? look.speed * 0.5 : 0),
          vy: look.up * (0.4 + random()),
          life,
          max: life,
          size: look.size[0] + (look.size[1] - look.size[0]) * random(),
          colour: colours[Math.floor(random() * colours.length)] ?? '#ffffff',
        });
      }
    },
    update: (dt, scroll) => {
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        if (!p) continue;
        p.life -= dt;
        if (p.life <= 0) {
          list.splice(i, 1);
          continue;
        }
        p.vy -= LOOKS[p.kind].gravity * dt;
        p.x += (p.vx - scroll) * dt;
        p.y = Math.max(0, p.y + p.vy * dt);
      }
    },
    clear: () => {
      list.length = 0;
    },
  };
};
