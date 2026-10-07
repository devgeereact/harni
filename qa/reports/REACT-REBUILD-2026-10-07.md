# Harni rebuild evidence, 7 October 2026

## Layout cleanup, 7 October 2026

Status: PASS for the requested local folder cleanup. The original active/harni remains unchanged. Actual Mac execution and existing release gates remain open from the earlier rebuild.

All 27 generated HTML files were moved out of root-level route folders into ignored `.generated/pages/`. Only empty old route directories were removed. The exact prior HTML, generator, Vite configuration, README and task state were backed up in the chat work area before moving files. Editable source stays in `src/`, assets/PHP in `public/`, and GEE OS documents/state in `docs/`, `qa/` and `.agent/`. The root has zero HTML files. Static production output still contains 27 HTML routes under `dist/`, preserving public URLs and no-JavaScript content.

Vite now uses the generated HTML directory as its root, with explicit project source alias, public directory, allowed source directory and production output path. Development and build regenerate HTML automatically. README and project architecture/task notes explain the current layout.

Development browser verification also found an existing email fallback hydration mismatch: Cloudflare exclusion comments had been added to server-rendered noscript HTML without matching the client payload. The comments are now included consistently, with a regression test and development browser verification.

| Check | Result |
| --- | --- |
| Strict typecheck and production build | PASS |
| Unit suite | PASS, 50 tests |
| Browser suite | PASS, 59 tests across all 27 routes and key interactions |
| Development browser | PASS, Home, a book detail and Pier Run hydrate without console/page errors |
| Clean HTML regeneration | PASS, 27 identical pages reproduced without root route clutter |
| Final directory/output check | PASS, 0 root HTML files, 27 generated HTML files, 27 built HTML files |
| Git whitespace and original preservation | PASS |
| Actual Mac execution | NOT TESTED on this workstation |

Review URL remains http://127.0.0.1:5194/. The original server and original project were preserved. No commit, push, deployment or live mail occurred.

Overall acceptance: PARTIAL. Local implementation and Ubuntu checks PASS. Actual macOS execution and owner feature acceptance remain NOT TESTED. Production release is NO-GO pending the existing hosting, mail and legal decisions.

## Target and preservation

Candidate: `/home/mr-gee/Work/Projects/Rebrand/harni`, with the same directory name as the original build. Original: `/home/mr-gee/Work/Projects/active/harni`. Candidate is a detached linked Git worktree at original HEAD `6ef5762`, with original tracked working changes reapplied before rebuilding. Original untracked `.claude` configuration was left in place. The original Git status was compared byte-for-byte before and after this work: PASS. Original source, user changes and Git history remain intact. No commit, push or deployment occurred.

Before substantive changes, the original source diff/status was recorded and the isolated worktree created. Historical current-task notes were retained under qa/reports/history. Retired `src/site.ts` and `src/main.ts` were moved to docs/reference/legacy after their entry-point consumers were replaced. Genuine applications and original media were not deleted.

## Original state and reproduced failure

Original is a Vite 7 / TypeScript static multi-page website, with 13 public book records, 27 routes, a canvas game, PHP mail endpoint and self-hosted assets. npm is selected by package-lock.json. No React or Tailwind was present. No database, Redis, Docker service or private API credential is needed to browse the website. Mail is a separate PHP/native-host transport, disabled until configured.

Clean Linux npm install, original build and 44 original unit tests: PASS. The website did not have a currently reproducible general startup failure after that install. `npm run media`: FAIL, `Missing tool: sips`. Root cause: the image pipeline depended on macOS sips plus external cwebp/avifenc. This was a confirmed migration failure, separate from the requested framework rebuild.

The original website dev and mail ports 5152/5153 were occupied by existing processes. They were preserved. Candidate port 5192 was also occupied and the new launcher correctly refused it. Candidate review uses 5194/5195.

## Exact fixes

- Added React 19.3 and matching React DOM/types, Tailwind 4.3.3 and its Vite integration. All 27 existing route bodies render through the same React tree on the server and browser. Canonical typed public content remains in src/content and src/data, parsed only at build time. This retains useful static HTML and search metadata, rather than requiring JavaScript for public copy.
- React features now manage menu/keyboard focus, catalogue filtering, consent and contact/subscription forms. Input stays after transport errors, duplicate submissions are guarded, requests use JSON POST and pending requests are aborted on cleanup. Game, globe and reveal helpers have lifecycle cleanup. The existing design is retained with Tailwind theme/utilities and no Preflight reset.
- Added script-safe inert hydration data. Executable content handlers, script URLs and scripts are rejected, including inside no-JavaScript fallbacks. Only repository-owned fallback HTML uses a narrow raw noscript rendering path.
- Replaced sips/cwebp/avifenc with project-local Sharp for JPEG/WebP/AVIF. Generation stages output before replacing only its named derivatives. Original public assets were retained; temporary synthetic fixtures verified the new encoder.
- Pinned Node 24.21.0 through Mise, retained npm, refreshed the lockfile through clean installs and added setup/doctor commands. A targeted source-map-js patch update cleared the reported dependency advisory; final npm audit reports zero vulnerabilities.
- Added a portable launcher that works from another working directory, checks ports, starts optional PHP on loopback, forces development sending off and stops only its own processes. Standalone dev:mail also forces sending off.
- Default web host is 127.0.0.1. Intentional LAN mode accepts only an explicit assigned private IPv4 address. Mail API is blocked on LAN. Both Vite dev and preview proxy/guard the PHP route so PHP source is not served as a public static asset. allowedHosts is explicit.
- Corrected custom-port loopback origins for PHP's CLI development server only. Production origins remain the existing harni.uk allowlist. The HTTP capture test exercises the custom port and rejection of an untrusted origin.
- Updated project state, architecture, decision ADR-026, release status and README. Added an Ubuntu/macOS CI matrix; it has NOT RUN remotely and does not establish macOS acceptance.

## Validation

| Check | Status | Evidence |
| --- | --- | --- |
| Clean setup via Mise/npm ci | PASS | 107 packages installed from lockfile; destination-OS Sharp encoder and Chromium available |
| Strict typecheck including source, scripts and new tests | PASS | npm run typecheck |
| Unit tests | PASS | 49 tests, no skips/failures, including 44 existing and 5 portability/rendering checks |
| Production build | PASS | All 27 route entries built |
| Browser route and interaction suite | PASS | 59 Chromium tests: 27 routes at 390px/1440px, hydration and console checks, images, overflow, canonical URLs, no-JavaScript content, menu/filter, form failure/retry/deduplication, game start/pause |
| Public text parity | PASS | All 27 original/candidate pages have identical normalised visible text, excluding script/style/noscript content; separate browser tests cover no-JavaScript fallbacks |
| Visual spot checks | PASS | Desktop Home and mobile Books screenshots inspected, existing composition and readable content retained |
| PHP unit tests | PASS | 27 checks using the existing local PHP tool |
| HTTP mail capture | PASS | Both form types, four captured messages, exact intended destinations, rejected untrusted origin and accepted custom loopback origin; no real mail |
| Managed local startup | PASS | Run from /tmp; HTTP 200; PHP GET 405; valid custom-origin POST 503 with sending forced off even when parent environment requests it; shutdown releases both ports |
| Intentional LAN startup | PASS | Assigned private address 192.168.1.110, temporary port 58505; HTTP 200 and API 503; shutdown releases ports |
| Built LAN preview API guard | PASS | Separate preview server on private interface returned API 503 and no PHP source; then stopped |
| Cross-device LAN connection | NOT TESTED | Same-workstation HTTP/binding checks only; router/firewall not changed |
| Source portability scan | PASS | No broken tracked symlinks, CRLF source, macOS absolute paths/commands, unreadable source or foreign ownership found in current source; media compatibility shell remains executable |
| Case-sensitive paths/native packages | PASS | Linux clean install, build and browser execution; no copied node_modules retained |
| Watcher limits | PARTIAL | Current inotify max_user_watches 65536; no watch-limit error observed during startup; limits not changed and prolonged watch stress not tested |
| Git whitespace and original preservation | PASS | git diff --check and original status comparison |
| Separate lint | NOT APPLICABLE | No lint configuration in the original; strict typecheck and runtime/browser checks used |
| Actual macOS execution / Safari / physical devices / screen reader | NOT TESTED | CI and documented clean destination setup prepared; actual execution still required |
| Real inbox delivery, sender DNS, external hosting and owner/legal acceptance | BLOCKED | Requires actual service configuration and owner review; no invented credentials or facts |

## URLs and running state

Review server left running on loopback: **http://127.0.0.1:5194/**. Disabled PHP sidecar: 127.0.0.1:5195. The original server remains on 5152/5153. Check endpoints directly before relying on a retained process after the desktop app exits.

Portable restart from this project:

```sh
HARNI_WEB_PORT=5194 HARNI_MAIL_PORT=5195 mise exec -- npm run dev
```

For an intentionally enabled trusted-LAN frontend, use the current assigned private address:

```sh
HARNI_HOST=192.168.1.110 HARNI_WEB_PORT=5194 mise exec -- npm run dev
```

That would serve **http://192.168.1.110:5194/**. LAN validation used an isolated temporary port and was stopped; a LAN server was not left running. Address may change on another network. Mail remains unavailable in LAN mode. Do not expose a development server through router forwarding or a public tunnel.

Next acceptance work: run the documented clean setup and checks on the Mac, review actual application behaviour, then separately resolve existing hosting, real email and legal gates. This local candidate is not a production release.
