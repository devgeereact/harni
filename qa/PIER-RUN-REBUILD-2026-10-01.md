# Pier Run rebuild: QA evidence, 1 October 2026

Scope: `src/game/**`, `src/styles/game.css`, `play/index.html`, `src/main.ts` (unchanged), `tests/unit/game-*.test.ts`. Checked against the Vite dev server at `http://localhost:5202/play/` with the Playwright browser (Chromium). No commit, push or deploy.

## What changed

- Bright daytime seaside scene in four zones that change every 500 m: Beach, Pier, Promenade (soft golden hour), Fun fair. Palettes crossfade over 1.6 s. Nothing is dark.
- Nurse-runner drawn from canvas shapes in the coral, with run, jump, duck, glide and hurt poses, squash and stretch.
- Hazards: bench, bin, crab, rolling beach ball, puddle (slows), low gull (duck), high gull (stay low), bunting (duck).
- Collectibles: book tokens in three colours laid on jump arcs. Rare hearts. Power-ups: ice cream (one-hit shield), kite (glide), tea (speed boost, smashes through hazards). Any active power-up unlocks one double jump.
- Three-heart wellbeing meter, 1.6 s grace after a hit, combo multiplier (books and near misses, up to x5).
- Seeded, pattern-based spawning with a minimum 0.9 s gap between patterns, plus guaranteed breathers.
- Opt-in only sound (WebAudio blips), off by default, created only after the toggle is pressed.
- End card: score, books, best, friendly line, Play again, See the books (/books/).

## Module map

`config`, `rng`, `types`, `difficulty`, `zones`, `scoring`, `entities`, `collision`, `physics`, `spawner`, `world` (pure logic, no DOM); `effects` (pure particles); `palette`, `scene`, `sprites`, `render` (canvas); `input`, `audio`, `hud`, `consent`, `storage`, `index` (DOM). Play bundle: 44 kB raw, 16.3 kB gzip.

## Results

| Check | Status | Evidence |
| --- | --- | --- |
| `npm run typecheck` | PASS | tsc strict, no errors |
| `npm test` | PASS | 41 tests pass (includes the unchanged `storage.test.ts`) |
| `npm run build` | PASS | built; play JS 16.3 kB gzip |
| Rng, physics, collision, combo, difficulty, zones unit tests | PASS | `tests/unit/game-logic.test.ts` |
| Spawner fairness, world rules, autopilot beatability | PASS | `tests/unit/game-world.test.ts`: 6 seeds, 150 s each, autopilot loses no heart and reaches over 500 m; standing still loses (control) |
| Layout 1440x900, 390x844, 844x390 | PASS | screenshots viewed; no horizontal scroll at 390; landscape canvas and buttons fit in 390 px height |
| Scene is bright | PASS | canvas mean luminance 219/255, 0.07% of sampled pixels below 90 (the runner's hair) |
| Scripted play, 20+ s, all three sizes | PASS | keyboard Space presses; score, books, hearts, combo and power chips updated |
| Pause and resume (P, Escape, button) | PASS | overlay shows, score frozen while paused, focus returns to the game |
| Game over and Play again | PASS | card shows score, books, best; focus moves to Play again; restart resets score |
| Pause when tab hidden | PASS | simulated `visibilitychange` with `document.hidden` set |
| Live region | PASS | "Run started.", "Paused.", "Resumed.", game-over summary with score, books and best; zone, hit and pickup messages are also sent |
| Score saving opt-in | PASS | localStorage and sessionStorage empty after loading and after a full run; the key `harni.pier-run.best` appears only after ticking the box; unticking and "Delete saved score" empty it |
| Cookies | PASS | the game sets none. The shared `localhost` cookie jar holds `__clerk_*` cookies from other local apps, not from this page |
| Third-party requests | PASS | resource list shows only `http://localhost:5202` |
| Console errors on the page | PASS | 0 errors, 0 warnings from the page (one warning came from the test's own `getImageData` probe) |
| Reduced motion (emulated) | PARTIAL | page loads and plays, no errors. Calmer speed cap is covered by a unit test. Particles, parallax and idle scroll are off in code, but a before and after visual comparison was not made |
| Touch swipe down to duck | PARTIAL | synthetic touch `PointerEvent`s showed the duck pose and `touch-action: none` while playing. Not tested on a real phone |
| Sound blips | NOT TESTED | no audio output available. Code path only creates `AudioContext` after the toggle |
| Real touch device, screen reader, keyboard-only full walk | NOT TESTED | |
| Colour contrast of page text | PARTIAL | uses the existing site tokens (ink on white, coral #E00B41 on white 4.89:1, muted #6A6A6A on white). Not re-measured with a tool |
| Fun fair, Pier and Promenade zones in live play | PARTIAL | rendered and viewed through the real renderer with staged worlds. Not reached in a live scripted run (500 m per zone) |
| Frame rate on a low-end device | NOT TESTED | |

## Notes and risks

- The reduced-motion pace cap is 430 u/s against 570 u/s for full motion.
- Scores are larger than the old game because combos multiply book value. End-card lines switch at 120 and 400 points.
- The old `src/game/*` files were rewritten in place. No tracked file was deleted. `public/media/shore-*.jpg` is still referenced by the page's og:image only.
- Screenshots taken in `.playwright-mcp` by this session were deleted.
