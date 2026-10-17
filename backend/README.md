# Backend: the harni.uk mail endpoint

The site's only server code. It handles the contact and sign-up forms at `POST /api/message.php`.
Plain PHP 8.1+ functions with no Composer dependencies and no database.

## Layout

```
backend/
  public/api/message.php   the only public PHP file: finds the private folder and calls it
  public/api/.htaccess     allows message.php, denies every other file in the folder
  src/bootstrap.php        loads the files below
  src/render.php           email layout (text and HTML)
  src/message.php          validation, wording and version constants, the two emails
  src/delivery.php         MIME building and sending (owner first, then the visitor copy)
  src/rate-limit.php       hashed, file-locked rate limits in a private folder
  src/endpoint.php         HTTP checks (method, origin, type, size) and the JSON responses
  tests/mail.test.php      unit checks with a fake transport
  tests/mail-http.py       full HTTP run with a local capture transport; no real mail
```

`npm run build` copies `backend/public/` into `dist/`, so the web root receives only
`api/message.php` and `api/.htaccess`. `backend/src/` never goes into `dist/`.

## Server layout (cPanel)

```
~/harni.uk/api/message.php          from dist/
~/harni.uk/api/.htaccess            from dist/
~/apps/harni/releases/<id>/src/     a copy of backend/src for each release
~/apps/harni/current                symlink to the live release
~/apps/harni/shared/mail-state/     HARNI_MAIL_STATE_DIR, mode 700
```

`message.php` finds the private folder from its own place: two levels above `~/harni.uk/api/`
is the home folder, then `apps/harni/current`. There is no pointer file on the server, so
`cpanel-deploy --delete` has nothing to remove. This relies on the document root being
`~/harni.uk`, directly under the home folder. `cpanel-deploy` never uploads any `.htaccess`, so
copy `dist/api/.htaccess` to `~/harni.uk/api/` by hand.

If the release folder is missing, `message.php` answers 503 with the usual
"temporarily unavailable" message and logs `backend not installed`. Nothing leaks. Only PHP's
development server (`php -S`) uses the repository layout instead.

Configuration stays in server environment variables, unchanged by the restructure:
`HARNI_MAIL_ENABLED`, `HARNI_MAIL_STATE_DIR`, `HARNI_MAIL_RATE_KEY` (see
`docs/07-operations/EMAIL.md`). Sending stays off until the owner verifies the host mail setup.

## Checks

```sh
npm run test:mail        # unit checks, then the HTTP capture run (needs php and python3)
```
