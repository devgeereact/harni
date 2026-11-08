# Handoff

## 2026-11-08: Phase 1 release alignment done
PR #4 merged into `main` (d60e544) and deployed; Deploy run green; live checks pass (JSON-LD present, no directory listing, API 405). `main` is protected. Open: push of this closeout branch, branch deletions (both need owner approval), then Phase 2. Details: `.agent/CURRENT-TASK.md`.

## 17 October 2026: GEE OS cPanel restructure and launch build pass

Branch `rebrand/gee-os-cpanel-20261017`, pushed to origin. Start with `git pull --ff-only`, then read `.agent/CURRENT-TASK.md`: the launch build pass (release gates in order) and the cPanel restructure (backend layout, review fixes, evidence). Backend and host steps: `backend/README.md` and `docs/07-operations/DEPLOYMENT.md`. Release decision: NO-GO until the owner, legal, Cloudflare, host and deploy gates in CURRENT-TASK are closed. Deploys, Cloudflare and host changes each need explicit owner approval in that session. Not merged to `main`.


## 7 October 2026, Codex fix follow-up

Fresh local website checks PASS and release reports populated; Mac, owner and live delivery gates remain open.


## 7 October 2026: active promotion
Owner authorised moving the rebuild into active and pushing it. Current checkout /home/mr-gee/Work/Projects/active/harni, original /home/mr-gee/Work/Projects/archive/pre-rebrand-2026-10-07/harni. Branch rebrand/gee-os-typescript-20261007. Linked Git metadata repaired; original dirty work retained. Acceptance remains PARTIAL. See ../reports/harni/qa/reports/ACTIVE-PROMOTION-2026-10-07.md.

## 2026-10-30: docs tidy
Docs tidy (owner rule: one source of truth): Markdown moved into docs/, audits and checklists merged into docs/AUDIT.md, exact duplicates removed, links updated. No code changed.

## 2026-11-01: go-live prep
Branch `golive/2026-11`, local only, not pushed. Security audit (no Critical/High) and SEO audit in `docs/AUDIT.md`; Book/Breadcrumb/WebSite/ProfilePage schema added (`src/content/schema.ts`). verify, 65 unit, 171 browser PASS. Owner items and NO-GO gates: `.agent/CURRENT-TASK.md`. Merge, push and deploy need owner approval. Second pass: owner's security checklist, directory listing fix, dependency updates, SHA-pinned Actions (see `docs/AUDIT.md`).
