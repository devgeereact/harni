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
