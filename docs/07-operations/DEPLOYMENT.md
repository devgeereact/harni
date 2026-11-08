# Deployment

Current method, checked against `release.json`, `.github/workflows/deploy.yml` and `scripts/release.mjs` on 2026-11-08. The Phase 1 deploy (GitHub Actions run 42457618070, 2026-11-08) changed 1 backend file and 27 site files and passed all 3 smoke checks.

## How a release works today

`scripts/release.mjs` (kit-owned, not edited here) reads `release.json` and does these steps in order. Nothing is deleted on the server, ever.

1. Preflight: on `main`, working tree clean, equal to `origin/main`.
2. Checks and build: `npm run typecheck`, `npm test`, a `php -l` loop over `backend`, `php backend/tests/mail.test.php`; then `npm run build`, which must leave `dist/api/.htaccess`, `dist/assets/.htaccess`, `dist/images/.htaccess` and `dist/media/.htaccess` and must not leave `dist/.htaccess`.
3. Plan: a checksum rsync dry run per part. Without `--go` the script stops here.
4. Snapshot: every server file about to change is copied to `~/backups/harni/releases/<utc>/` with a `RELEASE.json`. The newest 3 snapshots are kept.
5. Upload, two parts in order: `backend/src` to `~/apps/harni/current/src` (Markdown excluded), then `dist` to `~/harni.uk` (the built `.htaccess` files are allowed through; the site-root `.htaccess` is never built and never sent). Entry files (`index.html`, `sw.js`, `manifest.webmanifest`) go last.
6. Smoke, 3 tries each, 3 seconds apart: `/` answers 200, `/books/` answers 200, `/api/message.php` answers 405 (a GET).
7. Any failed upload or smoke check restores the snapshot automatically.

`npm run verify` runs the checks and build only and never contacts the host.

## Who deploys

- The GitHub Actions Deploy workflow runs `node scripts/release.mjs --go` on every push to `main` that is not ignored (see below). The SSH key and known hosts are the GitHub Secrets `CPANEL_SSH_KEY` and `CPANEL_KNOWN_HOSTS` (names only; the host details are not written in this repository's documents). The key file is written with mode 600 and removed in an `always()` step. Runs queue (concurrency group `deploy`, no cancelling). See "Deploy method exception" below.
- From the Mac: `npm run release` is a dry run and `npm run release -- --go` ships. The script's own messages and comments say `pnpm release`; this repository uses npm, so read them as the npm commands (ADR-030).

## Deploy method exception

The Deploy workflow shipping on every push to `main` is an owner-approved exception to the house rule "no GitHub Actions minutes for deploys" (ADR-031, 2026-11-08). Reasons: the repository is public so minutes are free, the SSH key is in GitHub Secrets, `main` is protected (pull request, three required checks, no force-push, applies to admins), and `release.mjs` snapshots and restores automatically. Revisit if the repository becomes private, minutes start costing money, or branch protection is removed.

## What does not deploy

The workflow ignores a push to `main` when every changed file matches `paths-ignore`: `docs/**`, `**/*.md` (Markdown anywhere) and `.agent/**`. So a docs-only, Markdown-only or `.agent`-only push does not deploy.

These do deploy when they land on `main`: `package.json`, `.node-version`, `.env.example`, `tests/`, `src/`, `scripts/`, `backend/`, `public/` and the workflows. A push that mixes ignored and other files deploys. `workflow_dispatch` also exists, but `release.mjs` requires the checkout to equal `origin/main`, so it ships the current `main` only.

## Rollback

- Automatic: if the upload or any smoke check fails, the script restores the snapshot it just took and stops with an error.
- Manual, from the Mac: `node scripts/release.mjs --rollback --go`, equivalent to `npm run release -- --rollback --go`. Without `--go` it is a dry run. `--list` shows the snapshots (`npm run release -- --list`). It restores the newest snapshot from `~/backups/harni/releases/<utc>` and then runs the smoke checks. Each restore uses up its snapshot, so repeating it goes one release further back. The newest 3 are kept.
- Files a release added are left in place on a restore, because nothing is ever deleted on the server.
- If only GitHub Actions holds the SSH key: revert the bad commit through a pull request to `main` and let the Deploy run ship the reverted state. `workflow_dispatch` from an old commit does not work, because `release.mjs` requires `main` equal to `origin/main`.
- Status: NOT TESTED. The manual rollback and the Actions rollback path were not run in this phase (they need SSH to the host). The automatic restore was read in `scripts/release.mjs` (the `restore` function) but not triggered.

## Smoke checks

Three, from `release.json`: `/` returns 200, `/books/` returns 200, `/api/message.php` returns 405.

## Folder listing and headers

The host lists any folder without an index page. `dist/assets/`, `dist/images/` and `dist/media/` each ship a `.htaccess` with `Options -Indexes` (from `public/`). `release.json` refuses a build without them, and `tests/e2e/hardening.spec.ts` fails if a new built folder lacks one. The `/assets/` 403 check was seen after the 2026-11-08 deploy (Phase 1).

Security headers are set on Cloudflare, not in this repo (ADR-029). Steps, verification and rollback: `SECURITY-HEADERS.md`. They are an external change and need owner approval.

## History (superseded, kept for the record)

Everything below describes earlier methods (`cpanel-deploy`, hand-copied files). It is not the current procedure. Use the sections above.

Live site as of 2026-10-22: the deploy of commit 1f0983e (Version 2026-10-17 of the legal pages). The ADR-028 backend layout is live: private code in `~/apps/harni/releases/20261022-1224/src/`, `~/apps/harni/current` points at it, `api/.htaccess` was copied by hand. Pre-deploy copy of the live site: `~/.harni-backups/2026-10-22-pre-deploy/` on the Mac. Mail sending is still off on the host and Cloudflare headers are unchanged. The release report is still NO-GO on the open owner and legal gates.

## Backend layout from 17 October 2026 (ADR-028), DEPLOYED 22 October 2026

The mail code moved out of the web root. `dist/api/message.php` is now a small entry file that loads
the private code from `~/apps/harni/current/src/`. Deploying only `dist/` as before leaves the form
answering 503 "temporarily unavailable". Sending is disabled on the host today, so visitors see the
same outcome either way, but the steps below must run before or with the next `dist/` deploy. Each
step needs owner approval in that session. Full layout: `backend/README.md`.

1. Back up the live `~/harni.uk/api/` folder.
2. Copy `backend/src/` to `~/apps/harni/releases/<YYYYMMDD-HHMM>/src/` and point
   `~/apps/harni/current` at that release.
3. No pointer file is written. `api/message.php` finds `~/apps/harni/current` from its own
   place, which needs the document root to stay `~/harni.uk`, directly under the home folder.
4. Upload `dist/api/.htaccess` to `~/harni.uk/api/.htaccess` by hand (required). `cpanel-deploy`
   excludes every `.htaccess`, so it never uploads this one, and `--with-htaccess` replaces only the
   root `.htaccess`, which must stay untouched. Then dry run
   `cpanel-deploy dist harni.uk --keep .well-known --keep cgi-bin` and read it.
5. Deploy with `--go` only after the owner approves it explicitly in that session, then smoke
   test: `curl -s -i https://harni.uk/api/message.php` (a GET) returns 405 with a JSON body and
   `Allow: POST`, a valid POST returns the 503 "not available yet" JSON while sending is off, and
   `/api/.htaccess` and any other `/api/*.php` return 403.

Rollback: restore the backed-up `~/harni.uk/api/` folder. The release folders can stay; nothing
reads them once the old single-file `message.php` is back.

Local proof, 17 October 2026: the built `dist/` served by PHP with a pointer to a copied release
gave 405, 503 and the fail-closed 503; local Apache 2.4.67 with `dist/api/.htaccess` gave 200 for
`message.php` and 403 for `.htaccess`, other PHP files, JSON and the folder. Re-proved after the
review fixes: with no release folder, `php-cgi` answered the fail-closed 503 and did not run a
planted `~/src/bootstrap.php`.

Status: DEPLOYED on 2026-10-02 (commit 4a76e41), after the owner said "commit, push and deploy now". Sending of form email is still DISABLED on the host until HARNI_MAIL_ENABLED and its companions are set (EMAIL.md). Earlier text below describes the pre-deploy gates.

Last deploy: `cpanel-deploy dist harni.uk --keep .well-known --keep cgi-bin --go`. The script refuses to delete `.well-known` and `cgi-bin` unless they are kept, so always pass those two. It replaced 8 old welcome-page asset files and left `.htaccess` alone. A copy of the live site from before the deploy is in `~/.harni-backups/2026-10-02-pre-deploy/` (outside the repo). Rollback: re-sync that folder to `~/harni.uk/` over the `cpanel` SSH alias, keeping `.htaccess`. Smoke test after deploy: 16 pages and assets returned 200, a missing page returned 404, `www.harni.uk` returned 200, `/api/message.php` ran under PHP 8.4 and returned the JSON "sending not available yet", the console was clean, and the only host contacted was harni.uk with no cookies or local storage.

Status before the first full-site deploy (superseded): no deploy was authorised until the owner checked the localhost preview and said so (ADR-016). Facts below come from `README.md` and `CHANGELOG.md`. The
deploy script itself was not re-read for this file.

- Environments and promotion path: localhost (`http://localhost:5152`) to a local `dist/` build,
  then `cpanel-deploy` rsyncs `dist/` over SSH (host alias `cpanel`) into `~/harni.uk/` on a
  cPanel host. Cloudflare proxies `harni.uk` and `www.harni.uk`. There is no staging environment.
- Build and migration commands: `npm run build` (generates the pages, type-checks, then builds
  `dist/`). No migrations. The host has no Node, so the build always runs locally.
- Mail server environment: see `EMAIL.md`. PHP 8.1+, local mail transport and private rate-limit storage are required for form delivery. Sending is disabled until verified. Never publish the PHP endpoint as static source.
- Pre-deploy checks: `npm run typecheck`, `npm test`, `npm run build`, zero `[NEEDS]` and
  `[CHECK]` flags (`npm run pages -- --list`), the owner has verified the localhost preview and
  read all four legal pages, and a dry run (`cpanel-deploy dist harni.uk`) has been read.
- Health check and smoke test: `harni.uk` and `www.harni.uk` return 200 through Cloudflare, a
  direct request to the origin returns 403 (the origin lock), pages and fonts load, Pier Run runs
  on `/play/`, and the console is clean. These were the checks used on 2026-09-05.
- Rollback trigger and procedure (superseded): was UNKNOWN. Now see "Rollback" at the top of this file.
- Custom 404: the host root `.htaccess` has `ErrorDocument 404 /404.html` (added 2026-11-08, ADR-034). Unknown paths return status 404 with the built page. The line is outside the Cloudflare origin-lock block and the release never rewrites that file. Backup: `~/backups/harni/htaccess-root-2026-11-08.bak`.
- Production access and approval (at that time): explicit owner approval before any push or deploy. The dry run
  is the default. `--go` writes. Never pass `--with-htaccess`.

Confirm the actual account, project, branch and environment before any remote mutation.
