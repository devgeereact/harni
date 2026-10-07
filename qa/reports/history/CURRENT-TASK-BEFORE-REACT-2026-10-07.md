## Latest header consistency update: 2 October 2026

Applied the About/Events editorial header direction site-wide using shared page-heading styles: white backgrounds, left alignment, consistent spacing, bold headings and lead text. Home headline shortened while its introduction retains audience and topic details. Book titles use a smaller scale; Pier Run remains compact. PASS: build/typecheck, 44 tests, 54 browser checks across all 27 pages at 390px and 1440px. No overflow, missing images, empty links or JavaScript errors. Visual spot checks of Home, Contact and a long book title also passed. Local only.

## Latest refinement: 2 October 2026

Removed the two public postal-address and ICO placeholder entries from Privacy as requested. No replacement facts were invented; internal legal review remains in docs/05-security/LEGAL-REVIEW.md. Events rebuilt with an editorial introduction, a clear diary/empty state, organiser brief, one enquiry button and a quieter reading-group link. Existing confirmed-event data and date sorting retained.

PASS: build/typecheck, 44 site/game tests, mobile/desktop browser checks on Events and Privacy. Local only; no deployment.

## Latest update: 2 October 2026

About has been completely restructured as an editorial author profile. Legal pages now span the shell with balanced reading rows. Game obstacles have explicit object/action labels and stronger details; decorative scenery sits behind the lane. Repeated page actions were reduced and book category anchors repaired. Local changes only, no deploy or live email.

PASS: build/typecheck, 44 site/game tests, 27 mail checks; browser checks on all 27 pages at mobile and desktop widths; internal links/anchors; key menu, FAQ, filter, form-validation and game interactions. Visual screenshots and exact limits: `qa/WEBSITE-REBUILD-2026-10-02.md`. Owner legal facts, live mail and physical device/screen-reader checks remain open.

## Latest request follow-through: 1 October 2026

Removed the entire About “Beyond the work / The person behind the books” section and its unused style. Simplified the subscription form success message to “Thank you for joining my mailing list!” while retaining the email reference copy. Existing contact routing, subscription routing, Amazon footer, richer About, Events, Reviews, Pier Run and legal pages are retained.

Verification: PASS, 44 site/game tests, 27 mail checks, production build and local HTTP integration with four captured messages to the correct owner and visitor destinations. PASS, removed section absent from generated and built About pages. No real email sent. Browser visual verification NOT TESTED. Live mail configuration, owner legal facts and legal review remain outstanding as recorded below.

# Current task update: 1 October 2026 (latest, ADR-025)

All work is local and awaiting owner review. **Deploy, push and any live email test are NOT authorised.**

State:
- Latest character/gameplay rebuild: original sun-cap seaside hero replaces the nurse sprite; lighter skies, always-available single air jump and scored beach-ball bounce. All 44 tests and build PASS. Live visual/device verification remains outstanding. See `qa/PIER-RUN-HERO-2026-10-01.md`.
- Latest Pier Run polish: preserved the newer bright game and mechanics, added a fictional lighthouse/reading room, book-satchel runner detail, wave/bookmark collectibles, postcard start panel and zone-aware route indicator. Fixed Space on focused controls. Build and 41 tests PASS; this polish has no browser visual verification. See `qa/PIER-RUN-POLISH-2026-10-01.md`.
- Email: contact to `info@harni.uk`, sign-up to `subscribe@harni.uk`. Owner notifications and visitor copies are detailed multipart emails, and the subscriber now also gets a copy of their sign-up (single-step consent, no confirmation link). Sending is off until the host sets `HARNI_MAIL_ENABLED=1`, `HARNI_MAIL_STATE_DIR` and `HARNI_MAIL_RATE_KEY`. Verified with `php tests/unit/mail.test.php` (27 PASS) and `python3 tests/integration/mail-http.py` (4 captured messages). No real email sent. Real delivery, SPF/DKIM/DMARC and host PHP NOT TESTED.
- About rebuilt richer from the owner's Amazon bio (Lighthouse mobile 100/100/100). Events and Reviews are data driven, empty until confirmed, and indexable. Amazon author page is a footer icon link.
- Pier Run rebuilt as a bright seaside game (41 unit tests pass, Lighthouse mobile `/play/` 100/100/100). Not tested on a real phone, with audio, a screen reader or a full keyboard walk.
- Legal pages rewritten as Version 2026-10-01. Not legal advice. `npm run pages -- --list` reports 6 owner items (3 flags on 2 pages, plus 3 site-wide checks). Two owner facts stay as [NEEDS] boxes on Privacy: postal address, ICO fee registration or exemption reason.
- Decision: ADR-025 (ADR-024, from an earlier session, is partly superseded: no CONFIRM step, legal pages no longer Draft, Events and Reviews indexable).

Next actions:
1. Owner reviews the localhost preview (About, Events, Reviews, legal pages, Pier Run).
2. Owner supplies the postal address and the ICO fee facts, and confirms the employer policy wording.
3. A UK solicitor reads the four legal pages.
4. Verify host PHP, mailboxes, SPF/DKIM/DMARC, then a supervised mail test (see `docs/07-operations/EMAIL.md`).
5. Inspect live Cloudflare and host cookies and logs.
6. Test Pier Run on a real phone, with audio and a screen reader.
7. Only then ask for separate deployment approval. Gates are in `docs/09-release/LAUNCH-CHECKLIST.md` and `docs/05-security/LEGAL-REVIEW.md`.

The sections below are earlier updates, kept for history. Where they conflict (CONFIRM step, Draft legal labels, simple About, 12 Node tests, 19 PHP checks), this section wins.

---

# Current task update: 1 October 2026

The owner requested email routing and visitor copies, Amazon in footer socials, richer About/Events/Reviews/Pier Run and full legal drafts. Local changes are implemented. No push or deploy is authorised.

- Pier Run now uses a compact white/coral game-only layout with viewport-responsive canvas, brief controls, state-aware Pause/Resume and collapsed score settings. The photo hero and long guide are removed.
- About has been rebuilt as a clean professional author profile with portrait, career/education, selected books, personal background and contact sections. Build and static page checks PASS; visual review remains BLOCKED by no connected browser.
- Contact now requires acknowledgement of the linked Privacy Notice and agreement to Website Terms, enforced in the browser and PHP. Marketing consent remains separate.
- Forms now POST to a PHP endpoint. Contact: info@harni.uk; subscriptions: subscribe@harni.uk. Contact reference copies and simple subscription thank-you emails are implemented. The owner removed the CONFIRM step; sign-up uses the required consent checkbox. Sending is off until host mail is verified.
- New PHP runtime and private rate-limit file are documented in `docs/07-operations/EMAIL.md`. No provider accounts or infrastructure were changed.
- Pages expanded from existing verified biography/catalogue. No invented event dates or testimonials. Pier Run has optional score saving, deletion and a pause button.
- Privacy, Cookies, Terms and Delivery/refunds are full drafts. Missing legal operator/provider facts remain launch gates in `docs/05-security/LEGAL-REVIEW.md`.
- PASS: typecheck, build, 12 Node tests, 19 PHP checks and local HTTP validation. Browser visual checks BLOCKED by unavailable browser connection/computer-use permissions. Live inbox delivery NOT TESTED.
- Next: confirm mail provider/host capabilities and legal operator details, complete browser review, then seek deployment approval. Detailed current evidence is in `qa/EMAIL-CONTENT-2026-10-01.md`.

---

## Previous catalogue task (historical context)

# Current Task

- Outcome: the real-catalogue rebuild of `harni.uk` (ADR-023) is DONE locally and awaiting owner
  review. It runs on localhost only (the owner's `dev-all` tool serves it at `http://localhost:5202`).
- In scope so far: the 13 books from the owner's Amazon author page (read 2026-10-01), four groups,
  real self-hosted covers, the author photo, new layouts for Home, Books, book pages and About,
  revised legal drafts (no checkout provider, no ebook orders), and updated project documents.
- Out of scope: push, deploy, DNS, mail, accounts, payments, a real mailing list, a real statistics
  tool, choosing hosts. harni.uk is a shop window and takes no orders or payments.
- Primary mode: Website build.
- Authority: the owner approved local implementation on 2026-10-01 and said: do not deploy until I
  authorise. **Deploy is still NOT authorised.** Push and deploy need a separate explicit approval.
- Decisions: ADR-011 to ADR-023 in `docs/08-change-management/DECISIONS.md`. ADR-023 supersedes the
  launch ten (ADR-015) and the three themes and designed covers (ADR-018).
- Content sources: `docs/01-product/CATALOGUE.md` (the 13 books), `src/data/books.ts`,
  `docs/03-design/UX-SPEC.md` and `docs/03-design/DESIGN-SYSTEM.md`.
- Evidence so far: typecheck PASS, 10 unit tests PASS, build PASS, Lighthouse mobile Home
  100/100/100 and Books 100/100/92 (then a vague link fixed), layout screenshots of Home, Books and
  one book page at about 1280px and Home and Books at 390px. NOT TESTED: other book pages, About,
  Join, legal pages, a real phone, a keyboard walk, a screen reader. See
  `docs/06-quality/EVIDENCE-STATUS.md`.
- Next action: the owner reviews the localhost preview and fixes the KDP title typos (KNOWN-ISSUES
  20 and 21), then decides on deploy.

## Open before launch

1. Owner fixes the Amazon title typos and description glitches in KDP, and checks the claim in
   "Results readers report" (Gratitude Reimagined).
2. Owner confirms the real covers, the lightly edited blurbs and the author photo (a more formal
   photo is recommended later).
3. Owner chooses and supplies: mailing list service and statistics tool. No checkout provider is
   needed while all 13 books are in KDP Select.
4. Owner supplies legal facts: legal or trading name, contact address, data regulator
   registration status, VAT status (open owner flags: 34, down from 76).
5. Owner reads all four legal pages, ideally with a professional.
6. Owner checks the employer policy on the "personal capacity" line.
7. Confirm `info@harni.uk` receives mail, and that Instagram `@lulu_harni` and TikTok `@harni_m`
   are live.
8. Decide on the "Kindle Unlimited" tag wording, and whether to review the presentation of the two
   Christian-content titles.
9. Test the other book pages, About, Join and the legal pages, then a real phone, a keyboard walk
   and a screen reader.
10. Check the live Cloudflare and `.htaccess` facts before the first bookstore deploy (see
    `docs/07-operations/DEPLOYMENT.md`).

## 7 October 2026: workspace server setup (Codex)

Owner requested fixed ports and local startup for all active projects. Preserved Harni 5152, mail 5153, Volume web 5180 and API 5181. Workspace start-projects.mjs provides a foreground launcher; LOCAL-SERVERS.md records commands and evidence. Runtime BLOCKED by sandbox loopback EPERM, Node 24 instead of required 26, unavailable PHP and missing Linux native dependencies. npm registry lookup also fails with EAI_AGAIN. No server running, environment/data files read, live AI call or deployment. Next: restore prerequisites in a normal network-enabled terminal, run the launcher and verify HTTP responses.

## 7 October 2026: Linux restoration verified

Codex: clean npm install from unchanged lockfile PASS; typecheck/build, 44 site tests, 27 PHP tests and captured HTTP mail integration PASS. Workspace-local Ubuntu PHP 8.3 CLI restored without sudo; launcher forces real mail off. Local HTTP and explicit private-IP LAN HTTP/browser/WebSocket checks PASS. Second physical device and real email NOT TESTED. Optional media regeneration still needs macOS sips/cwebp/avifenc and is not required to run the site. Shared startup/restoration instructions: ../LOCAL-SERVERS.md. Earlier sandbox/network blockers are superseded by this verification. Prior work preserved; no deployment or commit.
