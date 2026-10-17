# Launch Checklist

Status: the real-catalogue build (ADR-023) runs on localhost and is awaiting owner review. Deploy is NOT authorised. See ADR-011 to ADR-016.

- [ ] Product acceptance criteria are proved.
- [ ] Functional, UX, accessibility, performance, security and regression audits have decisions.
- [ ] Website launch checklist is complete where applicable.
- [ ] PWA release checklist is complete where applicable.
- [ ] Privacy, terms, consent and contact facts are verified where applicable.
- [ ] Production build and configuration are verified.
- [ ] Monitoring and error handling are operational.
- [ ] Backup, recovery and rollback are documented and tested in proportion to risk.
- [ ] Known issues have owners and accepted release decisions.
- [ ] Release owner has recorded `GO`, `NO-GO` or `CONDITIONAL GO` with evidence.

## Bookstore release: done from Amazon (ADR-023, read 2026-10-01)

- [x] Which books exist: 13, listed in `docs/01-product/CATALOGUE.md`
- [x] Channel per book: Amazon only (shop window, no sales on harni.uk)
- [x] Kindle Unlimited and KDP Select status: all 13 are enrolled, so no direct ebook sale (BR-002)
- [x] Amazon link and paperback link per book
- [x] Cover image per book (saved from Amazon, self-hosted)
- [x] Blurb and "who it's for" per book (the owner's Amazon descriptions, lightly edited for punctuation)
- [x] Live date and page count per book
- [x] Author bio and Amazon author-page URL
- [x] Amazon author photo in use (she chose it)

## Bookstore release: owner tasks still open

**Amazon listings (fix in KDP, see KNOWN-ISSUES)**
- [ ] Fix the title typos: stray word "Paperback" in The Triage Mindset; "PathTo" in Gratitude Reimagined; "WARD:JOYFUL" in Beyond the Ward; the stray full stop in "The Honest Truth About Nurses.:"; the trailing full stop in The 30-Day Relationship Reboot
- [ ] Settle the mixed ALL-CAPS and mixed-case titles
- [ ] Fix description glitches (for example "aga. in" in The NHS Healer's Handbook; list items run together)
- [ ] Check the "Results readers report" section in Gratitude Reimagined, which is a claim
- [ ] After editing KDP, tell me so the site titles and `kdpTitle` can be compared again (BR-008)

**Site-wide**
- [ ] Confirm the blurbs and "who it's for" text on the site
- [ ] Confirm you are happy with the real covers and the author photo (a more formal photo is recommended later)
- [ ] Employer policy check on "I write in a personal capacity..." (CHECK)
- [ ] Confirm Instagram `@lulu_harni` and TikTok `@harni_m` are live and public
- [ ] Confirm `info@harni.uk` receives mail (the old page used `hello@harni.uk`)
- [ ] Decide on the "Kindle Unlimited" tag wording, since it may go stale
- [ ] Review how the two Christian-content titles are presented, if you want to (Hands That Care, Hearts That Hope; The 30-Day Relationship Reboot)
- [ ] Name of the statistics tool and the mailing list service. No checkout provider is needed

**About**
- [ ] One or two sentences on what the books are for, if you want them
- [ ] PhD subject, only if you want it shown

**Join the list and Thank you** (SUPERSEDED by ADR-025: sign-up is single step with a copy emailed to the subscriber and no confirmation email or external mailing service; see the gates at the end of this file)
- [ ] Mailing list service
- [ ] Sender name and address of the confirmation email
- [ ] Approval of the consent wording

**Events and Reviews**
- [ ] Any events, or leave empty
- [ ] Real reader quotes with permission, or leave empty (one Amazon review exists; none is shown)

**Privacy, Cookies, Terms, Delivery and refunds (drafts; rewritten as Version 2026-10-01 under ADR-025, remaining owner facts are in the gates at the end of this file)**
- [ ] Legal or trading name and contact address
- [ ] Data regulator registration status and VAT status
- [ ] Retention periods and provider names
- [ ] Statistics tool details: what it stores
- [ ] Governing law confirmed
- [ ] You read all four pages, ideally with a professional, before launch (open owner items fell from 76 to 34)

## Email and content update, 1 October 2026

- [ ] Resolve operator, address, provider, retention and transfer facts in `docs/05-security/LEGAL-REVIEW.md`; review all legal drafts.
- [ ] Confirm PHP execution and mail transport before uploading `/api/message.php` (since ADR-028 a thin entry from `backend/public/api/`; the code lives in `backend/src/`).
- [ ] Configure private rate-limit storage and sending only after verification in `docs/07-operations/EMAIL.md`.
- [ ] Verify live owner and visitor inbox delivery with explicit approval, including subscription confirmation and opt-out handling.
- [ ] Complete visual/mobile/keyboard review of updated pages and Pier Run controls. Current browser verification is blocked by unavailable computer-use permissions.
- [ ] Obtain separate deployment approval.

## Release gates added 1 October 2026 (ADR-025)

Deploy is NOT authorised. All of these are open. Details in `docs/05-security/LEGAL-REVIEW.md` and `docs/07-operations/EMAIL.md`.

- [ ] Solicitor review: a UK solicitor reads the Privacy notice, Cookies and local storage, Website terms and Delivery and refunds pages (Version 2026-10-01). They are not legal advice.
- [ ] Owner supplies the postal address for correspondence and the ICO fee registration number or exemption reason, so the two [NEEDS] boxes on the Privacy page can go. Run `npm run pages -- --list` for the live owner-item count (6 on 2026-10-01).
- [ ] ICO fee check: confirm whether the data protection fee applies and is paid.
- [ ] Host PHP and mail test: PHP execution and mail transport confirmed on the host, then one contact and one sign-up test to owner-controlled addresses, checking both owner notifications and both visitor copies.
- [ ] SPF, DKIM and DMARC published and aligned for `harni.uk`.
- [ ] Mailboxes `info@harni.uk` and `subscribe@harni.uk` created and receiving mail.
- [ ] `HARNI_MAIL_ENABLED=1`, `HARNI_MAIL_STATE_DIR` and `HARNI_MAIL_RATE_KEY` set on the host (key generated by the operator, never pasted into chat or committed).
- [ ] Cookie and log inspection on the live Cloudflare and host, and the Privacy and Cookies pages corrected if they differ.
- [ ] Retention and unsubscribe process adopted in practice (12-month enquiry deletion, unsubscribe honoured before the next mailing).
- [ ] Events and Reviews: confirm any real events or reader quotes with written permission, or leave the lists empty.
- [ ] Pier Run checked on a real phone, with audio, with a screen reader and a full keyboard walk. About, Events, Reviews and legal pages browser-reviewed.
- [ ] Replace the Amazon footer glyph with the proper brand mark if the owner wants one.
- [ ] Obtain separate deployment approval.

## Backend install and security headers, 17 October 2026 (ADR-028, ADR-029)

Deploy is still NOT authorised. Every step below that touches the host or Cloudflare needs explicit owner approval in that session. Steps in full: `docs/07-operations/DEPLOYMENT.md`, `backend/README.md` and `docs/07-operations/SECURITY-HEADERS.md`.

- [ ] Back up the live `~/harni.uk/api/` folder.
- [ ] Private folder installed outside the web root: copy `backend/src/` to `~/apps/harni/releases/<YYYYMMDD-HHMM>/src/` and point the `~/apps/harni/current` symlink at that release.
- [ ] `~/harni.uk/api/backend-path.php` written on the host (one line returning the absolute path of `~/apps/harni/current`). Never committed.
- [ ] Dry run of `cpanel-deploy dist harni.uk --keep .well-known --keep cgi-bin` read, including whether `api/.htaccess` is uploaded; root `.htaccess` untouched.
- [ ] After `--go`: `curl -s -i https://harni.uk/api/message.php` returns 405 with a JSON body and `Allow: POST`; `/api/backend-path.php` and `/api/.htaccess` return 403.
- [ ] Security headers added on Cloudflare as Report-Only first, browser consoles checked on Home, Contact, Join and `/play/`, then enforced.
- [ ] NEL switched off on Cloudflare and `NEL` / `Report-To` gone from `curl -sI https://harni.uk/`; Privacy and Cookies pages updated to match.

