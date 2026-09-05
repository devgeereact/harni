# Evidence Status

Recorded 2026-09-05 against `http://localhost:5152/` (Vite dev server, headless
Chromium via `gstack browse`), unless stated otherwise. The source photograph was
swapped part-way through the build; everything below was re-checked afterwards
except the rows already marked NOT TESTED.

| Gate | Status | Method | Observed |
|---|---|---|---|
| Page loads | PASS | `goto http://localhost:5152/` | HTTP 200 |
| Console clean | PASS | `console --errors` after a fresh load | No errors, no warnings |
| Production build | PASS | `npm run build` | Type check clean, 13.5 kB JS, 16.5 kB CSS |
| Type check | PASS | `npm run typecheck` | No output |
| Desktop layout | PASS | Viewport screenshots at 1440x900, hero / intro / play | Screenshots reviewed |
| Mobile layout | PASS | Viewport screenshots at 390x844, hero / play | Screenshots reviewed. Hero image only filled part of the section until `.hero__media picture` was given an explicit height; re-shot after the fix |
| Text contrast | PASS | Computed colours against the page background, WCAG 2 formula | 8.05:1 body, 10.25:1 eyebrow, re-measured after the palette change. AAA for normal text |
| Game: start | PASS | Click "Start run" | Panel enters `is-playing`, HUD appears, score climbs |
| Game: pause and resume | PASS | `P`, then `P` again | State card reads "Paused." and score freezes; second press resumes and the score moves again |
| Game: crash and restart | PASS | Ran into the first obstacle, then "Run again" | End card shows score and key count; a new run starts |
| Game: best score persists | PASS | Read `localStorage` after a run and again after reload | Key `harni.pier-run.best` held its value across the reload |
| Game: off-screen behaviour | PASS | Started a run with the panel scrolled out of view | The loop is parked while off screen and restarts on a deliberate start; found and fixed during testing |
| Reduced motion | PASS | `Emulation.setEmulatedMedia` with `prefers-reduced-motion: reduce` | 0 elements armed for reveal, 14 shown immediately, hero parallax transform unset, scenery drift frozen, game still playable |
| Touch controls | NOT TESTED | — | Written and wired to pointer events; no real device was used. The hint text swap on `hover: none` was verified by CSS inspection only |
| Screen reader | NOT TESTED | — | Skip link, single `h1`, `role="status"` live region and focus rings are present in markup; no assistive technology was run |
| Cross-browser | NOT TESTED | — | Only headless Chromium. `color-mix`, `text-wrap` and `roundRect` all need a 2023-or-later engine |
| Deployment | NOT TESTED | — | Nothing has been written to the server. `~/harni.uk/` is still empty |
| Live site | BLOCKED | — | Depends on deployment, which is a separate approved task |
