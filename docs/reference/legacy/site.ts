// Bookstore interactions, form submission and optional catalogue filtering.
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/inter/index.css';

import './styles/site.css';
import { initReveal } from './lib/reveal';

const CONSENT_KEY = 'harni.consent';
type Consent = 'accepted' | 'rejected';

// Every storage access is guarded, so a browser that blocks site data still works.
const readConsent = (): Consent | null => {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'accepted' || value === 'rejected' ? value : null;
  } catch {
    return null;
  }
};

const writeConsent = (value: Consent): void => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
};

const setYear = (): void => {
  const slot = document.querySelector<HTMLElement>('[data-year]');
  if (slot) slot.textContent = String(new Date().getFullYear());
};

const initNav = (): void => {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!toggle || !nav) return;

  const setOpen = (open: boolean): void => {
    toggle.setAttribute('aria-expanded', String(open));
    if (open) nav.setAttribute('data-open', '');
    else nav.removeAttribute('data-open');
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
};

/**
 * Placeholder consent banner (ADR-011). It shows on a first visit only when a statistics tool
 * is switched on in src/content/site.ts, and nothing is loaded either way until one is chosen.
 * The footer link and the Cookies page can always reopen it.
 */
const initConsent = (): void => {
  const banner = document.querySelector<HTMLElement>('[data-consent]');
  if (!banner) return;

  const statsEnabled = document.body.dataset['stats'] === 'on';
  const note = banner.querySelector<HTMLElement>('[data-consent-note]');
  const accept = banner.querySelector<HTMLButtonElement>('[data-consent-accept]');
  const reject = banner.querySelector<HTMLButtonElement>('[data-consent-reject]');
  let opener: HTMLElement | null = null;

  // The banner is a fixed bar, so while it is open the page keeps focus clear of it.
  const show = (): void => {
    if (note) note.hidden = statsEnabled;
    banner.hidden = false;
    document.documentElement.style.setProperty('--consent-h', `${banner.offsetHeight}px`);
  };

  const hide = (): void => {
    banner.hidden = true;
    document.documentElement.style.removeProperty('--consent-h');
    opener?.focus();
  };

  const choose = (value: Consent): void => {
    writeConsent(value);
    hide();
    // When a statistics tool is chosen, load it here and only here, for `accepted`.
  };

  // Escape closes the banner without recording a choice, so it is never decided by accident.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !banner.hidden) hide();
  });

  if (statsEnabled && readConsent() === null) show();

  document.querySelectorAll<HTMLElement>('[data-consent-open]').forEach((button) => {
    button.addEventListener('click', () => {
      opener = button;
      show();
      accept?.focus();
    });
  });

  accept?.addEventListener('click', () => choose('accepted'));
  reject?.addEventListener('click', () => choose('rejected'));
};

/** JSON POST only: personal information never goes into a URL. */
const sendForm = async (form: HTMLFormElement, payload: Record<string, unknown>): Promise<void> => {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!status || !submit || submit.disabled) return;
  submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  status.textContent = 'Sending your request…';
  try {
    const response = await fetch('/api/message.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, website: new FormData(form).get('website') ?? '' }),
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json() as { ok?: boolean; message?: string; reference?: string; copyAccepted?: boolean };
    if (!response.ok || result.ok !== true) {
      status.textContent = result.message ?? 'Sending is unavailable. Please use the email address shown on this page.';
      return;
    }
    const copy = result.copyAccepted
      ? 'A copy has been sent to your email address for your records. Check your inbox and spam folder.'
      : 'Your copy could not be sent. Please keep this reference and email me if you need one. Do not submit the same request again.';
    status.textContent = payload.kind === 'subscribe'
      ? 'Thank you for joining my mailing list!'
      : `Thank you. Your message was sent. Reference: ${result.reference}. ${copy}`;
    form.reset();
  } catch {
    status.textContent = 'We could not confirm whether your request was accepted. Your details are still here. Check your inbox before retrying, or email us directly.';
  } finally {
    submit.disabled = false;
    form.removeAttribute('aria-busy');
  }
};

const initForms = (): void => {
  document.querySelectorAll<HTMLFormElement>('[data-join-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      void sendForm(form, { kind: 'subscribe', email: String(data.get('email') ?? '').trim(), consent: data.get('consent') === 'on' });
    });
  });
};

/** The globe on the contact page loads on demand, so no other page carries the map data. */
const initGlobe = async (): Promise<void> => {
  const host = document.querySelector<HTMLElement>('[data-globe-stage]');
  if (!host) return;
  const { mountGlobe } = await import('./lib/globe');
  mountGlobe(host);
};

/** Contact and subscription share delivery handling, validation is repeated on the server. */
const initContact = (): void => {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    void sendForm(form, {
      kind: 'contact', name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(), subject: String(data.get('subject') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      acknowledgement: data.get('acknowledgement') === 'on',
    });
  });
};

/** A soft shadow under the sticky header once the page has scrolled. */
const initHeader = (): void => {
  const head = document.querySelector<HTMLElement>('[data-head]');
  if (!head) return;
  const update = (): void => {
    head.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
};

/** Books page: a chip dims the other groups instead of hiding them, so the grid never reflows. */
const initChips = (): void => {
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('.chip[data-group]'));
  const note = document.querySelector<HTMLElement>('[data-chips-note]');
  if (chips.length === 0) return;
  const defaultNote = note?.textContent ?? '';
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.card[data-group], .feature[data-group]'));
  const apply = (group: string | null): void => {
    chips.forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.group === group));
    });
    cards.forEach((card) => {
      card.classList.toggle('is-dim', group !== null && card.dataset['group'] !== group);
    });
    if (note) {
      const active = chips.find((chip) => chip.dataset.group === group);
      note.textContent = active ? (active.dataset.blurb ?? '') : defaultNote;
    }
  };
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      apply(chip.getAttribute('aria-pressed') === 'true' ? null : (chip.dataset.group ?? null));
    });
  });
  const fromHash = window.location.hash.slice(1);
  if (chips.some((chip) => chip.dataset.group === fromHash)) apply(fromHash);
};

const boot = (): void => {
  setYear();
  initHeader();
  initReveal();
  initNav();
  initConsent();
  initForms();
  initChips();
  initContact();
  void initGlobe();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
