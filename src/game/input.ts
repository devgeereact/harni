import { RUNNER } from './config';
import type { Intent } from './types';

interface InputHandlers {
  /** True while the simulation should own the arrow and space keys. */
  isPlaying: () => boolean;
  /** Space or a tap outside play: start, or restart after a crash. */
  onPrimary: () => void;
  onTogglePause: () => void;
}

export interface InputController {
  intent: Intent;
  /** Expires an unconsumed jump so a buffered press cannot fire seconds later. */
  tick: (dt: number) => void;
  release: () => void;
  destroy: () => void;
}

const JUMP_KEYS = new Set(['Space', 'ArrowUp', 'KeyW']);
const DUCK_KEYS = new Set(['ArrowDown', 'KeyS']);
const PAUSE_KEYS = new Set(['KeyP', 'Escape']);

/** Vertical travel, in CSS pixels, that turns a touch drag into a duck. */
const SWIPE_THRESHOLD = 24;

export const createInput = (root: HTMLElement, handlers: InputHandlers): InputController => {
  const intent: Intent = { jumpHeld: false, jumpPressed: false, duck: false };
  let bufferLeft = 0;
  let pointerStartY: number | null = null;

  const requestJump = (): void => {
    intent.jumpHeld = true;
    intent.jumpPressed = true;
    bufferLeft = RUNNER.jumpBuffer;
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    // Pause needs to work in both directions, so it also fires while the run
    // is held and only the panel has focus.
    if (PAUSE_KEYS.has(event.code) && (handlers.isPlaying() || root.contains(document.activeElement))) {
      event.preventDefault();
      handlers.onTogglePause();
      return;
    }

    if (JUMP_KEYS.has(event.code)) {
      if (!handlers.isPlaying()) {
        // Space only starts a run when the game panel already has focus,
        // otherwise it must stay a page scroll.
        if (!root.contains(document.activeElement)) return;
        event.preventDefault();
        handlers.onPrimary();
        return;
      }
      event.preventDefault();
      if (!event.repeat) requestJump();
      return;
    }

    if (DUCK_KEYS.has(event.code) && handlers.isPlaying()) {
      event.preventDefault();
      intent.duck = true;
    }
  };

  const onKeyUp = (event: KeyboardEvent): void => {
    if (JUMP_KEYS.has(event.code)) intent.jumpHeld = false;
    if (DUCK_KEYS.has(event.code)) intent.duck = false;
  };

  const onPointerDown = (event: PointerEvent): void => {
    // Let real controls (the start button, links) handle their own taps.
    if ((event.target as HTMLElement).closest('button, a')) return;

    root.focus({ preventScroll: true });
    if (!handlers.isPlaying()) {
      handlers.onPrimary();
      return;
    }
    pointerStartY = event.clientY;
    requestJump();
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (pointerStartY === null) return;
    if (event.clientY - pointerStartY > SWIPE_THRESHOLD) {
      intent.duck = true;
      intent.jumpHeld = false;
    }
  };

  const endPointer = (): void => {
    pointerStartY = null;
    intent.jumpHeld = false;
    intent.duck = false;
  };

  const onBlur = (): void => {
    intent.jumpHeld = false;
    intent.duck = false;
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', endPointer);
  root.addEventListener('pointercancel', endPointer);
  window.addEventListener('blur', onBlur);

  return {
    intent,
    tick: (dt) => {
      if (!intent.jumpPressed) return;
      bufferLeft -= dt;
      if (bufferLeft <= 0) intent.jumpPressed = false;
    },
    release: () => {
      intent.jumpHeld = false;
      intent.jumpPressed = false;
      intent.duck = false;
      pointerStartY = null;
    },
    destroy: () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', endPointer);
      root.removeEventListener('pointercancel', endPointer);
      window.removeEventListener('blur', onBlur);
    },
  };
};
