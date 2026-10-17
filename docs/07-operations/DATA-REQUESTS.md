# Data requests, complaints and retention

Status: written 17 October 2026 from the code and the Privacy notice (Version 2026-10-17). Not legal advice. A UK solicitor should confirm it with the legal pages (`docs/05-security/LEGAL-REVIEW.md`).

harni.uk has no accounts and no database. Personal information lives in two places the owner controls: the `info@harni.uk` mailbox (contact enquiries, rights requests, complaints) and the `subscribe@harni.uk` mailbox (sign-up records, unsubscribe requests, the do-not-email list). Rate-limit counters on the host hold keyed hashes only and expire within an hour. Every request below is therefore handled by hand in those mailboxes.

## How people reach you

- Rights requests and data protection complaints: the contact form or an email to `info@harni.uk`. The Privacy notice asks for the subject "Data protection complaint" for complaints. Treat a request as valid whatever words or channel are used, including a reply to any harni.uk email.
- Unsubscribe: a reply with "Unsubscribe", an email to `subscribe@harni.uk`, or the `List-Unsubscribe` mailto link in the sign-up copy.
- Postal route: NOT AVAILABLE until the owner supplies a correspondence address (owner item). Section 164A of the Data Protection Act 2018 asks controllers to accept complaints electronically "and by other means".

## Keep a request log

Keep one private log (a spreadsheet in the owner's own storage, never in this repository) with: reference, date received, channel, request type, identity check done, acknowledgement date, due date, outcome date and a one-line outcome. Do not copy message contents into the log. Delete each row 12 months after the request closes unless a complaint or legal claim is open (REQUIRES LEGAL REVIEW: the log retention period).

## Identity checks

Ask only for what is proportionate. Usually the request comes from the same address that sent the enquiry or signed up, which is enough. If it comes from a different address, reply to the address on record and ask the person to confirm from there. Never ask for passport or other identity documents by email. Never send personal information to an address that has not been confirmed.

## Deadlines

| Request | Acknowledge | Respond | Source |
|---|---|---|---|
| Access, correction, deletion, restriction, objection, portability | Not required by law, but reply promptly | Within one month of receipt. Extendable by up to two further months for complex or numerous requests, telling the person within the first month | UK GDPR Article 12(3) (REQUIRES LEGAL REVIEW for any extension) |
| Data protection complaint | Within 30 days, starting the day after receipt | Without undue delay: look into it, keep the person updated, tell them the outcome | Data Protection Act 2018 s164A; ICO complaints guidance |
| Unsubscribe or marketing objection | Not required | Before the next mailing, and always stop marketing | Privacy notice; UK GDPR Article 21(3) |

Arrange cover for holidays and illness. The 30-day complaint acknowledgement still runs when the owner is away.

## What to do for each request

- **Access**: search both mailboxes for the person's address and name. Send a copy of their messages, sign-up record and do-not-email entry (if any) to the confirmed address. Explain that hosting and Cloudflare logs are held by those providers and that the site keeps no copy.
- **Deletion**: delete their enquiries and sign-up record from inbox, sent, archive and trash in both mailboxes. If they were subscribed, explain that keeping the address on the do-not-email list stops future emails; delete it too if they insist. Tell them their own copies stay in their inbox. Keep a record only if a complaint or legal claim is open.
- **Correction**: correct the sign-up record or reply with the corrected detail on file.
- **Unsubscribe**: remove the address from the mailing list, add it to the do-not-email list, and delete the sign-up record within 12 months.
- **Complaint**: acknowledge within 30 days, investigate, reply with the outcome and say they can complain to the ICO at any time.

## Retention sweep (monthly)

The site cannot delete mail for you. Once a month:

1. In `info@harni.uk`, delete enquiries where the last message is over 12 months old, unless a complaint or legal claim is open. Empty trash.
2. In `subscribe@harni.uk`, delete sign-up records of people who unsubscribed over 12 months ago. Keep only the address on the do-not-email list.
3. Check the request log for rows due for deletion.
4. Note the date of the sweep in the log.

Mail provider backups and retention settings are UNKNOWN (owner item). Check what the provider keeps after deletion and say so in the Privacy notice if it differs.

## Never

- Publish, quote or forward a message without written permission (BR-014).
- Treat a contact enquiry as marketing consent (BR-016).
- Show the subscriber list to anyone or send to subscribers in the visible To or Cc fields.
- Keep patient or health information that was sent by mistake. Delete it and tell the sender.
