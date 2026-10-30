# Security headers

Status, 17 October 2026: DECIDED, NOT APPLIED. Applying it is an external Cloudflare change and needs
explicit owner approval in that session (ADR-029). The live site sent no HSTS, CSP, Referrer-Policy or
Permissions-Policy header on 2026-10-17 (finding PL-04 in
`../reports/harni/qa/reports/PRIVACY-LEGAL-READINESS-2026-10-17.md`).

## Decision

Set the headers on Cloudflare, not on the host. The repo does not own the root `.htaccess` on cPanel
(DEPLOYMENT.md: never pass `--with-htaccess`), and every visitor already reaches the site through
Cloudflare because the origin refuses direct requests. One place, one rollback.

- HSTS: Cloudflare dashboard, SSL/TLS, Edge Certificates, HTTP Strict Transport Security.
- Everything else: Rules, Transform Rules, a Response Header Transform Rule for hostname `harni.uk`
  and `www.harni.uk`, each header added with "Set static".
- Do not turn on the Cloudflare managed transform "Add security headers". Its values differ from the
  ones below (for example `X-Frame-Options: SAMEORIGIN`) and would make two sources of truth.

`backend/public/api/.htaccess` keeps setting its own `Cache-Control`, `X-Content-Type-Options` and
`Referrer-Policy: no-referrer` on the JSON endpoint. A "Set static" rule on Cloudflare replaces the
origin's value of the same header, so `/api/message.php` will show `strict-origin-when-cross-origin`
once the rule is live. That is harmless for a JSON response. Exclude `/api/` from the rule only if the
owner prefers to keep `no-referrer` there.

## Header values

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), bluetooth=(), midi=(), magnetometer=(), gyroscope=(), accelerometer=(), display-capture=(), publickey-credentials-get=(), browsing-topics=()` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (older browsers; `frame-ancestors 'none'` in the CSP does the same for current ones) |
| `Content-Security-Policy-Report-Only` first, then `Content-Security-Policy` | see below |

HSTS notes:

- Start at one year without `includeSubDomains` and without `preload`.
- Add `includeSubDomains` only once `www.harni.uk` and every other subdomain answer over HTTPS.
  `www.harni.uk` returned 200 through Cloudflare on 2026-10-02 (DEPLOYMENT.md). The other subdomains
  (for example any cPanel `mail`, `webmail` or `cpanel` names) are UNKNOWN. Owner: Gideon. Next check:
  list the DNS records in Cloudflare and request each name over HTTPS.
- Do not add `preload` or submit to the preload list without a separate owner decision. Removal from
  the list takes months.

Permissions-Policy notes: the site uses none of the denied features. Pier Run (`/play/`) uses a canvas,
an `AudioContext` with sound off by default and `localStorage`; none of those is governed by this
header. Clipboard writes are left at the browser default.

## Content-Security-Policy

Built from the `dist/` output of 17 October 2026 (27 HTML pages, one JavaScript entry, one stylesheet):

```
default-src 'self'; script-src 'self' 'sha256-/x7W7R75k8Roq0WaVRQX9blP4OufE5xbAdzklGxsgpw='; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'; upgrade-insecure-requests
```

Why each part fits this site:

| What the build contains | Directive |
|---|---|
| One module script per page, `/assets/main-<hash>.js`, plus lazily imported chunks from `/assets/` (Pier Run, globe) | `script-src 'self'` |
| One inline script on 26 pages (every page except `/play/`): `document.documentElement.classList.add('js');` from `src/content/layout.ts` | its SHA-256 hash in `script-src` |
| `<script id="harni-page" type="application/json">` (hydration data, every page) and one `application/ld+json` block (About) | none needed: data blocks are not executed, so CSP does not apply |
| One stylesheet `/assets/main-<hash>.css`; no `<style>` element in any page | `style-src 'self'` |
| One `style` attribute: `style="--reveal-delay:150ms"` on the Contact card | `style-src-attr 'unsafe-inline'`. Runtime changes through `element.style` are not affected by CSP |
| Fonts: Inter and Fraunces woff2 files in `/assets/`, referenced from the stylesheet | `font-src 'self'` |
| Images: `/images/books/` and `/images/author/`, all same origin; no `data:` images | `img-src 'self'` |
| `fetch("/api/message.php")` from the contact and sign-up forms, and the bundler's same-origin preload fetch | `connect-src 'self'` |
| `<form action="/api/message.php" method="post">` (no-JavaScript fallback) | `form-action 'self'` |
| External hosts appear only as links (Amazon, Instagram, TikTok, ICO); no external script, style, font, image, frame or fetch | nothing to allow |

Maintenance:

- The hash covers the exact text of the inline script. If `src/content/layout.ts` changes that line,
  recompute it and update the rule before deploying:
  `printf %s "document.documentElement.classList.add('js');" | openssl dgst -sha256 -binary | openssl base64`.
  Moving the line into an external file under `/assets/` would remove the need for a hash; that is a
  code change for a later session.
- A browser without `style-src-attr` support falls back to `style-src 'self'` and drops the one
  attribute. The only effect is that the Contact card loses its 150 ms reveal delay.
- Cloudflare features that inject their own scripts (Web Analytics, Rocket Loader, Bot Fight Mode
  JavaScript detections, email obfuscation) are UNKNOWN. On 2026-10-02 the only host contacted was
  `harni.uk`, so none loaded a third-party script then. Owner: Gideon. Next check: the Report-Only
  phase below; anything Cloudflare injects shows as a console report.

## Rollout

1. Owner approves the change in the session.
2. Turn on HSTS (`max-age=31536000`, `includeSubDomains` off, preload off) and add the Transform Rule
   with `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`, `X-Frame-Options` and
   `Content-Security-Policy-Report-Only` carrying the policy above.
3. No `report-uri` or `report-to` is set: a reporting service would be a new third party, and NEL is
   being switched off for the same reason (ADR-029). Read the reports in the browser console instead.
4. Open Home, Books, one book page, About, Contact, Join, Events, Reviews, the four legal pages,
   `/play/` (start a run, turn sound on, save a score) and `/thanks/` in Chrome, Firefox and Safari
   with the console open. Submit both forms (sending is off, so the 503 JSON is the expected answer).
   Any "[Report Only] Refused to ..." line is a finding to fix before enforcing.
5. With a clean console, rename the header to `Content-Security-Policy` with the same value.
6. Record the date, the result and the `curl` output in `../reports/harni/` and update
   docs/KNOWN-ISSUES.md row 39.

## Verify

```sh
curl -sI https://harni.uk/ | grep -iE 'strict-transport|content-security|referrer-policy|permissions-policy|x-content-type|x-frame|^nel|report-to'
curl -sI https://www.harni.uk/ | grep -iE 'strict-transport|content-security'
curl -sI https://harni.uk/play/ | grep -iE 'content-security'
curl -s -i https://harni.uk/api/message.php | head -20   # expect 405, Allow: POST, JSON body
```

Expected: every header in the table above on each page, and no `NEL` or `Report-To` once NEL is off.

## Rollback

- CSP and the other response headers: delete the Transform Rule (or switch it off). The change is
  effective on the next request.
- HSTS: browsers remember it for `max-age` even after it is switched off. To undo it, set `max-age=0`
  and leave it on long enough for returning visitors to pick that up, then switch HSTS off. This is why
  `includeSubDomains` and `preload` stay off until the subdomain check is done.
