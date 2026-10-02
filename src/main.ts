import '@fontsource-variable/inter/index.css';
import './styles/site.css';
import './styles/game.css';
import { mountGame } from './game';

const boot = (): void => {
  const root = document.querySelector<HTMLElement>('[data-game]');
  if (root) mountGame(root);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
