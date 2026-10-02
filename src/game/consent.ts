import { allowScoreStorage, deleteBest, readBest, writeBest } from './storage.ts';

export interface Consent {
  /** True when the visitor has ticked the box. */
  saving: () => boolean;
  /** Best score from this device, or 0 when saving is off. */
  stored: () => number;
  /** Save a new best, only if the visitor opted in. */
  remember: (best: number) => void;
  destroy: () => void;
}

interface Hooks {
  /** Called when the best score changes because of a visitor choice. */
  onBest: (best: number) => void;
  current: () => number;
}

/** The opt-in score settings. Nothing is stored until the box is ticked. */
export const bindConsent = (hooks: Hooks): Consent => {
  const box = document.querySelector<HTMLInputElement>('[data-save-score]');
  const remove = document.querySelector<HTMLButtonElement>('[data-delete-score]');
  const status = document.querySelector<HTMLElement>('[data-storage-status]');
  if (box) box.checked = false;

  const say = (message: string): void => {
    if (status) status.textContent = message;
  };

  const onChange = (): void => {
    const enabled = box?.checked === true;
    allowScoreStorage(enabled);
    if (enabled) {
      const best = Math.max(hooks.current(), readBest());
      hooks.onBest(best);
      say(writeBest(best) ? 'Score saving is on for this visit.' : 'Your browser could not save the score. You can still play.');
    } else {
      const deleted = deleteBest();
      say(deleted ? 'Saving is off and the saved score has been removed.' : 'Saving is off. Your browser prevented deletion; clear site data in browser settings.');
    }
  };

  const onDelete = (): void => {
    if (box) box.checked = false;
    allowScoreStorage(false);
    const deleted = deleteBest();
    hooks.onBest(0);
    say(deleted ? 'Saved score deleted. Saving is off.' : 'Your browser prevented deletion; clear site data in browser settings.');
  };

  box?.addEventListener('change', onChange);
  remove?.addEventListener('click', onDelete);

  return {
    saving: () => box?.checked === true,
    stored: () => readBest(),
    remember: (best) => {
      if (box?.checked !== true || best <= readBest()) return;
      if (!writeBest(best)) say('Your browser could not save the score. You can keep playing.');
    },
    destroy: () => {
      box?.removeEventListener('change', onChange);
      remove?.removeEventListener('click', onDelete);
    },
  };
};
