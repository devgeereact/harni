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
- GEE OS contract: `.claude/settings.json` guard hook, `.githooks/pre-commit` (enable per clone: `git config core.hooksPath .githooks`), `scripts/agent_guard.py`, `scripts/guard.py`, `scripts/verify.py`, `PROJECT-MEMORY.md`, `stack_profile: cpanel` in `.agent/PROJECT.yml`.
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
