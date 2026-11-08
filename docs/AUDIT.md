# Audit log

Every audit, review and checklist run for this project, newest first. Add new results here as a dated section; do not create separate audit files.

## 8 Nov 2026 · Post-merge live check (PRs 5 to 8)

| Check | Result | Evidence |
|---|---|---|
| Deploy runs for PR 6, 7, 8 | DONE, all success with smoke checks | GitHub Actions runs 42523532301, 42523654707, 42523810825 |
| `/`, `/play/` | 200 | curl after the last deploy |
| `/assets/` | 403 | curl |
| `GET /api/message.php` | 405 | curl |
| Unknown path | 404 | curl on `/nonexistent-xyz/` |
| Removed `/thanks/` | **Still served (200)** | Old `thanks/index.html` remains on the host: the release uploads without deleting. Unlinked, not in the sitemap. Needs owner approval to remove the file or to add pruning to the release |

## 8 Nov 2026 · Phase 4 workspace hygiene (part 1), branch `gsd/phase-4-workspace-hygiene`

| Check | Result | Evidence |
|---|---|---|
| Was `.idea/` tracked? | Yes, 4 files (951 bytes) | `git ls-files .idea` |
| Is it untracked and ignored now? | DONE | New guard test seen failing, then passing; files remain on disk |
| Is `chore/add-gsap-lenis` merged, as the roadmap assumed? | **No** | `git log origin/main..origin/chore/add-gsap-lenis` shows `e139600` (2026-10-22, adds `gsap` and `lenis` to `package.json` and the lockfile). Neither name appears in `src/` or `scripts/`. Deleting the branch discards that commit from the remote; it needs an owner decision |
| `golive/2026-11` merged? | Yes | `git branch --merged main` lists it; `origin/main..golive/2026-11` is empty |
| Regenerable output | Deleted on owner approval (list below) | `dist` 5.3 MB, `.generated` 964 KB, `test-results` 35 MB, `graphify-out` 2.6 MB, `scripts/__pycache__`, `.DS_Store` (root, `docs/`, `.git/`). All are gitignored; `graphify-out` is in `.git/info/exclude` |
| `docs/IMG_3620.jpeg` | Moved to `media-source/IMG_3620.jpeg` on owner approval | `scripts/build-media.mjs` default `--input` and `PROJECT-CONTEXT.md` updated; guard test seen failing first; the script ran against the new path into a scratch folder. History lines in CHANGELOG left as written |

Open for the owner: the fate of `origin/chore/add-gsap-lenis` (kept).

## 8 Nov 2026 · Phase 3 dead code and CSS cleanup, branch `gsd/phase-3-dead-code-cleanup`

Local only. Nothing pushed or deployed. Built on the unpushed Phase 2 branch.

| Check | Result | Evidence |
|---|---|---|
| Guards written first (`tests/unit/dead-code.test.ts`) | RED then GREEN | RED: 6 of 6 failed, each for the stated reason (4 unused exports, `joinLine`, 30 CSS classes, `/thanks/` still routed, endpoint literal, generated-flag comment). GREEN after the removals below |
| Dead code removed | DONE | `src/lib/parallax.ts` (file, `git rm`, recoverable), `emailButton`, `RUNNER_HEIGHT`, `metresFromUnits`, `site.joinLine`, plus the imports they left unused. `npm run typecheck` PASS |
| `MailForm.tsx` endpoint | DONE | Posts to `site.formEndpoint`; guard fails on a repeated `/api/message.php` literal |
| `/thanks/` removed (owner decision, ADR-032) | DONE | Route, `pages.thanks`, build case. Sitemap unchanged (it was already excluded): 25 URLs. Routes now 26 (25 generated) |
| `generated:false` comment | DONE | Says it applies to `/play/` only, which the page loop skips and the game document builds |
| 30 unused CSS classes | DONE | 47 rules removed with a postcss script, orphan comments removed, one `:not(.nav-link--cta)` rewritten to `.nav-link` (same effect: no element had the class). Built CSS 45.58 kB to 44.28 kB |
| 11 classes with a hook name but no rule | KEPT, decision | `band--book`, `band__inner`, `consent__inner`, `consent__text`, `contact-section`, `events-section-head`, `eyebrow--paper`, `foot-mail`, `hero__text`, `legal__sections` are structural hooks with no rule; adding a rule would change the look and removing them changes markup for no gain. `contents` is the Tailwind `display: contents` utility. No change |
| Before and after screenshots | PASS | 26 routes at 390 and 1440 px, full page, reduced motion, lazy images loaded: 52 of 52 byte-identical. Two earlier runs showed `reviews-390` differing only by a lazy-loaded cover; fixed by scrolling the page first, then re-run on both builds |
| Bookstore wording in style comments | DONE | Guard first (RED), then comment-only edits in `site.css` and `game.css`; built CSS unchanged. Closes the rest of inconsistency 6 |
| Gates | PASS | `npm run check`, `npm test` 81 pass, `npm run verify`, `npm run test:mail`, `npm run test:browser` 167 pass (was 173: the removed `/thanks/` route no longer has its page checks) |
| Docs | DONE | KNOWN-ISSUES row 13 closed, PRODUCT-SPEC FR-009, ARCHITECTURE and README route counts, SECURITY-HEADERS manual list, ACCESSIBILITY, ADR-032 |
| Not done | | The deploy (one release, smoke-checked) needs the owner's approval to push and merge |

## 8 Nov 2026 · Phase 2 docs and standards alignment, branch `gsd/phase-2-docs-alignment`

Local only. Nothing pushed or deployed. Each plan appends a row.

| Plan | Check | Result | Evidence |
|---|---|---|---|
| 02-01 | Drift guard for the Node pin and the `check` script, written first | RED then GREEN | RED: 6 of 6 failed (`.node-version` ENOENT, no `check` script). GREEN: 6 of 6 pass after `.node-version` and `scripts.check`. `npm run check` exit 0. `npm test`: 71 pass (65 existing + 6 new). `npm run typecheck` exit 0 |
| 02-02 | Deploy and backend notes read against the sources | DONE | Read `release.json` (parts, build guard, 3 smoke checks), `.github/workflows/deploy.yml` (`paths-ignore`: `docs/**`, `**/*.md`, `.agent/**`; secrets named `CPANEL_SSH_KEY`, `CPANEL_KNOWN_HOSTS`) and the header and `restore` function of `scripts/release.mjs`. Values were copied from those files. No SSH host, user or port written in any document |
| 02-02 | Task 1 verify greps | DONE | `apps/harni/current/src` present in `backend/README.md`; `--rollback --go` present in `DEPLOYMENT.md`; no `apps/harni/releases` in `backend/README.md`; no host or port strings in either file; `UNKNOWN` present in `backend/README.md` |
| 02-02 | Task 2 verify greps | DONE | `ADR-031` in `DECISIONS.md` and `DEPLOYMENT.md`; no `cpanel-deploy` left in `.agent/PROJECT.yml`, ARCHITECTURE, INTEGRATIONS, PROJECT-CONTEXT or LAUNCH-CHECKLIST (remaining mentions are dated history); `python3 scripts/verify.py` all PASS |
| 02-02 | Manual rollback (`--rollback --go`) and the Actions rollback path | NOT TESTED | Needs SSH to the host. Only the code of the automatic restore was read. ADR-031 records the exception (decision, not a test) |
| 02-02 | Is `~/apps/harni/current` a symlink on the host | UNKNOWN | Owner to confirm with one directory listing of `~/apps/harni/` on the host; record the answer in `backend/README.md` |
| 02-03 | KNOWN-ISSUES row 5 (Fraunces on `/play/`): `grep -rniI fraunces src package.json`, `find . -iname '*fraunces*'` outside `node_modules`/`.git` | DONE (closed) | Only hit in `src` is the `--font-display` fallback name in `src/styles/tokens.css`; no Fraunces in `package.json`; no Fraunces font file in the repo. Package removal is recorded in the 1 Nov 2026 section below |
| 02-03 | Row 6 (live is the 2026-10-02 deploy): read `.agent/CURRENT-TASK.md` and Phase 1 notes in `CHANGELOG.md` | DONE (rewritten), PARTIAL (form sending still off) | Phase 1 merge d60e544, Deploy run 42457618070, 2026-11-08, legal Version 2026-10-17, private backend layout. No live fetch in this plan; the claim rests on the recorded Phase 1 evidence. Sending stays open under rows 8 and 31 |
| 02-03 | Row 11 (no `og:image`): `grep og:image src/content/layout.ts`; read file list for `src/content/social.ts` and `tests/e2e/social-meta.spec.ts` | DONE (closed) | `layout.ts` emits `og:image`, width, height and alt. A unit test `rendered head carries og:image` passes in `npm test`. Appearance in real chat apps NOT TESTED |
| 02-03 | Rows 19 and 25 (`/play/` gold-on-slate): read the 17 Oct entry in `.agent/CURRENT-TASK.md`, confirmed `src/styles/game.css` exists | DONE (closed; 25 marked duplicate of 19) | Records say the `/play/` chrome matches the site look. No new visual check was made; real phone and screen reader stay in row 34 (NOT TESTED) |
| 02-03 | Row 26 (Lighthouse flags missing `llms.txt`): confirmed `src/content/llms.ts` exists, `npm test` includes the `llms.txt` links test | DONE (closed), Lighthouse NOT re-run | The live `/llms.txt` 200 comes from the Phase 1 evidence (`.agent/CURRENT-TASK.md`, GET only). No live page was fetched in this plan |
| 02-03 | Row 13 (`/thanks/`) | DONE (annotated, stays open) | Owner decision of 2026-11-08 to remove `/thanks/` in Phase 3 appended to the row; nothing else in the row changed. Table row count still 39 |
| 02-03 | Comment-only check on `src/content/routes.ts`: `git diff -U0` lines filtered to exclude `//` comment lines | DONE | No `+` or `-` line outside comments; no "23 pages" left. `npm run typecheck` exit 0; `npm test` 71 pass |
| 02-03 | DATA-MODEL Event and ReviewQuote rows compared with `EventItem` in `src/data/events.ts` and `ReviewQuote` in `src/data/reviews.ts` | DONE (fixed) | Field lists now copied from the interfaces; status line no longer says "not deployed". Book (all fields, `getBuyOptions`, `amazonAuthorUrl`) and Group (`key`, `number`, `name`, `blurb`; 5, 2, 4, 2 books) rows match `src/data/books.ts`: no change. No other document repeated `name or initials` or `link?`. Lighthouse NOT re-run; no live page fetched |
| 02-04 | API-SPEC.md read against `backend/public/api/message.php`, `backend/src/endpoint.php`, `message.php`, `delivery.php`, `rate-limit.php` and the caller `src/features/forms/MailForm.tsx` | DONE (filled) | One operation row: `POST /api/message.php`. Check order (405, 403, 415, 413, 422, 503 switch, 429, 502/503), limits (65536 bytes, 254/480/720/40000 field limits, depth 16), rate limits (100 global, 5 per address, 3 per email, 3600 s, HMAC counters, fail closed) and success body copied from source. Operations table has no UNKNOWN; the only UNKNOWN left is host timeouts. `git diff --stat -- backend src` empty
| 02-04 | API-SPEC differences from the plan notes (source wins) | DONE (corrected) | (1) Observability: `endpoint.php` writes no log line in its exception handler and `mail()` warnings are suppressed with `@`; the only `error_log` is `[harni mail] backend not installed` in the entry file. The plan note said errors are logged. (2) Timeouts: the server sets none, but the browser form aborts after 20 s (`MailForm.tsx`), which the plan note omitted. (3) Added from source: a missing `Origin` header gets 403; the rate-limit counters only increment when all three are under their limit, so a refused request does not count but a later 502 does; field lengths are bytes; the 422 text is 'Invalid form data.' for bad JSON and the specific field message otherwise. No other difference found |
| 02-04 | Five N/A records (AUTH-MODEL, PWA-SPEC, SYNC-SPEC, OFFLINE-SPEC, UPDATE-STRATEGY) | DONE | Loop check passed for all five: no `UNKNOWN` outside the title, `Applicability: N/A`, `2026-11-08`, `Decision owner` present; UPDATE-STRATEGY links `DEPLOYMENT.md`. Reasons taken from PRODUCT-SPEC ("Will not build now"), the 1 Nov 2026 checklist below, and the `harni.pier-run.best` key in `src/game/config.ts`. Each has a Revisit-if trigger |
| 02-04 | Real mail delivery, the real client address behind Cloudflare, host PHP version and mail transport | NOT TESTED | No real mail is sent in this phase; no host or live site was contacted. Only the PHP source was read; `npm run test:mail` was not re-run for this plan |
| 02-05 | Duplicate documents compared (table below) | DONE (merged), deletion NOT done | Both pairs read in full and compared entry by entry or field by field before any edit. Nothing deleted, moved or emptied; each duplicate carries a superseded notice at the top |
| 02-05 | Links to the two superseded files | DONE | `grep -rn` over the repo (excluding `node_modules`, `dist`, `.git`, `graphify-out` and the local planning folder) found no document linking to `docs/08-change-management/CHANGELOG.md`. The only mention of `EMAIL-SPEC.md` is in ADR-029 of `DECISIONS.md` (a dated 2026-10-17 decision saying it needed updating); left as written, because it is history |

| 02-06 | Drift guards for `.env.example` names and the word "bookstore", written first | RED then GREEN | RED: 3 failed, 6 passed (`.env.example` line 2 is not an empty `NAME=` line; package.json description contains the word). GREEN: 9 of 9 pass after the fixes, tests unchanged. `.env.example` now lists only `HARNI_MAIL_ENABLED=`, `HARNI_MAIL_STATE_DIR=` and `HARNI_MAIL_RATE_KEY=`; each is read by a `getenv('...')` call in `backend/src`. No real `.env` file was opened |
| 02-06 | README linked-worktree claim | DONE (removed) | `git worktree list` showed one worktree and `git rev-parse --git-common-dir` printed `.git`: this directory is a standalone clone, so the sentences saying it was a linked worktree were stale and are gone |
| 02-06 | README release status | DONE (rewritten) | Now says merged as PR 4 (d60e544) and deployed on 2026-11-08 (Deploy run 42457618070, 3 smoke checks), lists the live GET results, and keeps mail sending, real devices, screen reader (NOT TESTED) and HSTS, CSP and NEL (Phase 5) as open. Taken from the Phase 1 evidence; the live site was not called in this plan |
| 02-06 | Committed references to the local planning folder | DONE (removed) | `git grep` for the folder name outside it found the five N/A spec files, ADR-031 and two lines in `.agent/CURRENT-TASK.md`; each is now plain words. The final `git grep` prints nothing |
| 02-06 | `npm run check`, `npm run typecheck`, `npm test`, `npm run verify`, `npm run test:mail` | PASS | `npm test`: 74 pass (65 existing + 6 + 3 new), 0 fail. `verify` ran the checks, the build and the upload guard; afterwards `git status --short` showed no changed tracked file, so `public/sitemap.xml` and `public/llms.txt` were regenerated identically. Browser suite NOT run: no page output changed |
### Duplicate documents (plan 02-05)

| Pair | Lines before | What was unique | What was merged | Survives |
|---|---|---|---|---|
| `CHANGELOG.md` (root) vs `docs/08-change-management/CHANGELOG.md` | 232 vs 4 | The duplicate holds one entry, "7 October 2026: TypeScript game document" (game HTML source converted to a typed React document component; 50 unit and 59 browser tests PASS). The root file had no entry with that title; no second missing entry was found | The entry was added once to the root file as "2026-10-07, TypeScript game document", between the other 2026-10-07 sections, with the same facts and report path. No existing root entry was edited or reordered | Root `CHANGELOG.md` |
| `docs/07-operations/EMAIL.md` vs `docs/07-operations/EMAIL-SPEC.md` | 56 vs 10 | `EMAIL-SPEC.md` is a template of six fields (Applicability `UNDECIDED`, five `UNKNOWN`). `EMAIL.md` already held the facts for five of them (addresses, triggers, consent and unsubscribe, retry behaviour, rollback). It did not answer delivery, bounce and complaint monitoring, and had no single place listing the six fields | A "Specification summary" section in `EMAIL.md`, one line per field pointing at the existing sections. Applicability is "applicable, implemented, sending disabled". Monitoring is UNKNOWN: none exists, `MONITORING.md` is itself UNKNOWN, next check is the owner's Phase 5 decision. Mailbox existence stays NOT TESTED. No other line of `EMAIL.md` changed | `docs/07-operations/EMAIL.md` |

Deletion proposed, NOT done: `docs/08-change-management/CHANGELOG.md` and `docs/07-operations/EMAIL-SPEC.md`, owner approval needed. Both still exist and start with a superseded notice. Proposed route after approval: `git rm` of the two files in a local commit, then a pull request.

### "Bookstore" classification (plan 02-06)

Command: `grep -rniE "bookstore" .` excluding `node_modules`, `dist`, `.git`, `graphify-out`, `.generated`, `.idea`, the local planning folder and `test-results`. The site sells nothing: Amazon sells, harni.uk is a shop window (ADR-023).

| File and line | Class | Action |
|---|---|---|
| `package.json` 6 (description) | WRONG claim | Fixed: "Author website for harni.uk: Harni Muharami's books, contact form, mailing-list sign-up and Pier Run game" |
| `README.md` 3 | WRONG claim | Fixed: opening paragraph rewritten, says the site takes no orders |
| `docs/PROJECT-MEMORY.md` 5 | WRONG claim | Fixed: same accurate wording |
| `docs/00-foundation/PROJECT-CONTEXT.md` 42 (contact address row) | WRONG wording | Fixed: "The site contact address is ..."; rest of the row unchanged |
| `CHANGELOG.md` 51, 166, 168, 175 | HISTORY | Kept: dated 2026-10 entries about the bookstore release |
| `docs/00-foundation/PROJECT-CONTEXT.md` 58, 60 | HISTORY | Kept: heading and cross-reference of the 2026-10-01 release section |
| `docs/01-product/PRODUCT-SPEC.md` 26, 51, 53 | HISTORY | Kept: line 26 points at the heading below; 51 and 53 are the heading and its supersedes note |
| `docs/06-quality/EVIDENCE-STATUS.md` 31, 68 | HISTORY | Kept: heading and a row inside the section "recorded 2026-10-01" |
| `docs/09-release/LAUNCH-CHECKLIST.md` 16, 28 | HISTORY | Kept: headings naming that release |
| `docs/08-change-management/DECISIONS.md` ADR-011, ADR-015 | HISTORY | Kept: dated decisions |
| `.agent/CURRENT-TASK.md` (old 2026-10 entry about `/play/`) | HISTORY | Kept |
| `src/styles/game.css` 1, 2, 9, 19, 41, 48, 83 and `src/styles/site.css` 1 | CSS-COMMENT | Not touched: Phase 3 owns CSS work |
| `tests/unit/project-standards.test.ts` | GUARD | The test that forbids the word in `package.json` and README |

`docs/KNOWN-ISSUES.md` and `docs/07-operations/DEPLOYMENT.md` have no hit. Guard command `grep -n -i bookstore docs/KNOWN-ISSUES.md docs/07-operations/DEPLOYMENT.md docs/01-product/PRODUCT-SPEC.md | grep -v -i -E "history|superseded|ADR-|was |old "` prints one line, `PRODUCT-SPEC.md:51`, the heading "Bookstore release (built on localhost, not deployed)" of the dated 2026-10-01 section (HISTORY, kept).

### Map inconsistencies 1 to 8, re-read at the end of Phase 2 (plan 02-06)

| # | Inconsistency | Status | Evidence |
|---|---|---|---|
| 1 | Live behind `golive/2026-11` (no JSON-LD, directory listings, no HSTS/CSP, NEL on) | Closed in Phase 1 (HSTS, CSP and NEL move to Phase 5) | PR 4 merged and deployed 2026-11-08; live GET checks showed JSON-LD, 403 on `/assets/`, `/images/`, `/media/`. HSTS, CSP and NEL are owned by Phase 5 |
| 2 | Actions deploy vs house rule; `release.mjs` comments say `pnpm` | Closed | ADR-031 records the Actions deploy as an approved exception. The `pnpm` comments in the kit-owned `scripts/release.mjs` were intentionally NOT edited (locked decision); docs say `npm run release` |
| 3 | Backend README and DEPLOYMENT described `releases/<id>`, a symlink and `cpanel-deploy` | Closed, one fact UNKNOWN | Docs now match `release.json` (rsync `backend/src` into `~/apps/harni/current/src`). Whether `current` is a symlink on the host stays UNKNOWN until the owner confirms |
| 4 | No pnpm, Biome, `check` script, `.node-version`; `.env.example` names unused; `.idea/` tracked; `docs/IMG_3620.jpeg` | Partly closed | Closed: `.node-version`, `check` script, `.env.example` names, npm kept (ADR-030). `.idea/` untracked in Phase 4. `docs/IMG_3620.jpeg` moved to `media-source/` in Phase 4 |
| 5 | Stale docs: README status, `routes.ts`, KNOWN-ISSUES rows, DATA-MODEL, blank specs, duplicates | Closed (deletions need owner approval) | README (02-06), `routes.ts` and KNOWN-ISSUES and DATA-MODEL (02-03), API-SPEC and five N/A specs (02-04), duplicates compared and merged (02-05). Deleting the two superseded files is pending the owner |
| 6 | "Bookstore" wording though nothing is sold | Closed (CSS comments fixed in Phase 3) | Classification table above. The `site.css` and `game.css` comments were reworded in Phase 3 behind a guard test |
| 7 | `MailForm.tsx` hardcodes the endpoint; `generated:false` comment on `/play/`; `npm run pages` rewrites tracked `sitemap.xml` and `llms.txt` | Closed in Phase 3 (the `npm run pages` rewrite part was checked in Phase 2) | `MailForm.tsx` uses `site.formEndpoint`, the comment is fixed. Earlier note: `npm run verify` this time left both tracked generated files unchanged (`git status --short` clean), so there was nothing to restore |
| 8 | PHP: local 8.5.12, CI 8.4, docs 8.1+, host unknown | Phase 5 | The docs correctly state 8.1+ as the minimum and CI uses 8.4. The host PHP version is an owner fact |

### Phase 2 done-when evidence (plan 02-06)

1. Map inconsistencies 1 to 8: table above; nothing is left except items owned by Phase 3, 4 or 5, or waiting on the owner.
2. `npm run check` exists and passes (typecheck, 74 unit tests, PHP lint).
3. Drift guards written first and seen failing: `tests/unit/project-standards.test.ts` (plan 02-01: 6 RED then 6 GREEN; plan 02-06: 3 RED then 9 of 9 GREEN).
4. Deploy effect: `.github/workflows/deploy.yml` ignores `docs/**`, `**/*.md` and `.agent/**` (read in plan 02-02, documented in `docs/07-operations/DEPLOYMENT.md`). The Phase 2 merge also changes `package.json`, `.node-version`, `tests/` and a source comment, so it will trigger one Deploy run. The site output is identical; the run is expected and harmless. Nothing was pushed, merged or deployed in this phase.

## 1 Nov 2026 · Security checklist pass (owner's 19-item list), branch `golive/2026-11`

The owner's list was checked item by item against this site. It is a static author site with one PHP mail endpoint. It has no accounts, logins, admin area, database or stored passwords. Items that assume those are N/A with evidence; adding auth with nothing to protect would only add attack surface.

| Item | Result | Evidence or change |
|---|---|---|
| Hide API keys | PASS | No keys in the client: no `import.meta.env` or `process.env` in `src/`, and no key patterns in `dist/`. The only secrets are the host mail variables (never in git) and the GitHub deploy SSH key (GitHub Secrets, written to a 600 file and removed in an `always()` step). |
| Check env variables | PASS | `.env*` is gitignored except `.env.example`, which holds names only. Mail needs `HARNI_MAIL_ENABLED`, `HARNI_MAIL_STATE_DIR` and `HARNI_MAIL_RATE_KEY` (32+ chars) on the host. It fails closed with a 503 when they are missing. |
| Protect admin routes / proper authentication / check user access | N/A | There is no admin route, account or role. Live probes: `/backend/`, `/src/` and `/apps/` return 404; `/api/` and `/api/*.php` other than the entry return 403. Revisit if a CMS or admin is ever added (then Clerk, per the house stack). |
| Sanitise forms | PASS + FIXED | Server-side validation in `backend/src/message.php` (types, lengths, CR/LF/NUL, consent flags). New: quoted local parts and IP-literal addresses are refused (SEC-1). Test: `backend/tests/mail.test.php`, 36 checks. |
| Protect against XSS | PASS | Email HTML escapes every value (`esc()`). Pages are built from repo content. The build-time converter rejects `<script>` (other than JSON-LD), `on*` attributes and `javascript:` URLs. The only `dangerouslySetInnerHTML` is `<noscript>` with repo-owned build HTML. Form status is rendered as React text. JSON-LD escapes `<`. |
| Add rate limiting | PASS | 5/h per IP, 3/h per email, 100/h global, HMAC-keyed, locked file outside the web root. Behind Cloudflare it needs the real client IP (SEC-2, host check before mail is switched on). |
| Secure API endpoints | PASS | POST only (405 otherwise), exact `Origin` allow-list, JSON only, 64 KB cap, `no-store` and `nosniff`. Private code is outside the web root. |
| Check CORS | PASS | No `Access-Control-*` header on any response. Live preflight from `https://evil.example` got a 405 with no CORS headers, so cross-origin reads are blocked by the browser and writes by the Origin check. |
| Add security headers | BLOCKED (Cloudflare approval) | Values in `docs/07-operations/SECURITY-HEADERS.md`. The root `.htaccess` is not ours (ADR-029). |
| Remove X-Powered-By / hide server version | PASS + PLANNED | Live: no `X-Powered-By` (PHP `header_remove` plus `api/.htaccess`). `Server: cloudflare` has no version, and the origin refuses direct requests. `x-turbo-charged-by: LiteSpeed` (no version) is still sent; its removal is added to the Cloudflare rule in `SECURITY-HEADERS.md`. |
| Turn off debug mode | PASS | `display_errors=0` in the entry. Errors are generic and logged without contents. No `console.log` or `debugger` in `src/` or `dist/`. No source maps in `dist/`. |
| Update dependencies | FIXED | `npm audit`: 1 High (vite 7.3.6 dev server, GHSA-9jrq-w75r-8gcw and others), now 0. vite 7.3.7 (range floor `^7.3.7`), react and react-dom 19.3.1, parse5 8.1.0, @axe-core/playwright 4.14.0. Majors held back as a planned task (owner rule): TypeScript 7, Vite 8, @vitejs/plugin-react 6, @playwright/test 1.64 (needs a browser download). `@types/node` stays on 24 to match Node 24. |
| Remove unused packages | FIXED | `@fontsource-variable/fraunces` removed: no import anywhere and no Fraunces font in `dist/` (headings already fall back to Georgia; no visual change). |
| Check for exposed files | FIXED | Live had **directory listing on** for `/assets/` and `/images/` ("Index of /assets/"), and `/media/` was exposed the same way. Added `public/{assets,images,media}/.htaccess` with `Options -Indexes`, a build test (`tests/e2e/hardening.spec.ts`: every built folder without an index page refuses listing) and a `release.json` build guard. Live after a deploy: NOT TESTED. Already safe: `/.git/*`, `/.htaccess`, `/api/mail-rate.json`, `/server-status` and `/cgi-bin/` return 403; `package.json`, `release.json`, `README.md`, `phpinfo.php` and `error_log` return 404. |
| Secure the database / hash passwords | N/A | There is no database and no passwords. The only state is the rate-limit file of HMAC hashes (no raw IP or email). |
| Check git for leaked secrets | PASS | `gitleaks git`: 30 commits, no leaks. `gitleaks dir`: 2 hits, both in untracked `graphify-out/cache/stat-index.json` (sha256 file hashes, false positives). |
| Full security audit | DONE | The scoped audit below, plus Semgrep (`p/php`, `p/typescript`, `p/react`, `p/secrets`, `p/github-actions`): 0 findings on 7 PHP and 51 TS files. PARTIAL: 3 rules hit internal engine errors on the JS/TS files. |
| CI supply chain (extra) | FIXED | GitHub Actions pinned to commit SHAs (`actions/checkout`, `actions/setup-node`, the third-party `shivammathur/setup-php`, which runs in the job that holds the deploy key). The deploy checkout uses `persist-credentials: false`. |
| Accessibility regression found by the axe update (extra) | FIXED | `/play/` brand link had `aria-label="Harni Muharami home"`, which differs from its visible text (WCAG 2.5.3). It now matches the site-wide brand link. |

Evidence: `npm run verify` PASS, 65 unit PASS, `npm run test:mail` PASS (36 PHP checks plus HTTP capture, no real mail), 173 browser PASS.

## 1 Nov 2026 · SEO audit (harni.uk), branch `golive/2026-11`

Scope: all 25 sitemap URLs plus 404 and thanks, from the local build (`dist/`) and read-only GETs of the live site. No Search Console, CrUX, GA4 or backlink data is available, so the results are lab and source evidence only. Business type: an author site. Every sale goes to Amazon and there is no shop on the site.

**Health score: 78/100 (estimate).** Technical 85, content 65, on-page 85, schema 40 before this branch and 85 after it, performance 95 (lab only), AI search 70, images 85.

What works (DONE, evidence from `dist/` scan and live headers):

- 27 pages, each with its own title (22–60 chars) and description (41–158 chars), a canonical, one `h1`, and `og:`/Twitter cards. Book pages use `og:type=book` and their own cover.
- Every `<img>` has `alt` (decorative ones use `alt=""`) and `width`/`height`. Covers have 400w and 800w `srcset`. The hero image uses eager loading with `fetchpriority=high`.
- `sitemap.xml` lists 25 URLs and leaves out 404 and thanks. Both of those are `noindex`. `robots.txt` names the sitemap. `llms.txt` is live and returns 200.
- Lab Core Web Vitals on live (Playwright, Pixel 7, 4× CPU throttle, 150 ms latency): LCP 436–564 ms, CLS 0 on `/`, `/books/`, a book page and `/about/`. Pages weigh 210–595 KB. No third-party scripts. INP cannot be measured in the lab, and the site has little JavaScript on the main thread. NOT TESTED: field data (no CrUX record yet).

Findings:

| # | Severity | Finding | Status |
|---|---|---|---|
| SEO-1 | High | Book pages had no `Book` structured data, so the books were not machine-readable as books. The only schema on the site was a lone `Person` on About. | FIXED in this branch: `src/content/schema.ts` adds `Book` (title, subtitle, cover, pages, date, en-GB, author by `@id`, EBook and Paperback editions linking to Amazon) and a `BreadcrumbList` to all 13 book pages. Home gets `WebSite`. About becomes `ProfilePage` with `Person` `@id https://harni.uk/about/#person`. Test: `tests/unit/schema.test.ts`. |
| SEO-2 | Medium | No ISBNs in the data, so `isbn` cannot be emitted. The paperback ASINs are not ISBNs. | OWNER: supply each paperback ISBN-13 from KDP. It is then a one-field change. |
| SEO-3 | Info | No `offers`/price and no `review`/`aggregateRating`, by design (BR-003). No real reviews are shown. Do not add either until real, permissioned reviews are on the page. | Kept as is. The test fails if any of these appear. |
| SEO-4 | Medium | The live `robots.txt` is Cloudflare's managed version, not the repo's. It blocks AI training crawlers, which is fine, but it also blocks **Amazonbot**, which feeds Amazon's Rufus and Alexa answers. That matters for an author who sells only on Amazon. Search and answer bots (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot) are allowed. `Content-Signal: search=yes, ai-train=no, use=reference`. | OWNER decision (Cloudflare setting): keep it, or allow Amazonbot. |
| SEO-5 | Medium | The 13 book blurbs are the Amazon descriptions, so the pages duplicate Amazon's text and Amazon will outrank them. | COPY (owner): add one original paragraph per book. |
| SEO-6 | Medium | `/events/` ("no public events") and `/reviews/` (links only) are thin pages that can be indexed. | OWNER: add real content, or approve `noindex` until there is some. |
| SEO-7 | Low | Every book-page description ends with the same "Read more and choose where to buy." | COPY (owner). |
| SEO-8 | Low | The sitemap has no `<lastmod>`. Google ignores `changefreq` and `priority`. | Backlog: add an accurate `lastmod` only from a real change date, never the build date. |
| SEO-9 | Low | Covers ship as JPEG only (800w up to 256 KB). WebP or AVIF variants would cut weight. LCP is already under 0.6 s. | Backlog (`scripts/build-media.mjs`). |
| SEO-10 | Info | Author visibility: no Google Search Console or Bing Webmaster verification is recorded, and there is no Goodreads author profile. Amazon Author Central is the main authority source. | OWNER: verify GSC and Bing (a DNS TXT record on Cloudflare needs approval), submit the sitemap, and claim a Goodreads author profile. Add the Goodreads URL to `sameAs` when it is live. |

Local SEO: a Person with London as the locality is enough. There is no shop or service area, so no Google Business Profile applies.

## 1 Nov 2026 · Security audit (scoped), branch `golive/2026-11`

Scope: mail endpoint (`backend/public/api/message.php`, `backend/src/*`, `api/.htaccess`), static-site headers and CSP, third-party links, Privacy and Cookies pages. Source review, local PHP 8.5 checks and read-only GETs of the live site. No POST was sent to live and no mail was sent.

**Result: no Critical or High findings.** Nothing needed fixing under step 2.

| Area | Result |
|---|---|
| Header injection | PASS. Subjects are fixed strings. Email is checked with `FILTER_VALIDATE_EMAIL` plus a CR/LF/NUL reject, and name and subject reject CR/LF. `mail()` gets headers as an array (PHP 8 rejects CR/LF in header values), and there is no 5th `mail()` parameter, so no `-f` injection is possible. Visitor text appears only in the base64 body and is HTML-escaped by `esc()`. |
| Open relay | PASS. The visitor receipt carries no sender-written text (ADR-029), so the form cannot relay chosen text to a chosen inbox. |
| Spam and abuse | PASS (with an accepted risk). Honeypot `website` field, exact `Origin` allow-list (no Origin means 403), JSON-only (415), 64 KB cap (413), field limits, consent and acknowledgement flags. HMAC-keyed rate limit: 5/h per IP, 3/h per email, 100/h global, locked file outside the web root. Accepted risk, unchanged: 100 bad requests an hour can use up the global limit. Add Cloudflare Turnstile only if abuse appears; that needs owner approval and a privacy-page update. |
| SEC-1 · Low | `FILTER_VALIDATE_EMAIL` accepts quoted local parts (`"a@x,b"@y.com`) and domain literals (`a@[127.0.0.1]`). The receipt content is fixed and the per-email limit applies, so the impact is low. FIXED the same day: see the security checklist pass above. |
| SEC-2 · Needs validation | Behind Cloudflare, `REMOTE_ADDR` must be restored from `CF-Connecting-IP` (mod_remoteip or the LiteSpeed equivalent), or every visitor shares the per-IP limit. Check on the host before mail is switched on. |
| SEC-3 · Medium (Cloudflare) | Live `https://harni.uk/` (GET, 1 Nov 2026) sends no HSTS, CSP, X-Frame-Options, Referrer-Policy or Permissions-Policy, and still sends `NEL`/`Report-To`. The values are decided in `docs/07-operations/SECURITY-HEADERS.md`. The CSP hash `sha256-/x7W7R75…gpw=` still matches the inline script (recomputed today). Applying them is the Cloudflare gate and needs owner approval. |
| SEC-4 · Info | The no-JavaScript fallback `<form action="/api/message.php" method="post">` sends form-encoded data, which the endpoint refuses with 415 JSON. This is a usability issue, not a security one. |
| `/api/` hardening | PASS live: GET returns 405 JSON with `Allow: POST`, `no-store`, `nosniff`, `no-referrer`. The deny-list `.htaccess` is in place (proof from 22 Oct). |
| Third-party links | PASS. Every `target="_blank"` link has `rel="noopener noreferrer"` and a new-tab note. The site loads no third-party scripts, fonts, images or frames. |
| Privacy and Cookies pages | PASS against live: no `Set-Cookie` on `/` or `/play/`, NEL disclosed, only `localStorage` (Pier Run score, opt-in). The open owner facts are unchanged (see `.agent/CURRENT-TASK.md` gates). |

## 2026-09-05 · Pwa Release Checklist

_Merged from `docs/AUDIT.md` on 2026-10-30._

## PWA Release Gates

For every line record status, evidence, owner and date. Allowed statuses are `PASS`, `FAIL`, `PARTIAL`, `NOT TESTED`, `N/A` and `BLOCKED`. `N/A` requires a reason.

### Runtime and network

- [ ] Application works online.
- [ ] Network failure produces intentional behaviour.
- [ ] Offline behaviour matches the approved specification.
- [ ] Service worker registration, scope and lifecycle behave correctly.
- [ ] Old caches are removed safely.
- [ ] New versions update without trapping users on stale code.
- [ ] Failed requests recover appropriately.
- [ ] Duplicate submissions are prevented or made idempotent.
- [ ] API failures have visible, recoverable states.

### Installation and navigation

- [ ] Installation works on supported platforms.
- [ ] App icons and launch presentation work.
- [ ] The web app manifest is valid.
- [ ] Start URL, scope, deep links and refreshed routes work.

### Identity, data and synchronisation

- [ ] Authentication survives the intended application lifecycle.
- [ ] Private data is not cached accidentally.
- [ ] User work is not silently lost.
- [ ] Queueing, retry, conflict and synchronisation states are explicit where applicable.
- [ ] Database policies and permissions are verified.
- [ ] Role permissions are verified server-side.

### Experience and release

- [ ] Mobile layout works on supported sizes.
- [ ] Desktop layout works on supported sizes.
- [ ] Accessibility has been checked with recorded evidence.
- [ ] Production build succeeds.
- [ ] No critical console or runtime errors remain.
- [ ] No exposed secrets are present.
- [ ] No critical security findings remain open.
- [ ] Monitoring and error reporting are operational.
- [ ] Backup and recovery exist where applicable.
- [ ] Rollback is documented and feasible.
- [ ] The production environment has been verified directly.

Test online, slow, intermittent, offline and restored-network transitions. A simulated checkbox without observed behaviour is not a pass.

## 2026-09-05 · Website Launch Checklist

_Merged from `docs/AUDIT.md` on 2026-10-30._

## Website Launch and Quality Gates

Record status, evidence, owner and date. The lists supplied by Gideon are consolidated here without duplicate or corrupted numbering.

### Launch essentials

- [ ] Privacy policy reflects real data practices and has appropriate review.
- [ ] Terms page uses verified organisation and jurisdiction details.
- [ ] Primary call to action is clear and works.
- [ ] FAQ answers real user questions.
- [ ] `robots.txt` is intentional and valid.
- [ ] `sitemap.xml` is current and reachable.
- [ ] A useful custom 404 page exists.
- [ ] Meaningful images have appropriate alternative text.
- [ ] Analytics is configured with consent where required.
- [ ] Every indexable page has a specific title and description.
- [ ] Social sharing metadata and preview imagery work.
- [ ] Favicon and required brand icons work.
- [ ] Canonical URLs are correct.
- [ ] Cookie consent matches actual storage and applicable law.
- [ ] Mobile layouts and interactions are tested.
- [ ] Keyboard, focus, labels, contrast, landmarks and touch targets are checked.
- [ ] Forms are tested for validation, success, failure and recovery.
- [ ] Internal and external links are checked.
- [ ] Images, fonts, scripts and critical rendering are tuned to agreed budgets.

### Interface repair

- [ ] No unintended horizontal scrolling exists.
- [ ] Buttons and links perform their labelled action.
- [ ] Mobile navigation works and is accessible.
- [ ] Footer links work.
- [ ] Success and error messages are clear and actionable.
- [ ] Placeholder copy, dead navigation and temporary assets are removed.
- [ ] Logo returns to the expected home route.
- [ ] Telephone numbers and email addresses are actionable where appropriate.
- [ ] Copyright details are current.

### Conversion risks

- [ ] Pop-ups are limited, timed responsibly and easy to dismiss.
- [ ] Headline and value proposition are specific.
- [ ] Calls to action do not compete without a clear hierarchy.
- [ ] Copy and imagery are credible, specific and consistent with the product.
- [ ] Page speed meets the agreed budget.
- [ ] Long text is structured for scanning without hiding necessary detail.
- [ ] Animation and video do not distract, block access or harm performance.
- [ ] Forms ask only for necessary information.
- [ ] Pricing visibility follows the approved commercial strategy.
- [ ] Social proof is authentic and permissioned.
- [ ] Navigation supports the next step.
- [ ] Cookies and trackers are necessary, documented and controlled.

### Security checks

- [ ] API keys and secrets are absent from client bundles and version history.
- [ ] Environment variables and production settings are verified.
- [ ] Administrative routes require server-side authorisation.
- [ ] Authentication and role permissions are tested.
- [ ] User input is validated and safely rendered.
- [ ] SQL injection controls and database policies are verified.
- [ ] Rate limiting and abuse controls match risk.
- [ ] Third-party spending limits and alerts exist where supported.
- [ ] File uploads validate type, size, ownership, storage and delivery.
- [ ] CSRF protection is present where the authentication design requires it.
- [ ] CORS permits only intended origins, methods and headers.
- [ ] HTTPS is enforced.
- [ ] Security headers match the application.
- [ ] Cookies use appropriate `Secure`, `HttpOnly` and `SameSite` settings.
- [ ] Debug mode and verbose error disclosure are disabled in production.

Do not mark the site ready while a critical gate is failed, blocked or not tested.

## 31 Oct 2026: deploy on push

- Push-to-deploy over SSH added (release.json, deploy.yml, kit release.mjs). First plan: server already matched. Repo made public 31 Oct 2026 after a full-history gitleaks scan (0 findings) and a check that no settings, keys or dumps were ever committed; Actions on.
