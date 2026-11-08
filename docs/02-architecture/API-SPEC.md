# API Specification

Filled on 2026-11-08 from the PHP source (`backend/public/api/message.php`, `backend/src/endpoint.php`, `message.php`, `delivery.php`, `rate-limit.php`) and the browser caller `src/features/forms/MailForm.tsx`. The site has one operation. Nothing here was exercised against a real mail server: see "Not tested" below.

| Operation | Method and path | Auth | Input validation | Success | Errors | Idempotency |
|---|---|---|---|---|---|---|
| Submit contact message or mailing-list sign-up | `POST /api/message.php` | None (public). An Origin allow-list is the only gate | JSON object, max 65536 bytes, `kind` is `contact` or `subscribe`; field rules below | `200` `{ ok: true, copyAccepted, reference }` | `403 405 413 415 422 429 502 503`, each `{ ok: false, message }`; order below | None. Every accepted request sends new mail with a new reference |

Responses are JSON with `Content-Type: application/json; charset=utf-8`, `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`. `X-Powered-By` is removed. Mail contents per recipient: [EMAIL.md](../07-operations/EMAIL.md). Folder layout and install: [backend/README.md](../../backend/README.md).

## Request fields

Header: `Content-Type: application/json` (the part before any `;`, lower-cased, must equal that). Body: a JSON object, nesting depth at most 16.

| Field | `contact` | `subscribe` |
|---|---|---|
| `kind` | `"contact"` | `"subscribe"` |
| `email` | Required. Trimmed, at most 254 bytes. Must pass PHP `FILTER_VALIDATE_EMAIL` and contain none of: CR, LF, NUL, `"`, `[`, `]`, `\`, `(`, `)`, `,`, `;`, `:`, `<`, `>` or whitespace | Same |
| `name` | Required, trimmed, at most 480 bytes, no CR, LF or NUL | Not used |
| `subject` | Optional, trimmed, at most 720 bytes, no CR, LF or NUL. Empty becomes `General enquiry` | Not used |
| `message` | Required, trimmed, at most 40000 bytes, no NUL | Not used |
| `acknowledgement` | Must be boolean `true` | Not used |
| `consent` | Not used | Must be boolean `true` |
| `website` | Honeypot. Must be absent or empty after trimming, otherwise the request is refused | Same |

Any of `email`, `name`, `subject`, `message`, `website` that is present but not a string is refused. Lengths are measured in bytes (`strlen`). Recipients are fixed on the server and cannot be set by the payload: `contact` goes to `info@harni.uk`, `subscribe` to `subscribe@harni.uk`. The owner mail is sent first with the visitor as Reply-To; then a copy is sent to the visitor's address.

## Success body

`{ "ok": true, "copyAccepted": boolean, "reference": "HM-YYYYMMDD-" + 12 upper-case hex characters }`, HTTP 200. `copyAccepted: false` means the owner mail was accepted by the mail transport but the visitor copy was not; the response is still 200. "Accepted" is the answer of PHP `mail()`, not proof of delivery.

## Errors in check order

The first check that fails ends the request. Messages are plain text for display; the browser shows `message` as written.

| Step | Condition | Status | Message intent | Extra header |
|---|---|---|---|---|
| 1 | Method is not `POST` | 405 | Use the contact or subscription form | `Allow: POST` |
| 2 | `Origin` header missing or not in the allow-list: `https://harni.uk`, `https://www.harni.uk`. Under PHP's local development server only (`cli-server`), also `http://localhost:5152`, `http://127.0.0.1:5152` and the port in `HARNI_WEB_PORT` | 403 | Submit the form from harni.uk | None |
| 3 | `Content-Type` is not `application/json` | 415 | Unsupported form format | None |
| 4 | `Content-Length` over 65536, or the body read is over 65536 bytes | 413 | Message too long | None |
| 5 | Body is not valid JSON, is not an object or array, or `prepareMessage` refuses it (unknown `kind`, wrong field type, honeypot filled, bad email, field limits, control characters, missing `consent` or `acknowledgement`) | 422 | Invalid form data, or the specific field message | None |
| 6 | Environment variable `HARNI_MAIL_ENABLED` is not `1` | 503 | Online sending is not available yet, email the fixed address directly, nothing was sent | None |
| 7 | Rate limit exceeded (see below) | 429 | Too many requests, wait an hour or email directly | `Retry-After: 3600` |
| 8 | The owner mail is not accepted by `mail()` | 502 | The mail service did not accept the request, email directly | None |
| 8 | Any exception during steps 7 and 8, including rate-limit storage or key problems | 503 | Online sending is temporarily unavailable, email directly | None |

Validation (step 5) runs before the sending switch (step 6), so a malformed request is told so even while sending is off. Rate limiting (step 7) runs after the cheap checks and before `mail()`. If the private backend folder is missing, the public entry file answers 503 with the same "temporarily unavailable" text before any of these steps; the path goes only to the server log.

## Rate limits

- Window 3600 seconds, tracked per counter from its first request. Three counters are checked on every request that reaches step 7: 100 global, 5 per network address, 3 per email address (lower-cased).
- Counters are keyed by HMAC-SHA256 with `HARNI_MAIL_RATE_KEY` (at least 32 characters). No raw address or email is stored, and no message text.
- State is one file-locked JSON file, `mail-rate.json`, in the folder named by `HARNI_MAIL_STATE_DIR`. The folder must exist, be writable, and sit outside the web root and the backend code folder.
- All three counters are incremented together, and only when none is at its limit. A request refused with 429 does not count. A request that later gets 502 has already counted.
- The limiter fails closed: a missing or unwritable folder, a short or missing key, or a storage error returns 503, not an unlimited pass.
- Behind Cloudflare the per-address counter only works if the host restores the real client address into `REMOTE_ADDR`. The code ignores forwarding headers sent by the client. Whether the host does this is NOT TESTED (QUESTIONS B1, Phase 5). Until then the per-address limit may behave as a second global limit.

## Other contract points

- Authorisation: there is no account or token. Authorisation here is the Origin check plus the fixed server-side recipients. The Origin header is set by browsers and can be forged by a non-browser client, so it does not stop a determined script; the rate limits and the closed-by-default switch are the controls for that.
- Pagination: not applicable (one write operation, no lists).
- Versioning: none. One unversioned URL; the form wording and version (`2026-10-17`) recorded in the owner mail come from `backend/src/message.php`.
- Timeouts: the server code sets none (host limits UNKNOWN). The browser caller aborts the request after 20 seconds and then tells the visitor it could not confirm whether the request was accepted (`src/features/forms/MailForm.tsx`).
- Retries: none. There is no automatic retry and no queue; a failed send keeps the visitor's input so they can try again. The browser blocks a second submit while one is pending; the server has no such guard.
- Observability: the response never contains message contents or configuration. The only server log line written by this code is `[harni mail] backend not installed` from the entry file; the exception handler at step 8 writes none, and `mail()` warnings are suppressed. There are no metrics, alerts or request logs from the application (QUESTIONS B9 is a Phase 5 proposal).

## Not tested

- Real mail delivery, spam placement and mail-client rendering: NOT TESTED (no real mail is sent in any check; see EMAIL.md).
- The real client address behind Cloudflare: NOT TESTED.
- Host PHP version and mail transport: NOT TESTED (PHP 8.1+ is a prerequisite stated in EMAIL.md, not a verified host fact).
- This document was written by reading the source. The checks in `backend/tests/` (`npm run test:mail`) were not re-run for it.
