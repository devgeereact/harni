# Functional Audit

Date: 2026-09-05. Environment: Vite dev server on `localhost:5152`, headless
Chromium. Full status table: `docs/06-quality/EVIDENCE-STATUS.md`.

## Passed

- Page loads with no console errors or warnings.
- Anchor links land below the fixed header (`scroll-margin-top` on both sections).
- Pier Run starts, pauses, resumes, ends and restarts.
- Score, light count and best are reported on the end card and in the live region.
- Best score survives a reload.
- Reduced motion suppresses reveal, hero parallax and the sea, railing and deck drift.

## Fixed during testing

| Problem | Cause | Fix |
|---|---|---|
| Hero photograph filled only the top of the section on narrow viewports | `img { height: 100% }` resolved against a `picture` box of auto height | Gave `.hero__media picture` an explicit `height: 100%` |
| `P` paused but could not resume | The pause key was gated on `isPlaying()`, which is false while paused | The key also fires when the panel has focus, and the handler toggles both ways |
| Starting a run while the panel was off screen left a frozen canvas | The animation loop is parked when the panel leaves the viewport and nothing restarted it | `start()` is called on any deliberate start or resume |
| Preload warning for the hero image | The preload named one width while `srcset` picked another | Added matching `imagesrcset` and `imagesizes` |
| Control hint read as broken on touch | The `kbd` elements were hidden but their labels were not | Two spans, swapped on `(hover: none)` |

## Not tested

Touch on a real device, assistive technology, any browser other than Chromium, and
anything on the server.
