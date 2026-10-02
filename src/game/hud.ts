import { HEARTS } from './config.ts';
import { comboMultiplier } from './scoring.ts';
import type { World } from './types.ts';

const need = <T extends Element>(root: ParentNode, selector: string): T => {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Pier Run: missing ${selector}`);
  return el;
};

const SVG = 'http://www.w3.org/2000/svg';
const HEART_PATH = 'M12 21.3l-1.4-1.3C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.6 11.5L12 21.3z';

const heartIcon = (): HTMLElement => {
  const span = document.createElement('span');
  span.className = 'hud__heart';
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG, 'path');
  path.setAttribute('d', HEART_PATH);
  svg.append(path);
  span.append(svg);
  return span;
};

const LINES = {
  low: 'A few pages, a little sea air. There’s always another route.',
  mid: 'Books collected. A little headspace found.',
  high: 'What a run! The sea air clearly suits you.',
} as const;

export interface Hud {
  /** Cheap: only touches the DOM when a value changed. */
  update: (w: World) => void;
  showReady: () => void;
  showPaused: () => void;
  showOver: (w: World) => void;
  hideOverlay: () => void;
  announce: (message: string) => void;
  focusAction: () => void;
  setPauseButton: (status: World['status']) => void;
}

export const createHud = (root: HTMLElement, action: HTMLButtonElement, pauseButton: HTMLButtonElement | null): Hud => {
  const overlay = need<HTMLElement>(root, '[data-game-overlay]');
  const title = need<HTMLElement>(root, '[data-game-title]');
  const text = need<HTMLElement>(root, '[data-game-text]');
  const result = need<HTMLElement>(root, '[data-game-result]');
  const books = need<HTMLAnchorElement>(root, '[data-game-books]');
  const live = need<HTMLElement>(root, '[data-game-live]');
  const score = need<HTMLElement>(root, '[data-hud-score]');
  const bookCount = need<HTMLElement>(root, '[data-hud-books]');
  const best = need<HTMLElement>(root, '[data-hud-best]');
  const hearts = need<HTMLElement>(root, '[data-hud-hearts]');
  const combo = need<HTMLElement>(root, '[data-hud-combo]');
  const power = need<HTMLElement>(root, '[data-hud-power]');
  const routeStops = Array.from(root.querySelectorAll<HTMLElement>('[data-route-stop]'));
  let shownZone = -1;
  const rScore = need<HTMLElement>(root, '[data-result-score]');
  const rBooks = need<HTMLElement>(root, '[data-result-books]');
  const rBest = need<HTMLElement>(root, '[data-result-best]');

  const icons = Array.from({ length: HEARTS.max }, heartIcon);
  hearts.replaceChildren(...icons);

  const cache = new Map<HTMLElement, string>();
  const set = (el: HTMLElement, value: string): void => {
    if (cache.get(el) === value) return;
    cache.set(el, value);
    el.textContent = value;
  };

  const showCard = (heading: string, line: string, actionLabel: string, withResult: boolean): void => {
    set(title, heading);
    set(text, line);
    set(action, actionLabel);
    result.hidden = !withResult;
    books.hidden = !withResult;
    overlay.hidden = false;
  };

  return {
    update: (w) => {
      if (shownZone !== w.zone.index) {
        shownZone = w.zone.index;
        routeStops.forEach((stop, index) => {
          if (index === ((w.zone.index % 4) + 4) % 4) stop.setAttribute('aria-current', 'location');
          else stop.removeAttribute('aria-current');
        });
      }
      set(score, String(w.score));
      set(bookCount, String(w.books));
      set(best, String(Math.max(w.best, 0)));
      icons.forEach((icon, i) => icon.classList.toggle('is-full', i < w.hearts));
      const mult = comboMultiplier(w.combo.count);
      set(combo, mult > 1 ? `Combo x${mult}` : '');
      combo.hidden = mult <= 1;
      const bits: string[] = [];
      if (w.power.shield) bits.push('Shield');
      if (w.power.glide > 0) bits.push(`Glide ${Math.ceil(w.power.glide)}s`);
      if (w.power.boost > 0) bits.push(`Boost ${Math.ceil(w.power.boost)}s`);
      set(power, bits.join(' · '));
      power.hidden = bits.length === 0;
    },
    showReady: () => showCard('Small hero. Big sea air.', 'Jump twice. Bounce on beach balls. Collect books.', 'Start run', false),
    showPaused: () => showCard('Paused', 'Take your time.', 'Resume', false),
    showOver: (w) => {
      const heading = w.newBest && w.score > 0 ? 'A new best!' : 'Nice run!';
      showCard(heading, w.score < 120 ? LINES.low : w.score < 400 ? LINES.mid : LINES.high, 'Play again', true);
      set(rScore, String(w.score));
      set(rBooks, String(w.books));
      set(rBest, String(w.best));
    },
    hideOverlay: () => {
      overlay.hidden = true;
    },
    announce: (message) => {
      live.textContent = '';
      // A tick later so a repeated message is read out again.
      window.setTimeout(() => { live.textContent = message; }, 30);
    },
    focusAction: () => action.focus({ preventScroll: true }),
    setPauseButton: (status) => {
      if (!pauseButton) return;
      pauseButton.disabled = status !== 'running' && status !== 'paused';
      pauseButton.textContent = status === 'paused' ? 'Resume' : 'Pause';
    },
  };
};
