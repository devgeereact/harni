# Deployment

Status: NO DEPLOY IS AUTHORISED for the bookstore release. The owner checks the localhost preview
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
