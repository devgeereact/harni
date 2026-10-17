# Legal and mail launch review

Status: PARTIAL. Rewritten on 1 October 2026 (ADR-025) and updated on 17 October 2026 (ADR-027). No solicitor review and no live email test has taken place. The 2026-10-01 version is live (deployed 2 October 2026); the 2026-10-17 version is in the repository only.

## 17 October 2026 audit

Full report: `../reports/harni/qa/reports/PRIVACY-LEGAL-READINESS-2026-10-17.md`.

- Added to Privacy and Cookies: Cloudflare Network Error Logging, observed on the live headers. Decide whether to keep it (REQUIRES LEGAL REVIEW on PECR regulation 6) or switch it off in Cloudflare (owner action, then remove the disclosure).
- Added to Privacy: a complaints section for the Data Protection Act 2018 s164A duty, in force 19 June 2026. The "other means" route needs the postal address.
- Form-counter retention now says what the code does: each counter expires an hour after it starts and is deleted at the next form request.
- New operator runbook: `docs/07-operations/DATA-REQUESTS.md`.
- New gates below: security headers, sign-up confirmation decision, the visitor-copy abuse risk and the consent banner rework before any statistics tool.

The four legal pages (Privacy notice, Cookies and local storage, Website terms, Delivery and refunds) are now written as finished text. Each shows "Version 2026-10-01, last updated 1 October 2026" and is no longer labelled Draft. Each has an "In short" summary and a contents list. They are carefully drafted from what the code does, but they are NOT legal advice. A UK solicitor should read them before launch. Wording cannot guarantee protection from every claim, and a low placeholder count is not legal approval.

## Decisions recorded in the pages

Decided from the code and the owner's instructions, so the pages and the code agree.

**Who and why**
- The owner is the controller, as an individual. No company, address or VAT status is claimed.
- Lawful bases: legitimate interests for handling enquiries, the emailed copy, hosting and abuse prevention; consent for book-update emails and for the optional game score.
- Single-step consent for book updates: the required checkbox is the consent. A contact enquiry never grants marketing consent. The exact consent wording and its version are recorded with each sign-up.

**Retention**

| Data | Kept for |
|---|---|
| Contact enquiries | 12 months after the last message, then deleted. Longer only for a complaint or legal claim, and never over six years |
| Sign-up record | While subscribed, and deleted within 12 months after unsubscribing |
| Do-not-email record (address only) | Until the person asks for deletion, or the list stops |
| Form-protection counters (keyed hashes) | One hour |
| Host and Cloudflare logs | Their own schedules (to be inspected before launch) |
| Optional game score | Until the player deletes it. Stored only in the player's browser |

**Sharing and security**
- Recipients: the web host, Cloudflare, email providers, advisers and authorities where the law requires.
- International transfers: safeguards wording is included. The actual providers and locations remain to be confirmed.
- Security measures stated: HTTPS, same-origin forms, fixed recipients, honeypot, rate limits and mailbox access control.
- Breach handling: notify the ICO within 72 hours where required.
- Rights: a reply within one month, with a link to complain to the ICO. Children are covered in the notice.

**Website terms**
- A strong not-medical, not-clinical, not-legal, not-financial advice disclaimer, and no reliance on the books or site for urgent patient decisions.
- Written in a personal capacity, with no NHS or employer endorsement. Case examples do not identify real people.
- Messages: no professional relationship is created; permission is to reply only; a message is never published without written permission.
- Events: nothing is booked until agreed in writing.
- Copyright with fair dealing, trade marks (Amazon, Kindle, Instagram, TikTok, Cloudflare, NHS), acceptable use, Pier Run, links and availability.
- Liability limited only as UK law allows. Death or personal injury by negligence, fraud and consumer rights are preserved. England and Wales law, with the consumer local-court carve-out.

**Site behaviour that the pages describe**
- Contact goes to `info@harni.uk`; subscriptions go to `subscribe@harni.uk`. Visitors get a detailed copy of what they sent. No CC list exposes other recipients.
- The handler keeps no message database. Correspondence stays in mail systems.
- Pier Run saves nothing unless the player ticks "Remember my best score on this device" (single key `harni.pier-run.best`), with a Delete saved score control.
- Reviews and Events: no quote is published without written permission, and no event is listed until confirmed. Both lists are currently empty. No Amazon review is copied and no star rating is shown.

## Facts only the owner can supply

Run `npm run pages -- --list` for the live count. On 10 October 2026 it reports 3 owner items, all site-wide checks (1 October: 6).

Owner facts tracked internally (the two public Privacy placeholders were removed at the owner’s request on 2 October 2026):
1. A postal address for correspondence. UK e-commerce rules ask website operators to give one.
2. The ICO data protection fee registration number, or the reason the owner is exempt.

Other open items from the same command (the `/contact/` [NEEDS] duplicated the last two and was removed on 10 October 2026): three site-wide checks (employer policy on the personal-capacity wording, `info@harni.uk` and `subscribe@harni.uk` receiving and authenticated sending, and Instagram `@lulu_harni` and TikTok `@harni_m` being live).

## Release gates

All must be recorded with evidence before any deploy. Deploy is NOT authorised.

- [ ] Solicitor review: a UK solicitor reads all four legal pages and the contact and sign-up wording.
- [ ] Owner supplies the postal address and the ICO fee registration number or exemption reason, and any required public disclosures are confirmed.
- [ ] ICO fee check: confirm whether the fee applies and, if so, that it is paid.
- [ ] Host PHP and mail test: confirm PHP execution and mail transport on the host, then send one contact and one subscription test to owner-controlled addresses (see `docs/07-operations/EMAIL.md`).
- [ ] SPF, DKIM and DMARC are published for `harni.uk` and aligned with the sending host.
- [ ] Mailboxes `info@harni.uk` and `subscribe@harni.uk` exist and receive mail.
- [ ] Cookie and log inspection on the live Cloudflare and host: confirm what cookies, logs and Network Error Logging headers are actually set, and that the Privacy and Cookies pages match. The code audit does not prove the live infrastructure sets no cookies.
- [ ] Retention schedule is adopted in practice (12-month enquiry deletion, sign-up deletion, do-not-email record) and the operator can process unsubscribe requests before the next mailing.
- [ ] Employer policy on the personal-capacity wording is checked.
- [ ] Documented balancing assessment exists for the legitimate-interests grounds.
- [ ] Complaints process in place (DPA 2018 s164A): someone covers the 30-day acknowledgement during absence, and a postal route exists once the address is supplied.
- [ ] Cloudflare Network Error Logging: keep and accept the disclosure after legal review, or switch it off and remove the disclosure.
- [ ] Security headers decided on Cloudflare or the host: HSTS, Content-Security-Policy, Referrer-Policy and Permissions-Policy are absent on the live site (17 October 2026).
- [ ] Owner decides whether sign-up stays single step. Anyone can sign up someone else's address; the copy email is the only safeguard. A confirmation link gives stronger consent evidence.
- [ ] Owner accepts or limits the visitor-copy risk: the contact copy goes to any typed address with the sender's message text, limited to 3 per address and 5 per network address an hour.
- [ ] Before any statistics tool is switched on, the consent banner is reworked: it currently loads nothing, records no version or time, and has no category or expiry handling.
- [ ] The 2026-10-17 legal pages are deployed only with the owner's approval, and the mail handler on the host records the same version.

## Sources checked on 17 October 2026

- [Data Protection Act 2018, section 164A](https://www.legislation.gov.uk/ukpga/2018/12/section/164A), inserted by the Data (Use and Access) Act 2025 s103, in force 19 June 2026.
- [ICO: how to deal with data protection complaints](https://ico.org.uk/for-organisations/how-to-deal-with-data-protection-complaints/).
- [ICO: storage and access technologies, what are the exceptions?](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/).

## Sources checked on 1 October 2026

- [ICO: the right to be informed](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/).
- [ICO: legitimate interests](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/legitimate-interests/).
- [ICO: direct marketing planning](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/plan-direct-marketing/).
- [ICO: storage and access technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-storage-and-access-technologies/).
- [ICO: international transfer safeguards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-guide-to-international-transfers/how-do-we-comply-with-the-transfer-rules-if-were-initiating-the-restricted-transfer/).
- [Consumer Rights Act 2015, section 65](https://www.legislation.gov.uk/ukpga/2015/15/section/65).
- [PHP mail manual](https://www.php.net/manual/en/function.mail.php), queried through Context7. A true result means accepted for delivery, not delivered to an inbox.
