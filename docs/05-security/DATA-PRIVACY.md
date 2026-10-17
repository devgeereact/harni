# Data and privacy

Updated 17 October 2026 (ADR-027): the legal pages are Version 2026-10-17 in the repository (the live site still shows 2026-10-01 until a deploy is authorised). They add Cloudflare Network Error Logging and a complaints section. They are NOT legal advice. Runtime evidence and the full register are in `../reports/harni/qa/reports/PRIVACY-LEGAL-READINESS-2026-10-17.md`. Requests, complaints and the monthly retention sweep: `docs/07-operations/DATA-REQUESTS.md`.

Earlier status, 1 October 2026 (ADR-025): the legal pages were Version 2026-10-01, written as finished text but NOT legal advice. Live provider configuration remains unknown. Read `LEGAL-REVIEW.md` for the decisions, the two owner facts still missing and the release gates.

| Data | Purpose and source | Required | Location and recipients | Basis | Retention and control |
|---|---|---|---|---|---|
| Name, email, message, optional subject, acknowledgement record and version | Visitor enquiry, owner notification and the visitor's copy | Name, email, message and the Privacy and Terms acknowledgement | PHP memory during the request; the `info@harni.uk` mailbox and the visitor's own mailbox | Legitimate interests | 12 months after the last message, then deleted. Longer only for a complaint or legal claim, never over six years. Operator must apply this by hand |
| Email, exact consent wording and version, UTC time, reference | Book-update sign-up, owner notification and the subscriber's copy | Email and the consent checkbox | `subscribe@harni.uk` mailbox and the subscriber's mailbox. No website subscriber database | Consent | While subscribed. Deleted within 12 months after unsubscribing. Unsubscribe is honoured before the next mailing |
| Do-not-email record (address only) | Stops further mailings to someone who unsubscribed | Created on unsubscribe | `subscribe@harni.uk` mailbox | Legitimate interests | Until the person asks for deletion, or the list stops |
| Keyed IP and email hashes and counters | Form abuse prevention | Automatic when sending is enabled | Private server-side file outside the document root | Legitimate interests | One hour; pruned on the next request |
| Technical request logs | Site delivery and protection | Automatic | Web host and Cloudflare | Legitimate interests | Under their own schedules. UNKNOWN, inspect before launch |
| Connection error reports (Cloudflare Network Error Logging): page address, error type, time, IP address | Network fault detection by Cloudflare | Automatic. Every live response sends `NEL` and `Report-To` headers (`max_age` 604800, `success_fraction` 0), seen 17 October 2026 | The visitor's browser keeps the policy up to 7 days; reports go to `a.nel.cloudflare.com` | Legitimate interests (REQUIRES LEGAL REVIEW, including whether PECR regulation 6 applies) | Cloudflare's own schedule. The owner can switch it off in the Cloudflare dashboard |
| Optional Pier Run best score | Remember a score, visitor choice | No | The player's browser only, key `harni.pier-run.best` | Consent (the "Remember my best score on this device" box) | Off on every visit. Nothing is written to localStorage, sessionStorage or cookies unless ticked. "Delete saved score" removes it |

## Recipients

The web host, Cloudflare (proxy), the email providers that carry the two mailboxes, professional advisers and authorities where the law requires. Provider names, processing locations, processor terms and international transfer safeguards are UNKNOWN until the owner confirms them (`LEGAL-REVIEW.md`).

## Copies to visitors

Every sender receives a copy of what they sent, so nobody has to guess what was recorded.

- Contact: reference, time, name, email, subject, the full message, what they agreed to, what happens next (a reply is aimed for within five working days, not guaranteed), a warning not to send patient information, an instruction to ignore the email if it was not them, and a Privacy link.
- Sign-up: reference, date and time, address, the exact consent wording and version, what to expect and how to unsubscribe, with a `List-Unsubscribe` header.
- Messages are sent as escaped multipart (plain text and HTML) emails, and no visitor-supplied text goes into a header.
- An address can still be mistyped or impersonated. The copy says what to do if the request was not theirs. A contact message never triggers marketing.

## Other facts

- No checkout, payment details, accounts, analytics service, advertising pixels or third-party social embeds. Covers, fonts, the author photo and globe assets are self-hosted. Pier Run makes no third-party request. Amazon is an external retailer and its links carry no affiliate tag.
- A message is never published, and no review quote or event is listed, without written permission or confirmation. The Reviews and Events lists are empty today.
- Security measures: HTTPS, same-origin forms, fixed recipients that a browser cannot override, a honeypot field, rate limits, and mailbox access control. A breach that must be reported goes to the ICO within 72 hours.
- Individuals' rights: a reply within one month, with a right to complain to the ICO.
- Complaints to the owner (Data Protection Act 2018 s164A, in force 19 June 2026): contact form or email with the subject "Data protection complaint"; acknowledged within 30 days. No postal route until the owner supplies an address.
- Runtime evidence, 17 October 2026: on all 26 built pages a clean visit makes no request to another host and leaves no cookie, localStorage, sessionStorage or IndexedDB entry (`tests/e2e/privacy.spec.ts`). The live site, read in a browser on the same day, contacted only `harni.uk` and set no cookie or storage on six pages.
- Open owner facts for the Privacy page: a postal address for correspondence, and the ICO fee registration number or the reason for exemption.
