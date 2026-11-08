## Latest task: Phases 1 to 4 merged and deployed, 8 November 2026

PRs 5 to 8 merged into `main` in order (merge commits; `main` at 4b3828d). The three code-bearing merges (PR 6, 7, 8) each ran Deploy: all green with smoke checks. Live checks after the last one: `/` 200, `/play/` 200, `/assets/` 403, `GET /api/message.php` 405.

Found: `https://harni.uk/thanks/` still returns 200 with the old "Thank you for joining" page. The route is gone from the build, but the release rsyncs without delete, so the old `thanks/index.html` stays on the host. It is unlinked and not in the sitemap. Fixing it means removing one file on the server (owner approval) or teaching the release to prune removed pages.

Done: the two superseded docs were deleted (owner approved). Open (owner): approve removing the stale `/thanks/index.html` on the host (or a release change); decide `origin/chore/add-gsap-lenis` (unmerged `e139600`); Phase 5 (Cloudflare headers, mail test, host checks) and Phase 6 (legal, devices).

## Previous task: Phase 3 dead code and CSS cleanup, DONE (local branch, not pushed), 8 November 2026

Mode: BUILD, local only. Branch `gsd/phase-3-dead-code-cleanup` (on top of the unpushed `gsd/phase-2-docs-alignment`). Nothing pushed, merged or deployed. Test-first: `tests/unit/dead-code.test.ts` (6 guards, 6 of 6 RED) and a bookstore-in-CSS guard (RED) were committed before each fix.

Done: dead code removed (`parallax.ts` file, `emailButton`, `RUNNER_HEIGHT`, `metresFromUnits`, `site.joinLine`); `MailForm.tsx` uses `site.formEndpoint`; `/thanks/` removed (ADR-032); `generated` flag comment fixed; 30 unused CSS classes removed; 11 hook classes with no rule kept on purpose (listed in `docs/AUDIT.md`); docs updated (KNOWN-ISSUES row 13 closed, PRODUCT-SPEC FR-009, README, ARCHITECTURE, SECURITY-HEADERS, ACCESSIBILITY, `.agent/PROJECT.yml`).

Checks, 8 November 2026: `npm run check` PASS; `npm test` 81 pass; `npm run verify` PASS; `npm run test:mail` PASS; `npm run test:browser` 167 pass; screenshots of 26 routes at 390 and 1440 px, 52 of 52 identical before and after (scratch in ignored `work/`).

Next (owner), in order:
1. Approve pushing the three local branches as PRs in order: `gsd/phase-1-closeout` (docs only), `gsd/phase-2-docs-alignment`, `gsd/phase-3-dead-code-cleanup`. Merging Phase 3 triggers one Deploy run with smoke checks; the site looks identical.
2. Approve deleting the two superseded duplicate docs and the merged branches (`golive/2026-11`, `gsd/phase-1-release-alignment`, remote `chore/add-gsap-lenis`).
3. Then Phase 4 (workspace and repo hygiene). Owner items (legal, mailboxes, devices) stay with the owner.

## Previous task: Phase 2 docs and standards alignment, DONE (local branch, not pushed), 8 November 2026

Mode: BUILD, local only. Branch `gsd/phase-2-docs-alignment` (from the unpushed `gsd/phase-1-closeout`). Plans 02-01 to 02-06 are done and committed locally. Nothing pushed, merged, deployed or deleted.

Done: plan 02-01. `.node-version` and `npm run check` added test-first (6 of 6 RED, then 6 of 6 GREEN); `npm test` 71 pass; ADR-030 recorded (npm kept, pnpm and Biome deferred).

Done: plan 02-02 (docs only). `backend/README.md` and `docs/07-operations/DEPLOYMENT.md` match `release.json`; rollback procedure written (manual rollback and Actions path NOT TESTED, they need SSH); "what does not deploy" taken from `deploy.yml`; ADR-031 records the Actions deploy as an approved exception; current-method `cpanel-deploy` mentions swept. No code changed.

Done: plan 02-03 (docs plus one source comment). KNOWN-ISSUES rows 5, 6, 11, 19, 25, 26 corrected and row 13 annotated (open until Phase 3 removes `/thanks/`); `routes.ts` header comment no longer hard-codes a page count (diff checked as comment-only); DATA-MODEL Event and ReviewQuote match the data files. Typecheck and 71 unit tests pass. Lighthouse not re-run; no live page fetched.

Done: plan 02-04 (docs only). API-SPEC filled from the PHP source (one operation; differences from the plan notes recorded in `docs/AUDIT.md`: no application log line in the exception handler, browser aborts after 20 s). Five specs (AUTH, PWA, SYNC, OFFLINE, UPDATE-STRATEGY) marked N/A with reason, date and owner. Real mail, client IP behind Cloudflare and host PHP stay NOT TESTED. No code changed.

Done: plan 02-05 (docs only). The one changelog entry missing from the root `CHANGELOG.md` was merged in; `docs/07-operations/EMAIL.md` has a "Specification summary" covering the six `EMAIL-SPEC.md` fields (bounce and complaint monitoring UNKNOWN, next check in Phase 5). Comparison recorded in `docs/AUDIT.md`. Nothing deleted.

Done: plan 02-06 (test-first for env names and wording, then docs). Three guards added to `tests/unit/project-standards.test.ts` and seen failing first (RED: 3 fail, 6 pass), then GREEN (9 of 9) after the fixes: `.env.example` now lists only `HARNI_MAIL_ENABLED=`, `HARNI_MAIL_STATE_DIR=` and `HARNI_MAIL_RATE_KEY=` (names only; `APP_ENV` and `PUBLIC_APP_URL` removed because nothing reads them); the `package.json` description, README opening and `docs/PROJECT-MEMORY.md` no longer call the site a bookstore (it takes no orders); the README release status now says merged (PR 4, d60e544) and deployed on 2026-11-08 and lists the open items; stale linked-worktree sentences removed (`git worktree list` shows one worktree, so this is a standalone clone). Committed docs no longer point into the local planning folder. The re-read of map inconsistencies 1 to 8 is a table in `docs/AUDIT.md`.

Checks, 8 November 2026: `npm run check` PASS; `npm run typecheck` PASS; `npm test` 74 pass (65 existing + 6 + 3 new); `npm run verify` PASS (it left no tracked file changed); `npm run test:mail` PASS. Browser suite not run: no page output changed.

Next (owner), in order:
1. Approve pushing the Phase 2 branch as a PR. Merging it triggers one Deploy run (`package.json`, `.node-version`, tests and a source comment change); the site output is identical, so the run is expected and harmless.
2. Approve deleting the two superseded duplicates (git rm, local commit, PR): `docs/08-change-management/CHANGELOG.md` and `docs/07-operations/EMAIL-SPEC.md`. Until then each carries a notice.
3. Confirm whether `~/apps/harni/current` is a symlink on the host (one directory listing of `~/apps/harni/`); the answer goes in `backend/README.md` (UNKNOWN until then).
4. Then Phase 3 (dead code and CSS cleanup, `/thanks/` removal, endpoint constant). Also approve pushing the Phase 1 closeout branch and deleting merged branches. Owner items (legal facts, mailboxes, devices, host PHP) stay with the owner.

## Previous task: Phase 1 release alignment, DONE, 8 November 2026

Mode: BUILD. PR #4 merged into `main` (merge commit d60e544) with the owner's explicit approval; the Deploy run succeeded (run 42457618070: 1 backend file changed, 27 site files changed, 4 new, 3 smoke checks passed). `main` equals `origin/main`; the merged tree is identical to the reviewed branch tip.

Evidence, 8 November 2026:
- Before merge: `npm run verify` PASS, 65 unit PASS, `npm run test:mail` PASS, 173 browser PASS, Portability CI PASS on the PR (Ubuntu, macOS, PHP mail capture).
- Live after deploy (GET only): a book page carries Book and BreadcrumbList JSON-LD; `/assets/`, `/images/`, `/media/` answer 403 with no "Index of"; `GET /api/message.php` = 405; `/`, `/books/`, `/play/`, `/llms.txt`, `/sitemap.xml` = 200; a missing page = 404.
- `main` is protected on GitHub: PR required (0 approvals), required checks `web (ubuntu-latest)`, `web (macos-latest)`, `php-local-capture`, no force-push or deletion, applies to admins. Emergency change: edit the protection in GitHub settings first.
- Lesson: never write the literal text `[skip ci]` in a commit body unless CI should be skipped; GitHub reads it anywhere in the message. A default squash message would copy it in, so the merge used a custom message.
- Still NOT TESTED: mail sending on the host, real devices, screen reader. Live still has no HSTS or CSP, and Cloudflare NEL is on (Phase 5).

Next:
1. Owner: approve pushing branch `gsd/phase-1-closeout` (these notes) as a docs-only PR (docs and `.agent/` pushes do not deploy).
2. Owner: approve deleting merged branches `golive/2026-11` and `gsd/phase-1-release-alignment` (local and remote).
3. Phase 2 (docs and standards alignment): planned in the local planning notes (not part of this repository), then done on its own branch.

## Previous task: go-live prep, 1 November 2026

Mode: BUILD, local only. Branch `golive/2026-11` (not pushed). No deploy, no server, Cloudflare or GitHub change, mail sending still off.

Done:
- Scoped security audit (mail endpoint, headers/CSP, third-party links, Privacy/Cookies): no Critical or High. Findings SEC-1 to SEC-4 in `docs/AUDIT.md`.
- SEO audit of harni.uk: findings SEO-1 to SEO-10 in `docs/AUDIT.md`. Fixed SEO-1 in code: `src/content/schema.ts` (Book + BreadcrumbList on 13 book pages, WebSite on Home, ProfilePage/Person `@id` on About). No ISBN, price or review data is emitted. No site wording changed.
- Stale line fixed: `docs/05-security/LEGAL-REVIEW.md` now says the 2026-10-17 legal version is live.
- Security checklist pass (owner's 19 items, `docs/AUDIT.md`): directory listing off for `/assets/`, `/images/`, `/media/` (live showed "Index of"); email addresses with quotes or IP literals refused; npm audit High (vite) fixed, patch and minor updates applied, unused Fraunces package removed; Actions pinned to SHAs; `/play/` brand label fixed (found by the axe update). Auth, admin, database and password items are N/A: none exist.

Evidence, 1 Nov 2026: `npm run verify` PASS; typecheck PASS; 65 unit PASS (5 new in `tests/unit/schema.test.ts`, seen failing first); 173 browser PASS (new `tests/e2e/hardening.spec.ts`, seen failing first); `npm run test:mail` PASS, 36 checks (new address checks seen failing first), no real mail. Live (GET only): no security headers, NEL still on, no cookies set, lab LCP 436–564 ms and CLS 0. NOT TESTED: field CWV, Rich Results Test on live (needs a deploy).

Gap: the release report (`../reports/harni/docs/09-release/RELEASE-REPORT.md`) is not on this Mac; it was written on the old Linux machine. The NO-GO gates below are the copy kept in this file.

Next (owner): answer the NO-GO items below, the copy changes in the SEO audit, paperback ISBN-13s (SEO-2), the Amazonbot decision (SEO-4), approve the Cloudflare rule (security headers plus removing `X-Powered-By` and `X-Turbo-Charged-By`), then approve merge, push and deploy. After the deploy, check that `/assets/` returns 403.

## Latest task: consolidate and deploy, 22 October 2026

Mode: BUILD. Branch `rebrand/gee-os-cpanel-20261017` merged into `main` (1f0983e, `--no-ff`), pushed, branch deleted locally and on origin. Backup bundle: `~/repo-backups/harni-2026-10-22-1157/` (Mac).
Deployed on the owner's instruction with `cpanel-deploy dist harni.uk --keep .well-known --keep cgi-bin --go`, after a private backend release and a hand-copied `api/.htaccess`. Rollback: re-sync `~/.harni-backups/2026-10-22-pre-deploy/` to `~/harni.uk/` (keep `.htaccess`), restoring the old single-file `api/message.php`.
Evidence: typecheck, 60 unit, test:mail, 171 browser, verify.py PASS before merge. Live: 16 routes 200, missing page 404, `www` 200, GET `/api/message.php` 405 JSON, `/api/.htaccess` and other PHP 403, 7 routes loaded in headless Chromium with no console errors and only harni.uk contacted. NOT TESTED: a POST to the live form, mail delivery (sending off), Cloudflare headers (NEL header still sent; owner decision is off). The release gates above remain open.

## Latest task: launch build pass and handoff, 17 October 2026

Mode: BUILD. Branch `rebrand/gee-os-cpanel-20261017`, pushed to origin at the owner's request (commits 43660d3 to 91f6eb4 and this handoff). No deploy, no live mail, no Cloudflare or host change.

Done:
- Contact visitor email is a short receipt with no sender-written name, subject or message (PL-06, ADR-029). Privacy notice, contact page, FAQ and form status say "receipt".
- Share cards (`og:image` with size and alt, Twitter tags) on every page, book pages use their cover: `src/content/social.ts`. `llms.txt` built from site and book data: `src/content/llms.ts`.
- `/play/` chrome matches the bookstore (`src/styles/game.css`); unused Fraunces import removed.
- New tests: `tests/e2e/accessibility.spec.ts` (axe, all 27 routes), `tests/e2e/mobile.spec.ts` (iPhone 13 emulation), `tests/e2e/social-meta.spec.ts`, `tests/unit/social.test.ts`.
- `docs/07-operations/SECURITY-HEADERS.md` (Cloudflare values, CSP Report-Only first; the CSP hash must be recomputed if the inline script in `src/content/layout.ts` changes).
- Owner decisions taken by the operator acting as CEO (ADR-029): NEL off on Cloudflare, UK audience only, single-step sign-up kept, short contact receipt, headers on Cloudflare.

Evidence, 17 October 2026: typecheck PASS; 60 unit PASS; `npm run test:mail` PASS (31 PHP checks plus HTTP capture, no real mail); 171 browser PASS (includes build, 27 axe, 28 phone emulation). NOT TESTED: real phone, screen reader, real inbox delivery, live host.
Reports (outside the repo, Mac only): `../reports/harni/docs/09-release/RELEASE-REPORT.md` (NO-GO), `../reports/harni/qa/reports/LAUNCH-BUILD-2026-10-17.md`, `../reports/harni/qa/reports/OWNER-QUESTIONS-2026-10-17.md`.

Privacy audit status for other machines: the PL-01 to PL-16 issue register and the owner answers are copied into `docs/05-security/LEGAL-REVIEW.md` (the reports folder is Mac only).

Release decision: NO-GO. The code is complete; these gates are open, in order:
1. Owner facts for the legal pages: postal address, ICO fee number or exemption, web host and mail provider names and data locations, host log retention, complaints cover person. Then update `src/content/legal.ts` and `docs/05-security/LEGAL-REVIEW.md`. Never invent these.
2. Owner confirmations: employer policy on the personal-capacity wording, both mailboxes receive mail, Instagram and TikTok live (`src/content/site.ts`).
3. Solicitor review of the legal pages.
4. Cloudflare (needs explicit approval): NEL off, headers per `SECURITY-HEADERS.md`.
5. Host (needs explicit approval): private backend at `~/apps/harni/current/`, hand-copy `api/.htaccess`, mail variables, SPF/DKIM/DMARC, one approved real test send (`docs/07-operations/DEPLOYMENT.md`, `EMAIL.md`).
6. Deploy approval for Version 2026-10-17, then the smoke test in `DEPLOYMENT.md`.
Approval to commit and push does not cover steps 4 to 6.

## GEE OS 1.4.5 rebrand and cPanel restructure, 17 October 2026

Mode: BUILD. Branch `rebrand/gee-os-cpanel-20261017`, pushed. No deploy, live mail or Cloudflare change.
"Rebrand" means the GEE OS rebuild: name, "Rausch on white" look and copy unchanged. The owner confirmed this on 17 October 2026.

Done (commits f53ba64, e012f07, 3dab172; ADR-028):
- Mail code moved out of the web root into `backend/src/` (render, message, delivery, rate-limit, endpoint). `backend/public/api/message.php` is the only public PHP file; URL `/api/message.php` unchanged. A deny-list `api/.htaccess` sits beside it. `npm run build` copies only those two files into `dist/api/`. Layout and host steps: `backend/README.md`.
- On the host the entry finds `~/apps/harni/current/src/` from its own place (`~/harni.uk/api/` is two levels below home). No pointer file: `cpanel-deploy` runs rsync with `--delete` and would remove one. Only `php -S` uses the repository layout. Missing folder: fail-closed 503.
- GEE OS contract: `.claude/settings.json` guard hook, `.githooks/pre-commit` (enable per clone: `git config core.hooksPath .githooks`), `scripts/agent_guard.py`, `scripts/guard.py`, `scripts/verify.py`, `docs/PROJECT-MEMORY.md`, `stack_profile: cpanel` in `.agent/PROJECT.yml`.
- PHP tests moved to `backend/tests/`; `npm run test:mail` runs the unit checks and the HTTP capture run.

Review (security and finish reviewers, read-only): no Critical or High. Fixed in 3dab172: pointer file deleted by deploy, production fallback could load `~/src/bootstrap.php`, rate-limit root check could be skipped, LiteSpeed PHP deny, `api/.htaccess` never uploaded by `cpanel-deploy` (hand-copy step now required). The privacy-notice mismatch the security review found was closed by 43660d3. Accepted risk: subscribe receipts to typed addresses can use up the global hourly limit; revisit if abused.

Evidence: typecheck, 60 unit, `npm run test:mail`, 171 browser, `scripts/verify.py` all PASS at e05e313. `php-cgi` proof: 405 with a release folder present; 503 with it missing, planted `~/src/bootstrap.php` not run. Local Apache 2.4.67: 200 `message.php`, 403 for `.htaccess`, other PHP, JSON and the folder. NOT TESTED: live host, LiteSpeed, real client IP behind Cloudflare (mod_remoteip).
Mac-only report: `../reports/harni/qa/reports/GEE-OS-CPANEL-RESTRUCTURE-2026-10-17.md`.
Guard note: the project guard blocks commands that name `config.php` or `backend-path.php`. Do not reintroduce a pointer file under either name.

## Latest task: privacy and legal readiness audit, 17 October 2026

Mode: BUILD, local only. Authority: local changes and checks; no commit, push, deploy, live mail or Cloudflare change.
Done: runtime privacy sweep of all 26 pages plus a read-only live check; legal pages to Version 2026-10-17 (NEL disclosure, s164A complaints section, counter wording); Cookies link on /play/; new tests `tests/e2e/privacy.spec.ts` and `tests/unit/legal-records.test.ts`; runbook `docs/07-operations/DATA-REQUESTS.md`; ADR-027.
Evidence: ../reports/harni/qa/reports/PRIVACY-LEGAL-READINESS-2026-10-17.md. Readiness: BLOCKED, owner information required (postal address, ICO fee, mail provider facts, NEL decision) and solicitor review.
Note: Mise is not installed on this Mac; checks ran with Node 26.8.1 directly.

## Latest task: simplify the project layout

The user requested a cleaner GEE OS project layout. The 27 generated route HTML files have moved from project-root route folders into ignored `.generated/pages/`. Vite uses that generated directory as its HTML root while source remains in `src/`, assets/PHP in `public/` and production output in `dist/`. Public URLs and React/Tailwind behaviour are retained. The prior layout was backed up before moving exact generated files; only empty route directories were removed. The original active/harni is unchanged.

Latest validation is recorded in ../reports/harni/qa/reports/REACT-REBUILD-2026-10-07.md, under Layout cleanup. Actual Mac and live-service acceptance remain open.

# Harni React and Tailwind rebuild, 7 October 2026

Primary task: rebuild the existing Harni application locally for macOS/Linux under Rebrand/harni, keeping its original name, public content and behaviour.
Mode: BUILD. Workflow: change-safety. Primary system: existing-application recovery. Risk: medium.
Authority: local changes and checks only. No commits, push, deployment, live mail or private environment inspection.

The original active/harni is retained. This is an isolated Git worktree with the original tracked changes preserved. Earlier task history is in ../reports/harni/qa/reports/history/CURRENT-TASK-BEFORE-REACT-2026-10-07.md.

Implementation: React server rendering plus hydration on all 27 existing routes; feature controllers; Tailwind without Preflight; portable Sharp media; pinned Mise runtime; managed loopback development with optional disabled PHP; explicit private-LAN preview with blocked mail API. See README.md, ADR-026 and ../reports/harni/qa/reports/REACT-REBUILD-2026-10-07.md.

Acceptance remains PARTIAL until actual macOS execution and owner feature review. Production release remains blocked by existing hosting, real email and legal checks. No public deployment is authorised.


## TypeScript source follow-up
The user requires TypeScript application source. GameDocument.tsx replaces the last HTML-authored game page. Generated route HTML remains ignored build output. Build, 50 unit and 59 browser checks PASS. See ../reports/harni/qa/reports/TYPESCRIPT-2026-10-07.md.

## Local fix follow-up, 7 October 2026
Fresh typecheck, unit suite and production build PASS. Browser: PASS, 59 checks. Release records are populated; production acceptance remains PARTIAL with the gates in ../reports/harni/docs/09-release/RELEASE-REPORT.md. No runtime defect was reproduced by the completed local website checks.


## Active promotion, 7 October 2026
Owner requested promotion and push. Current directory: /home/mr-gee/Work/Projects/active/harni. Original preserved at /home/mr-gee/Work/Projects/archive/pre-rebrand-2026-10-07/harni. Branch: rebrand/gee-os-typescript-20261007. See ../reports/harni/qa/reports/ACTIVE-PROMOTION-2026-10-07.md. Earlier release gates remain open; no production merge/deployment performed.

## 2026-10-30: docs tidy
Docs tidy (owner rule: one source of truth): Markdown moved into docs/, audits and checklists merged into docs/AUDIT.md, exact duplicates removed, links updated. No code changed. Tasks stay in this file; every audit is added to `docs/AUDIT.md`.
