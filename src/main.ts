// `full` carries the SOFT and WONK axes the display type uses; `index` does not.
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/inter/index.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/game.css';

import { mountGame } from './game';
import { initParallax } from './lib/parallax';
import { initReveal } from './lib/reveal';

const setYear = (): void => {
  const slot = document.querySelector<HTMLElement>('[data-year]');
  if (slot) slot.textContent = String(new Date().getFullYear());
};

const boot = (): void => {
  setYear();
  initReveal();
  initParallax();

  const gameRoot = document.querySelector<HTMLElement>('[data-game]');
  if (gameRoot) mountGame(gameRoot);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
