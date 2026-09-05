import { WORLD_HEIGHT } from './config';
import { createInput } from './input';
import { render } from './render';
import { readBest, writeBest } from './storage';
import { createWorld, resizeWorld, startRun, step } from './world';
import type { World } from './types';

/** Fixed simulation step. Rendering runs at display rate, physics does not. */
const STEP = 1 / 120;
/** Never simulate more than this in one frame, or a backgrounded tab spirals. */
const MAX_FRAME = 0.25;

interface Elements {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  overlay: HTMLElement;
  state: HTMLElement;
  action: HTMLButtonElement;
  score: HTMLElement;
  lights: HTMLElement;
  best: HTMLElement;
  live: HTMLElement;
}

const readElements = (root: HTMLElement): Elements | null => {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-game-canvas]');
  const overlay = root.querySelector<HTMLElement>('[data-game-overlay]');
  const state = root.querySelector<HTMLElement>('[data-game-state]');
  const action = root.querySelector<HTMLButtonElement>('[data-game-action]');
  const score = root.querySelector<HTMLElement>('[data-game-score]');
  const lights = root.querySelector<HTMLElement>('[data-game-lights]');
  const best = root.querySelector<HTMLElement>('[data-game-best]');
  const live = root.querySelector<HTMLElement>('[data-game-live]');

  if (!canvas || !overlay || !state || !action || !score || !lights || !best || !live) return null;
  return { root, canvas, overlay, state, action, score, lights, best, live };
};

export const mountGame = (root: HTMLElement): (() => void) | null => {
  const el = readElements(root);
  if (!el) return null;

  const ctx = el.canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const world: World = createWorld(960, readBest());

  let frame = 0;
  let last = 0;
  let accumulator = 0;
  let visible = true;
  let scale = 1;

  const paint = (): void => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    render(ctx, world, reducedMotion);
  };

  const resize = (): void => {
    const rect = el.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    scale = (rect.height / WORLD_HEIGHT) * dpr;

    el.canvas.width = Math.round(rect.width * dpr);
    el.canvas.height = Math.round(rect.height * dpr);
    resizeWorld(world, Math.round(rect.width / (rect.height / WORLD_HEIGHT)));
    paint();
  };

  const setStatusText = (): void => {
    if (world.status === 'over') {
      const beat = Math.round(world.score) >= world.best && world.best > 0;
      const summary = `${Math.round(world.score)} · ${world.lights} ${world.lights === 1 ? 'light' : 'lights'}`;
      el.state.textContent = beat ? `New best: ${summary}.` : `That is the run. ${summary}.`;
      el.action.textContent = 'Run again';
      el.live.textContent = `Run over. Score ${Math.round(world.score)}, ${world.lights} lights, best ${world.best}.`;
    } else if (world.status === 'paused') {
      el.state.textContent = 'Paused.';
      el.action.textContent = 'Resume';
    } else {
      el.state.textContent = 'Ready when you are.';
      el.action.textContent = 'Start run';
    }
  };

  const syncHud = (): void => {
    const score = String(Math.round(world.score));
    const lights = String(world.lights);
    const best = String(world.best);
    if (el.score.textContent !== score) el.score.textContent = score;
    if (el.lights.textContent !== lights) el.lights.textContent = lights;
    if (el.best.textContent !== best) el.best.textContent = best;
  };

  const setPlaying = (playing: boolean): void => {
    el.root.classList.toggle('is-playing', playing);
    el.overlay.setAttribute('aria-hidden', playing ? 'true' : 'false');
  };

  const finishRun = (): void => {
    if (world.best > readBest()) writeBest(world.best);
    input.release();
    setPlaying(false);
    setStatusText();
    syncHud();
  };

  const tick = (now: number): void => {
    frame = window.requestAnimationFrame(tick);
    if (last === 0) last = now;

    const elapsed = Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    accumulator += elapsed;

    const wasRunning = world.status === 'running';
    while (accumulator >= STEP) {
      step(world, input.intent, STEP);
      input.tick(STEP);
      accumulator -= STEP;
    }

    if (wasRunning && world.status === 'over') finishRun();
    if (world.status === 'running') syncHud();
    paint();
  };

  const start = (): void => {
    last = 0;
    accumulator = 0;
    if (frame === 0) frame = window.requestAnimationFrame(tick);
  };

  const stop = (): void => {
    if (frame !== 0) window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const pause = (): void => {
    if (world.status !== 'running') return;
    world.status = 'paused';
    input.release();
    setPlaying(false);
    setStatusText();
  };

  const resume = (): void => {
    if (world.status !== 'paused') return;
    world.status = 'running';
    last = 0;
    setPlaying(true);
    start();
  };

  const input = createInput(el.root, {
    isPlaying: () => world.status === 'running',
    onPrimary: () => {
      if (world.status === 'paused') {
        resume();
        return;
      }
      startRun(world);
      setPlaying(true);
      syncHud();
      start();
      el.live.textContent = 'Run started.';
    },
    onTogglePause: () => {
      if (world.status === 'running') pause();
      else if (world.status === 'paused') resume();
    },
  });

  const onAction = (): void => {
    el.root.focus({ preventScroll: true });
    if (world.status === 'paused') resume();
    else {
      startRun(world);
      setPlaying(true);
      syncHud();
    }
    // The loop is parked while the panel is off screen; a deliberate start
    // must bring it back rather than leaving a frozen canvas.
    start();
  };

  const onVisibility = (): void => {
    if (document.hidden) pause();
  };

  // Only burn frames while the panel is actually on screen.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible = entry.isIntersecting;
        if (visible) start();
        else {
          pause();
          stop();
        }
      }
    },
    { threshold: 0.08 },
  );

  const resizeObserver = new ResizeObserver(() => resize());

  el.action.addEventListener('click', onAction);
  document.addEventListener('visibilitychange', onVisibility);
  observer.observe(el.root);
  resizeObserver.observe(el.canvas);

  resize();
  setStatusText();
  syncHud();

  return (): void => {
    stop();
    observer.disconnect();
    resizeObserver.disconnect();
    input.destroy();
    el.action.removeEventListener('click', onAction);
    document.removeEventListener('visibilitychange', onVisibility);
  };
};
