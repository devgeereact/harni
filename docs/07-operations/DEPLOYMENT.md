# Deployment

Live site: the 2026-10-22 deploy of commit 1f0983e (Version 2026-10-17 of the legal pages). The ADR-028 backend layout is live: private code in `~/apps/harni/releases/20261022-1224/src/`, `~/apps/harni/current` points at it, `api/.htaccess` was copied by hand. Pre-deploy copy of the live site: `~/.harni-backups/2026-10-22-pre-deploy/` on the Mac. Mail sending is still off on the host and Cloudflare headers are unchanged. The release report is still NO-GO on the open owner and legal gates.

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

Security headers are set on Cloudflare, not in this repo (ADR-029). Steps, verification and
rollback: `SECURITY-HEADERS.md`. They are an external change and need the same owner approval.

Rollback: restore the backed-up `~/harni.uk/api/` folder. The release folders can stay; nothing
reads them once the old single-file `message.php` is back.

Local proof, 17 October 2026: the built `dist/` served by PHP with a pointer to a copied release
gave 405, 503 and the fail-closed 503; local Apache 2.4.67 with `dist/api/.htaccess` gave 200 for
`message.php` and 403 for `.htaccess`, other PHP files, JSON and the folder. Re-proved after the
review fixes: with no release folder, `php-cgi` answered the fail-closed 503 and did not run a
planted `~/src/bootstrap.php`.

Status: DEPLOYED on 2026-10-02 (commit 4a76e41), after the owner said "commit, push and deploy now". Sending of form email is still DISABLED on the host until HARNI_MAIL_ENABLED and its companions are set (EMAIL.md). Earlier text below describes the pre-deploy gates.

Last deploy: `cpanel-deploy dist harni.uk --keep .well-known --keep cgi-bin --go`. The script refuses to delete `.well-known` and `cgi-bin` unless they are kept, so always pass those two. It replaced 8 old welcome-page asset files and left `.htaccess` alone. A copy of the live site from before the deploy is in `~/.harni-backups/2026-10-02-pre-deploy/` (outside the repo). Rollback: re-sync that folder to `~/harni.uk/` over the `cpanel` SSH alias, keeping `.htaccess`. Smoke test after deploy: 16 pages and assets returned 200, a missing page returned 404, `www.harni.uk` returned 200, `/api/message.php` ran under PHP 8.4 and returned the JSON "sending not available yet", the console was clean, and the only host contacted was harni.uk with no cookies or local storage.

Status before the deploy: NO DEPLOY IS AUTHORISED for the bookstore release. The owner checks the localhost preview
first and then says so (ADR-016). Facts below come from `README.md` and `CHANGELOG.md`. The
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
- Rollback trigger and procedure: UNKNOWN. The first deploy added files without deleting any.
  Rollback is a redeploy of the previous `dist/`. Keep a copy of the last good `dist/` before
  each deploy. Next check: confirm how `cpanel-deploy` treats files that no longer exist.
- Custom 404: `404.html` is built, but how the host serves it depends on the `.htaccess` the repo
  does not own. UNKNOWN. Next check: ask the owner whether an `ErrorDocument` line can be added.
- Production access and approval: explicit owner approval before any push or deploy. The dry run
  is the default. `--go` writes. Never pass `--with-htaccess`.

Confirm the actual account, project, branch and environment before any remote mutation.
