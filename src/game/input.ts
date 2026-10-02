import type { Intent, Status } from './types.ts';

export interface InputHandlers {
  status: () => Status;
  /** Space, up or a tap on the game while it is not running: start or resume. */
  onStart: () => void;
  onTogglePause: () => void;
}

export interface InputController {
  intent: Intent;
  /** Lets go of everything, for example when the game pauses or the tab loses focus. */
  release: () => void;
  destroy: () => void;
}

const JUMP_KEYS = new Set(['Space', 'ArrowUp', 'KeyW']);
const DUCK_KEYS = new Set(['ArrowDown', 'KeyS']);
const PAUSE_KEYS = new Set(['KeyP', 'Escape']);

/** Downward travel in CSS pixels that turns a drag into a duck. */
const SWIPE = 22;
/** A touch waits this long so a swipe down is not mistaken for a jump. */
const TOUCH_DELAY_MS = 55;

const isField = (el: EventTarget | null): boolean =>
  el instanceof HTMLElement && el.closest('input, select, textarea') !== null;

export const createInput = (root: HTMLElement, stage: HTMLElement, handlers: InputHandlers): InputController => {
  const intent: Intent = { jumpHeld: false, jumpPressed: false, duck: false };
  let pointerId: number | null = null;
  let startY = 0;
  let pending: number | null = null;
  let decided = false;

  const press = (): void => {
    intent.jumpPressed = true;
    intent.jumpHeld = true;
  };

  const clearPending = (): void => {
    if (pending !== null) window.clearTimeout(pending);
    pending = null;
  };

  const release = (): void => {
    clearPending();
    intent.jumpHeld = false;
    intent.jumpPressed = false;
    intent.duck = false;
    pointerId = null;
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.metaKey || event.ctrlKey || event.altKey || isField(event.target)) return;
    const status = handlers.status();
    const target = event.target instanceof HTMLElement ? event.target : null;
    const onControl = target !== null && target.closest('button, a, summary') !== null;

    if (PAUSE_KEYS.has(event.code)) {
      if (status === 'running' || status === 'paused') {
        event.preventDefault();
        handlers.onTogglePause();
      }
      return;
    }
    if (JUMP_KEYS.has(event.code)) {
      // Space must activate focused buttons and links, not steal their keyboard action.
      if (onControl) return;
      if (status === 'running') {
        event.preventDefault();
        if (!event.repeat) press();
        else intent.jumpHeld = true;
      } else if (event.target === root && !event.repeat) {
        // Only when the game itself has focus, otherwise space must keep scrolling the page.
        event.preventDefault();
        handlers.onStart();
      }
      return;
    }
    if (DUCK_KEYS.has(event.code) && status === 'running' && !onControl) {
      event.preventDefault();
      intent.duck = true;
    }
  };

  const onKeyUp = (event: KeyboardEvent): void => {
    if (JUMP_KEYS.has(event.code)) intent.jumpHeld = false;
    if (DUCK_KEYS.has(event.code)) intent.duck = false;
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (event.target instanceof HTMLElement && event.target.closest('button, a')) return;
    root.focus({ preventScroll: true });
    const status = handlers.status();
    if (status === 'ready') {
      handlers.onStart();
      return;
    }
    if (status !== 'running' || pointerId !== null) return;
    pointerId = event.pointerId;
    startY = event.clientY;
    decided = false;
    try { stage.setPointerCapture(event.pointerId); } catch { /* not every browser allows it */ }
    if (event.pointerType === 'touch') {
      pending = window.setTimeout(() => {
        pending = null;
        if (pointerId !== null && !decided) {
          decided = true;
          press();
        }
      }, TOUCH_DELAY_MS);
    } else {
      decided = true;
      press();
    }
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== pointerId) return;
    if (event.clientY - startY > SWIPE) {
      clearPending();
      decided = true;
      intent.duck = true;
      intent.jumpHeld = false;
    }
  };

  const onPointerEnd = (event: PointerEvent): void => {
    if (event.pointerId !== pointerId) return;
    if (pending !== null && !decided) {
      // A quick tap that ended inside the delay still jumps, as a short hop.
      clearPending();
      press();
    }
    pointerId = null;
    intent.jumpHeld = false;
    intent.duck = false;
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerEnd);
  stage.addEventListener('pointercancel', onPointerEnd);
  window.addEventListener('blur', release);

  return {
    intent,
    release,
    destroy: () => {
      release();
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', onPointerEnd);
      stage.removeEventListener('pointercancel', onPointerEnd);
      window.removeEventListener('blur', release);
    },
  };
};
