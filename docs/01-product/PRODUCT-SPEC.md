# Product Specification

## Product promise

A visitor who has been given the address `harni.uk` before the site exists lands on
a finished-looking welcome page, understands what the site is for, has a way to make
contact, and has something to do while they are there.

## First-release proof

- User outcome to prove: the page loads, reads clearly on a phone and on a desktop,
  and the mini game is playable with a keyboard and with touch.
- Evidence that counts: viewport screenshots at 390x844 and 1440x900, a clean
  console, a completed run with a recorded score, and measured text contrast.
- Failure threshold: any console error, any text below 4.5:1 contrast, or a game
  that cannot be started or restarted.

## Scope

- Must have: hero, Pier Run, mailto contact, responsive layout,
  `prefers-reduced-motion` support, keyboard operation.
- Should have: responsive image set in AVIF/WebP/JPEG, local fonts (no third-party
  requests), Open Graph tags, best score kept in `localStorage`.
- Later: thoughts and views, which is what the site is for. A contact form. Whatever
  structure those need.
- Will not build now: CMS, backend, analytics, service worker, install prompt.

## Functional requirements

| ID | User outcome | Acceptance evidence | Priority | Status |
|---|---|---|---|---|
| FR-001 | Visitor sees a hero that names the site and says what it is for | Screenshot at 390x844 and 1440x900 | Must | Done |
| FR-002 | Visitor can reach the owner | `mailto:hello@harni.uk` present in header, hero and footer | Must | Done |
| FR-003 | Visitor can start, pause, lose and restart Pier Run | Observed in browser: start, `P` pause, `P` resume, crash, restart | Must | Done |
| FR-004 | The run keeps a personal best between visits | `localStorage` key `harni.pier-run.best` read back after reload | Should | Done |
| FR-005 | The game is playable on touch | Tap to jump, swipe down to duck; hint text swaps on `hover: none` | Must | Partial — code path written, not tested on a real device |
| FR-006 | Motion is suppressed for visitors who ask for it | Verified with `prefers-reduced-motion: reduce` emulated: 0 armed reveals, 14 shown immediately, hero transform unset, scenery drift frozen, game still playable | Must | Done |

## Non-functional requirements

- Accessibility: skip link, one `h1`, visible focus rings, `role="status"` for run
  results, all body text at or above 4.5:1. Measured: 8.05:1 to 10.25:1.
- Performance: no third-party requests at runtime. Fonts and images are served from
  the same origin. Hero image is preloaded with a matching `imagesrcset`.
- Browser support: build targets ES2022 and CSS for Safari 16. `color-mix`,
  `text-wrap` and `roundRect` are all used and all require a 2023-or-later browser;
  older browsers degrade to unmixed colours and plain wrapping rather than breaking.
- Privacy: nothing is collected. The only stored value is the local best score.
- Availability and recovery: static files. Recovery is a redeploy from `dist/`.
