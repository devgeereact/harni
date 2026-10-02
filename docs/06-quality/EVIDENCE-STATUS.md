# Evidence Status

Latest evidence (2026-10-01, ADR-025) is in the last section of this file, `qa/EMAIL-CONTENT-2026-10-01.md`, `qa/PIER-RUN-REBUILD-2026-10-01.md` and `qa/ABOUT-REDESIGN-2026-10-01.md` (the last covers an earlier About revision). The Pier Run (Game: ...) rows below describe the OLD game and are superseded by the rebuild. Earlier browser results below are historical and do not verify the new UI or mail backend.

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
| Desktop layout | PASS | Viewport screenshots at 1440x900, hero and play | Screenshots reviewed |
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

## Bookstore release, recorded 2026-10-01

Against `http://localhost:5152/` (Vite dev server, Playwright in Chromium) and a throwaway
static server on `dist/`. The first welcome-page gates above still apply to `/play/`. Nothing was
deployed or pushed. Review findings from WEB-17, WEB-19 and WEB-20 were fixed and the checks below
were run again afterwards unless marked otherwise.

| Gate | Status | Method | Observed |
|---|---|---|---|
| Type check | PASS | `npm run typecheck` | No output, exit 0 |
| Unit tests | PASS | `npm test` | 6 of 6: BR-001, BR-002, coming soon, KDP Select, launch ten, related books |
| Generator checks | PASS | `npm run pages` | 23 pages and a 20-URL sitemap; it fails the build on duplicate titles or slugs, long descriptions, a live book with no link or blurb, or a non-https link |
| Production build | PASS | `npm run build` | 24 HTML pages, about 1.5 MB in `dist/` |
| Pages from `dist/` | PASS | Served on a throwaway port, curl on 19 routes | All 200 |
| Built asset links | PASS | Parsed every page for `/assets` and media references | 122 checked, 0 missing |
| Dev routes | PASS | curl on 17 routes at `localhost:5152` | All 200 |
| Console clean | PASS | Playwright console on Home and `/play/` | 0 errors, 0 warnings |
| Desktop layout | PASS | Screenshot of Home at 1440x900; sections share one left edge (176px) | Reviewed |
| Mobile layout | PASS | Screenshots at 390x844; structure check of 15 pages at 375px | No horizontal overflow, one `h1` per page, Books grid is two columns and 4,050px tall (8,608px before the fix) |
| Text contrast | PASS | WCAG 2 formula by script | Rausch-on-white pairs from 4.57:1 to 15.91:1, listed in DESIGN-SYSTEM.md (re-measured after the rebrand) |
| Tap targets | PARTIAL | Measured heights in the DOM at 375px | Everything is 24px or taller (WCAG 2.2 AA minimum). A few text links and the checkbox are under 44px (known issue 15) |
| Third-party requests | PASS | Resource list on a book page, the cookies and page-source reviews | Only same-origin requests, no cookies set, fonts and images served from the site |
| Phone menu | PASS | Opened and closed with Menu and Escape at 390px | `aria-expanded` follows, current page marked |
| Mailing list form | PASS | Empty submit, then a valid submit | Inline errors, focus moves to the first bad field, then "Preview only", nothing sent |
| Consent banner | PARTIAL | Tested before ADR-017 hid it | Accept and Reject were equal size (173x48), Reject stored the choice and returned focus. The banner is not rendered while no statistics tool exists, so the later changes (same style, Escape, safe-area padding) are NOT TESTED |
| Pier Run on `/play/` | PASS | Started a run, crashed, read the result | Score 78, best saved, live region announced the result, console clean |
| Reduced motion | PASS | `prefers-reduced-motion: reduce` on `/play/` | 0 of 8 reveal elements left hidden |
| Keyboard | PARTIAL | First Tab on Home | Lands on the skip link with a 3px visible focus ring. A full keyboard walk of every page is NOT TESTED |
| Live site, read only | PASS | `curl -I` and a read of `https://harni.uk/` | No `Set-Cookie`, no injected analytics script in the HTML. A Cloudflare NEL header is present |
| Lighthouse | PASS | Mobile navigation on the built Books page (`vite preview`), 2026-10-01, after the polish pass | Accessibility 100, Best Practices 100, SEO 100. The one failed check is `llms.txt`, left to the owner. The dev server scores a layout shift of 1 because it injects CSS late, so it was measured on the build |
| Rebrand render | PARTIAL | Home, Books, a book page and About at 1080px to 1280px, Home at 390px (no horizontal overflow); Lighthouse on built Home (mobile) 100/100/100 | Contact, Join and the legal pages were not re-screenshotted after the Airbnb rebrand |
| Contact form and globe | PARTIAL | Empty submit shows two errors and focuses the name; a valid submit shows the status line; 178 globe paths drawn; 390px has no horizontal overflow; Lighthouse on built Contact 100/100/100; network list of the built page is same-origin only; mail links wrapped in email_off | The email app opening is NOT TESTED (headless Chromium); dragging the globe by touch, reduced motion, keyboard walk and screen reader NOT TESTED |
| Card alignment | PASS | DOM measure of all ten cards on Books at 1440px | Five columns, two full rows. Title, hook and link tops are identical across each row. 390px: no horizontal overflow, rows of five show four |
| Group chips | PASS | Opened `/books/#care` | Seven cards dimmed, note shows the group line, chip `aria-pressed` follows |
| Screen reader | NOT TESTED | None | VoiceOver and NVDA not run |
| Real phone and other browsers | NOT TESTED | None | Chromium only, no real device, no Safari or Firefox |
| Deployment | NOT TESTED | None | Not authorised. The owner checks the localhost preview first (ADR-016) |
| Live bookstore site | BLOCKED | None | Depends on an approved deploy |

## Real catalogue (ADR-023), recorded 2026-10-01

Against the local build after the catalogue was replaced with the 13 books from the owner's Amazon author page. Nothing was deployed or pushed. The rows in the sections above that mention "ten" books, "five across", the old covers or the launch ten describe the build before ADR-023 and are historical.

| Gate | Status | Method | Observed |
|---|---|---|---|
| Amazon catalogue read | PASS | Read the author page and every one of the 13 book listings on 2026-10-01 | 13 books, all with Kindle and paperback, all showing Kindle Unlimited, published 11 Dec 2025 to 5 Feb 2026 |
| Type check | PASS | `npm run typecheck` | No errors |
| Unit tests | PASS | `npm test` | 10 of 10, including BR-001, BR-002, the 13-book catalogue, both cover files on disk, the feature row plus three rows of four, related books and group sizes 5, 2, 4 and 2 |
| Production build | PASS | `npm run build` | Build completed |
| Lighthouse mobile, Home | PASS | Lighthouse mobile on the build | Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse mobile, Books | PASS | Lighthouse mobile on the build, then re-run after a fix | First run 100 / 100 / 92: a non-descriptive "Read more" link. Fixed by adding the book title as hidden text on the link |
| Layout screenshots | PASS | Home, Books and a book page at about 1280px; Home and Books at 390px | Reviewed, no horizontal overflow at 390px |
| Other book pages | NOT TESTED | None | Only one book page was checked after ADR-023 |
| About, Join and legal pages | NOT TESTED | None | Not re-checked after the catalogue change |
| Covers and blurbs against the owner | NOT TESTED | None | The owner has not yet reviewed the real covers, the lightly edited blurbs or the author photo |
| Keyboard walk | NOT TESTED | None | No full keyboard walk of the new pages |
| Screen reader | NOT TESTED | None | VoiceOver and NVDA not run |
| Real phone and other browsers | NOT TESTED | None | Chromium only |
| Deployment | NOT TESTED | None | Not authorised. The owner reviews the localhost preview first (ADR-016) |

## 2026-10-01 evidence: email copies, About, Events, Reviews, legal pages, Pier Run rebuild (ADR-025)

All local. Nothing deployed. Statuses use PASS, PARTIAL, NOT TESTED or BLOCKED.

| Gate | Status | Method | Observed |
|---|---|---|---|
| PHP mail unit checks | PASS | `php tests/unit/mail.test.php` | 27 PASS, synthetic input and fake transport, no email sent |
| Mail over HTTP, both forms | PASS | `python3 tests/integration/mail-http.py` (temporary loopback PHP server, capture executable) | 4 captured messages: owner and visitor copy for contact and for sign-up. No real email sent |
| Real inbox delivery and spam placement | NOT TESTED | None | No real email was sent. Host mail transport, mailboxes `info@harni.uk` and `subscribe@harni.uk` unverified |
| SPF, DKIM, DMARC and host PHP support | NOT TESTED | None | Needs the live host and DNS |
| HTML email rendering in real clients | NOT TESTED | None | Only the captured source was inspected |
| Unit tests, all | PASS | `npm test` | 41 pass, including 10 new in `tests/unit/content.test.ts` for Events and Reviews data |
| About page | PASS | Lighthouse mobile | Accessibility 100, Best Practices 100, SEO 100. `qa/ABOUT-REDESIGN-2026-10-01.md` describes the earlier, simpler About revision, not this richer rebuild |
| About page, keyboard walk, screen reader, real phone | NOT TESTED | None | Not run |
| Events and Reviews pages | PARTIAL | Unit tests and build | Data rules and empty states covered by unit tests. Not browser-reviewed or run through Lighthouse in this pass |
| Legal pages | PARTIAL | Build, page generator `npm run pages -- --list` | Rewritten as Version 2026-10-01. Owner items 6 (3 flags on 2 pages plus 3 site-wide checks). NOT legal advice. No solicitor review has happened |
| Pier Run rebuild, build and layout | PASS | typecheck, build, screenshots at 1440x900, 390x844 and 844x390 | No horizontal scroll at 390. Play JS 16.3 kB gzip. See `qa/PIER-RUN-REBUILD-2026-10-01.md` |
| Pier Run score saving opt-in | PASS | Inspected localStorage, sessionStorage and cookies | Nothing written unless "Remember my best score on this device" is ticked; one key `harni.pier-run.best`; Delete saved score clears it. No third-party requests |
| Pier Run Lighthouse mobile | PASS | Lighthouse mobile `/play/` | 100 / 100 / 100 |
| Pier Run reduced motion | PARTIAL | Emulated reduced motion, unit test of pace cap | Plays with no errors. No before and after visual comparison |
| Pier Run real phone touch, audio, screen reader, full keyboard walk | NOT TESTED | None | Synthetic touch events only. No audio output available |
| Live Cloudflare and host cookies and logs | NOT TESTED | None | Needs inspection on the live site before launch |
| Deployment | NOT TESTED | None | Not authorised |
