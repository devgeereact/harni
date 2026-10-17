## Latest task: GEE OS 1.4.5 rebrand and cPanel restructure, 17 October 2026

Mode: BUILD, local only. Branch `rebrand/gee-os-cpanel-20261017`. No push, deploy, live mail or Cloudflare change.
Done: mail code moved from the web root to `backend/src`; only `api/message.php` (same URL) and a deny-list `api/.htaccess` are published; GEE OS guard hook, pre-commit guard, verify script, project memory and `cpanel` stack profile added (ADR-028). "Rebrand" here means the GEE OS rebuild, as in earlier rounds: name, visual brand and copy are unchanged.
Evidence: typecheck, 56 unit, PHP unit and HTTP capture, 89 browser, build, `scripts/verify.py` all PASS; PHP server-layout simulation and local Apache `.htaccess` proof PASS. Live host: NOT TESTED. Server steps before the next deploy: `docs/07-operations/DEPLOYMENT.md`.
Note: another session was editing `src/content/*`, `MailForm.tsx` and `scripts/build-pages.ts` at the same time; those changes are left uncommitted.

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
