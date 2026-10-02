import { MAX_FRAME, STEP } from './config.ts';
import { bindConsent } from './consent.ts';
import { createEffects } from './effects.ts';
import { createHud } from './hud.ts';
import { createInput } from './input.ts';
import { createSfx } from './audio.ts';
import { fitView, render } from './render.ts';
import type { View } from './render.ts';
import { zoneFor } from './zones.ts';
import { createWorld, drainEvents, idle, pause, resize, resume, startRun, step } from './world.ts';
import type { GameEvent, World } from './types.ts';

const CORALS = ['#ff385c', '#ffc93c', '#3da5f4', '#ffffff'] as const;
const DUST = ['#fff6e0', '#f3dcae'] as const;
const WATER = ['#7fd3f0', '#c9f0fb', '#ffffff'] as const;
const GLINT = ['#ffffff', '#ffe27a', '#ffb3c1'] as const;
/** Ignore restart presses for this long after a run ends, so a final jump press cannot skip the result. */
const OVER_LOCK_MS = 700;
const BOUNCE_SECONDS = 0.24;

const newSeed = (): number => {
  const bytes = new Uint32Array(1);
  window.crypto.getRandomValues(bytes);
  return bytes[0] ?? Date.now();
};

export const mountGame = (root: HTMLElement): (() => void) | null => {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-game-canvas]');
  const stage = root.querySelector<HTMLElement>('[data-game-stage]');
  const action = root.querySelector<HTMLButtonElement>('[data-game-action]');
  const ctx = canvas?.getContext('2d') ?? null;
  if (!canvas || !stage || !action || !ctx) return null;
  const pauseButton = document.querySelector<HTMLButtonElement>('[data-pause-game]');
  const soundButton = document.querySelector<HTMLButtonElement>('[data-sound-toggle]');

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const world: World = createWorld({ seed: newSeed(), reducedMotion: motionQuery.matches });
  const fx = createEffects(Math.random);
  const sfx = createSfx();
  const hud = createHud(root, action, pauseButton);
  const consent = bindConsent({
    current: () => world.best,
    onBest: (best) => {
      world.best = best;
      hud.update(world);
    },
  });
  world.best = consent.stored();

  let view: View = { w: 800, h: 360, groundY: 302 };
  let scale = 1;
  let frame = 0;
  let last = 0;
  let acc = 0;
  let boostClock = 0;
  let bounceLeft = 0;
  let pixelRatio = 1;
  let overAt = 0;
  let visible = true;

  const motion = (): boolean => !world.reducedMotion;

  const paint = (): void => {
    // One smooth dip after a hit, never a shake.
    const dip = bounceLeft > 0 ? Math.sin((1 - bounceLeft / BOUNCE_SECONDS) * Math.PI) * 4 : 0;
    const k = scale * pixelRatio;
    ctx.setTransform(k, 0, 0, k, 0, dip * k);
    render(ctx, world, view, fx, motion());
  };

  const resizeCanvas = (): void => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    pixelRatio = dpr;
    const fit = fitView(rect.width, rect.height);
    scale = fit.scale;
    view = fit.view;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    resize(world, view.w);
    paint();
  };

  const animating = (): boolean => visible && (world.status === 'running' || (world.status === 'ready' && motion()) || (world.status !== 'paused' && (fx.list.length > 0 || bounceLeft > 0)));

  const react = (events: ReadonlyArray<GameEvent>): void => {
    const fxOn = motion();
    const y = world.player.y;
    for (const e of events) {
      switch (e.type) {
        case 'jump': case 'airJump':
          sfx.play('jump', e.type === 'airJump' ? 1.25 : 1);
          if (fxOn) fx.burst('dust', e.type === 'jump' ? 5 : 3, -6, y, DUST);
          break;
        case 'bounce':
          sfx.play('jump', 1.2);
          hud.announce('Beach-ball bounce!');
          if (fxOn) fx.burst('spark', 9, 0, y, CORALS);
          break;
        case 'land':
          if (fxOn) fx.burst('dust', 6, 0, 0, DUST);
          break;
        case 'book':
          sfx.play('pickup', 1 + Math.min(e.value, 5) * 0.08);
          if (fxOn) fx.burst('spark', 4, 8, y + 30, GLINT);
          break;
        case 'near':
          if (fxOn) fx.burst('spark', 5, 0, y + 58, GLINT);
          sfx.play('pickup', 1.3);
          break;
        case 'heart':
          sfx.play('power');
          hud.announce(`Heart collected. ${e.value} ${e.value === 1 ? 'heart' : 'hearts'}.`);
          if (fxOn) fx.burst('confetti', 8, 4, y + 34, ['#ff385c', '#ffb3c1', '#ffffff']);
          break;
        case 'power':
          sfx.play('power');
          hud.announce(e.value === 0 ? 'Ice cream shield.' : e.value === 1 ? 'Kite glide. Hold jump to float.' : 'Tea boost.');
          if (fxOn) fx.burst('confetti', 12, 4, y + 34, CORALS);
          break;
        case 'hit':
          sfx.play('hit');
          if (fxOn) {
            fx.burst('splash', 7, 4, y + 30, ['#ffb3c1', '#ffffff']);
            bounceLeft = BOUNCE_SECONDS;
          }
          if (e.value > 0) hud.announce(`Ouch. ${e.value} ${e.value === 1 ? 'heart' : 'hearts'} left.`);
          break;
        case 'shieldBreak':
          sfx.play('hit', 1.4);
          hud.announce('Shield used.');
          if (fxOn) fx.burst('spark', 10, 0, y + 30, ['#ffffff', '#ff385c']);
          break;
        case 'smash':
          sfx.play('hit', 1.6);
          if (fxOn) fx.burst('confetti', 9, 30, y + 14, CORALS);
          break;
        case 'puddle':
          if (fxOn) fx.burst('splash', 9, 6, 2, WATER);
          break;
        case 'zone':
          hud.announce(`${zoneFor(e.value).name}.`);
          break;
        case 'over':
          sfx.play('over');
          finishRun();
          break;
        case 'start':
        case 'comboLost':
          break;
      }
    }
  };

  const finishRun = (): void => {
    overAt = performance.now();
    input.release();
    consent.remember(world.best);
    hud.update(world);
    hud.showOver(world);
    hud.setPauseButton(world.status);
    root.classList.remove('is-playing');
    hud.announce(`Run over. Score ${world.score}. ${world.books} ${world.books === 1 ? 'book' : 'books'}. Best ${world.best}.`);
    hud.focusAction();
  };

  const tick = (now: number): void => {
    frame = 0;
    if (last === 0) last = now;
    const dt = Math.min(Math.max((now - last) / 1000, 0), MAX_FRAME);
    last = now;

    if (world.status === 'running') {
      acc += dt;
      while (acc >= STEP && world.status === 'running') {
        step(world, input.intent, STEP);
        acc -= STEP;
      }
      if (motion() && world.power.boost > 0) {
        boostClock += dt;
        if (boostClock > 0.06) {
          boostClock = 0;
          fx.burst('streak', 1, -24, world.player.y + 10 + Math.random() * 38, ['#ffffff']);
        }
      }
    } else if (world.status === 'ready') {
      idle(world, dt);
    }
    if (world.status !== 'paused') {
      bounceLeft = Math.max(0, bounceLeft - dt);
      fx.update(dt, world.status === 'running' ? world.speed : 0);
    }
    react(drainEvents(world));
    if (world.status === 'running') hud.update(world);
    paint();
    if (animating()) schedule();
    else last = 0;
  };

  const schedule = (): void => {
    if (frame === 0) frame = window.requestAnimationFrame(tick);
  };

  const wake = (): void => {
    last = 0;
    acc = 0;
    schedule();
  };

  const begin = (): void => {
    if (world.status === 'over' && performance.now() - overAt < OVER_LOCK_MS) return;
    if (world.status === 'paused') {
      resumeRun();
      return;
    }
    if (world.status === 'running') return;
    fx.clear();
    startRun(world, newSeed());
    input.release();
    hud.hideOverlay();
    hud.update(world);
    hud.setPauseButton(world.status);
    root.classList.add('is-playing');
    root.focus({ preventScroll: true });
    hud.announce('Run started.');
    wake();
  };

  const pauseRun = (): void => {
    if (!pause(world)) return;
    input.release();
    root.classList.remove('is-playing');
    hud.showPaused();
    hud.setPauseButton(world.status);
    hud.announce('Paused.');
    schedule();
  };

  function resumeRun(): void {
    if (!resume(world)) return;
    hud.hideOverlay();
    hud.setPauseButton(world.status);
    root.classList.add('is-playing');
    root.focus({ preventScroll: true });
    hud.announce('Resumed.');
    wake();
  }

  const togglePause = (): void => {
    if (world.status === 'running') pauseRun();
    else if (world.status === 'paused') resumeRun();
  };

  const input = createInput(root, stage, {
    status: () => world.status,
    onStart: begin,
    onTogglePause: togglePause,
  });

  const onAction = (): void => {
    begin();
    if (world.status === 'over') return;
    root.focus({ preventScroll: true });
  };
  const onPauseButton = (): void => togglePause();
  const onVisibility = (): void => {
    if (document.hidden) pauseRun();
  };
  const onMotion = (): void => {
    world.reducedMotion = motionQuery.matches;
    if (world.reducedMotion) fx.clear();
    wake();
  };
  const onSound = (): void => {
    if (!soundButton) return;
    const wanted = !sfx.enabled;
    const on = sfx.setEnabled(wanted);
    soundButton.textContent = on ? 'Sound: on' : 'Sound: off';
    if (on) sfx.play('pickup');
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (!visible) pauseRun();
      else wake();
    }
  }, { threshold: 0.1 });
  const resizeObserver = new ResizeObserver(() => resizeCanvas());

  action.addEventListener('click', onAction);
  pauseButton?.addEventListener('click', onPauseButton);
  soundButton?.addEventListener('click', onSound);
  document.addEventListener('visibilitychange', onVisibility);
  motionQuery.addEventListener('change', onMotion);
  observer.observe(root);
  resizeObserver.observe(canvas);

  hud.showReady();
  hud.update(world);
  hud.setPauseButton(world.status);
  resizeCanvas();
  wake();

  return (): void => {
    if (frame !== 0) window.cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    input.destroy();
    consent.destroy();
    action.removeEventListener('click', onAction);
    pauseButton?.removeEventListener('click', onPauseButton);
    soundButton?.removeEventListener('click', onSound);
    document.removeEventListener('visibilitychange', onVisibility);
    motionQuery.removeEventListener('change', onMotion);
  };
};
