# Website email

Status: implemented locally, sending disabled by default. Updated 1 October 2026 (ADR-025): both recipients now get detailed copies. Updated 17 October 2026 (ADR-029): the contact visitor copy is a short receipt without sender-written text. Verified locally with synthetic inputs and a capture transport only. Host PHP support, real inbox delivery, spam placement and SPF/DKIM/DMARC are NOT TESTED. This adds a small PHP backend to the formerly static-only site; the cPanel host has no Node requirement. PHP 8.1+ and a working local mail transfer agent are prerequisites, not verified host facts.

## Routing and visitor experience

- POST `/api/message.php` with JSON. Contact requires name, email, message and an unchecked-by-default Privacy Notice acknowledgement/Website Terms acceptance; subject is optional. The server requires explicit boolean acceptance and records the wording/version in the enquiry. This is separate from marketing consent. Subscription requires email and explicit consent.
- Contact recipient and sender identity: `info@harni.uk`. Subscription recipient and sender identity: `subscribe@harni.uk`. Fixed server-side recipients cannot be overridden by a browser payload.
- Owner message Reply-To is the visitor; reference copy Reply-To is the relevant Harni inbox. Every message is multipart (plain text plus HTML), HTML-escaped and base64 encoded, and no visitor-supplied text goes into a header. The owner subject is fixed plus reference; a visitor's subject appears in the body only. See "What each recipient receives" below.
- The browser reports acceptance by the mail service, never guaranteed inbox delivery. If only the copy fails, it says to keep the reference and not resubmit. Network uncertainty retains the input and advises checking the inbox before retrying. There is no automatic retry or durable queue.
- Subscription consent is collected by the required checkbox at sign-up. No CONFIRM reply is required. The operator maintains the list from the owner notification and retains its consent record. Successful sign-up shows the reference and says a copy has been sent (the join form tells the visitor beforehand: "You'll receive a copy of your sign-up by email, with how to unsubscribe."). This is not an automated mailing-list integration.
- Process Unsubscribe messages before the next mailing. Keep only necessary suppression/consent records. Never expose a subscriber list to recipients.

## What each recipient receives

Contact (to `info@harni.uk`, copy from `info@harni.uk`):

| Recipient | Content |
|---|---|
| Owner | Reference, received time (UTC), name, email, subject, the full message, the acknowledgement record and its version, and a "what to do" list. Reply-To is the visitor |
| Visitor receipt | Since ADR-029 (17 October 2026): reference, time, the address it was sent to, what they agreed to. No name, subject or message text, so the form cannot relay sender-written text to a typed address. Then what happens next (a reply is aimed for within five working days, not guaranteed; do not send patient information; ignore the email if it was not them), and a footer with the Privacy link. Reply-To is `info@harni.uk` |

Subscription (to `subscribe@harni.uk`, copy from `subscribe@harni.uk`):

| Recipient | Content |
|---|---|
| Owner | Reference, time (UTC), address, the exact consent wording and its version, status, and a "what to do" list |
| Subscriber copy | Reference, date and time, address, the exact consent wording and version, what to expect, and how to unsubscribe. Carries a `List-Unsubscribe` header. This replaces the earlier short thank-you |

Consent stays single-step: the required checkbox is the consent and there is no confirmation link. A contact enquiry never grants marketing consent. Sending stays disabled until the host sets `HARNI_MAIL_ENABLED=1`, `HARNI_MAIL_STATE_DIR` and `HARNI_MAIL_RATE_KEY`.

Evidence, 1 October 2026: `php backend/tests/mail.test.php` 27 PASS; `python3 backend/tests/mail-http.py` captured 4 messages (owner and visitor copy for each form); no real email was sent. NOT TESTED: delivery to a real inbox, spam placement, SPF/DKIM/DMARC, the host's PHP version and mail transport, and rendering in real mail clients.

## Local checks

Run `npm run dev:mail` for a loopback-only PHP server on 5153, alongside the Vite development server. Vite proxies `/api/` to it. Keep sending disabled: valid requests return 503 with a direct-email alternative. `npm test` and `npm run test:mail` use synthetic inputs and fake transport; they do not send email. `python3 backend/tests/mail-http.py` starts a temporary loopback PHP server on 5154 and replaces mail transport with a local capture executable. It verifies both complete submission paths without real mail delivery.

The built `dist/api/message.php` must be executed by PHP. Since ADR-028 it is only an entry file: it finds the private code from its own place (on cPanel, `~/apps/harni/current/src/`, outside the web root). Without that folder it answers 503 "temporarily unavailable". Install steps: `backend/README.md` and `DEPLOYMENT.md`. Do not serve it with a static-only public server. `vite preview` alone does not provide PHP execution. A production-like local preview can use PHP to serve `dist/` with sending disabled. Under `php -S` the entry looks two levels up from `dist/api/`, finds no backend there and gives the fail-closed 503, so form checks belong on `npm run dev` instead.

## Before enabling on the host

1. Obtain deployment approval separately. Confirm exact host/account/domain and PHP execution, mail transport availability, both mailbox addresses, sending limits, SPF/DKIM/DMARC and envelope-sender alignment.
2. Resolve `docs/05-security/LEGAL-REVIEW.md`, including provider details and the manual subscription operating process.
3. Configure server-side environment variables, never client-side `VITE_` variables:
   - `HARNI_MAIL_ENABLED=1` only after readiness checks.
   - `HARNI_MAIL_STATE_DIR`: an existing private directory outside the document root, writable only by the application account. Suggested permissions 0700.
   - `HARNI_MAIL_RATE_KEY`: a random secret of at least 32 characters, generated and installed by the operator. Never commit or paste it into chat.
4. Rate limiting fails closed if storage or the key is unavailable. Limits are 100 requests globally, 5 per network address and 3 per email address in an hour. Behind Cloudflare, the host must restore REMOTE_ADDR from trusted proxies; the application deliberately ignores user-supplied forwarding headers. Global/per-address limits also bound reference-copy abuse.
5. Review infrastructure request-body logging, private state-file permissions and backups. Configure a daily cleanup job for expired state if removal when idle is required. Application responses never include raw payloads or configuration errors.
6. Create the mailboxes `info@harni.uk` and `subscribe@harni.uk` and confirm both receive mail.
7. Publish SPF, DKIM and DMARC records for `harni.uk` and confirm the sending host aligns with them.
8. With explicit approval, send one contact and one subscription request to owner-controlled test addresses. Verify arrival in both owner inboxes and the visitor inbox, Reply-To, the full content of each copy (reference, time, consent wording and version, unsubscribe line), the `List-Unsubscribe` header, rendering of the HTML and plain-text parts, spam placement, and the sign-up and unsubscribe process. Check a denied request and a mail failure too.

## Rollback

First disable `HARNI_MAIL_ENABLED` to stop online sending while keeping direct email links available. Restore the previous reviewed `dist/` build if needed. Preserve required correspondence and consent evidence. Verify forms report unavailable rather than success, and that normal pages still load. Never replace the origin-lock `.htaccess` as part of this change.
