## 2026-10-17, GEE OS 1.4.5 cPanel restructure (local, not deployed)

- Mail code moved out of the web root into `backend/src/` (render, message, delivery, rate-limit,
  endpoint). `backend/public/api/message.php` is the only public PHP file and keeps the URL
  `/api/message.php`. A deny-list `api/.htaccess` ships beside it. The build copies only those two
  files into `dist/api/` (ADR-028).
- PHP tests moved to `backend/tests/`; `npm run test:mail` now runs the unit and HTTP capture checks.
- GEE OS contract completed: `.claude/settings.json` guard hook, `.githooks/pre-commit`,
  `scripts/agent_guard.py`, `scripts/guard.py`, `scripts/verify.py`, `PROJECT-MEMORY.md`, `cpanel`
  stack profile in `.agent/PROJECT.yml`.
- Server steps for the next deploy are in `docs/07-operations/DEPLOYMENT.md`.

## 2026-10-07, project layout cleanup

Moved 27 generated route HTML files into ignored `.generated/pages/` and removed the empty root route folders. Vite, development and production builds use the new layout while retaining existing URLs and public content. Also corrected email fallback HTML to match its client hydration data in development.


## 2026-10-07, local React/Tailwind rebuild candidate

React SSR/hydration on the existing 27 routes; feature controllers; Tailwind without Preflight; Sharp media; Mise runtime and managed private development startup. Original source remains intact. Ubuntu checks pass, actual Mac and owner acceptance remain open. No deployment. Evidence: ../reports/harni/qa/reports/REACT-REBUILD-2026-10-07.md.

# Changelog

## 2026-10-02, deployed to harni.uk

- Commit 4a76e41 (bookstore, real catalogue, emailed copies, legal pages, Pier Run rebuild) deployed with `cpanel-deploy`. Form email sending is disabled on the host until configured. No git remote exists yet, so nothing is pushed.

## 2026-10-01, email copies, About, Events, Reviews, legal pages and Pier Run rebuild (localhost only)

Recorded as ADR-025 (ADR-024 was taken by an earlier session and is partly superseded).

- Email: contact goes to `info@harni.uk` and sign-up to `subscribe@harni.uk` (fixed server side). Owner
  notifications and visitor copies are detailed multipart emails (plain text and HTML, escaped, base64, no
  visitor text in headers). The visitor copy has the reference, time, name, email, subject, full message, what
  they agreed to and what happens next. The subscriber now gets a copy of the sign-up too (reference, time,
  address, exact consent wording and version, what to expect, how to unsubscribe, `List-Unsubscribe` header).
  Consent stays single step with no confirmation link. The site text says a copy has been sent and shows the
  reference. Sending stays off until `HARNI_MAIL_ENABLED=1`, `HARNI_MAIL_STATE_DIR` and `HARNI_MAIL_RATE_KEY`
  are set on the host.
- Footer: the Amazon author page is an icon link in the footer social icons, and also in the Contact and
  About link lists.
- About rebuilt from the owner's Amazon bio and listings: intro with jump links, at-a-glance strip,
  professional background, a five-step "path so far" (no dates invented), the writing with four groups and
  four principles, who the books are for, a 13-book timeline (13 Nov 2025 to 5 Feb 2026), beyond the work,
  seven FAQs, press bios, connect, a personal-capacity note and Person JSON-LD.
- Events and Reviews are data driven (`src/data/events.ts`, `src/data/reviews.ts`). Both lists are empty
  because nothing is confirmed and no permission exists, so the pages show honest empty states, Amazon review
  links for all 13 books and enquiry guidance. Both are now indexable and in `sitemap.xml` (priority 0.4),
  superseding the noindex part of ADR-014. 10 new unit tests.
- Pier Run rebuilt as a bright seaside game (Beach, Pier, Promenade, Fun fair) with a code-drawn nurse-runner,
  hazards, book and heart pickups, three power-ups, three hearts, combo to x5, hold-to-jump, pause, sound off
  by default and an end card. Score saving is opt-in (single key `harni.pier-run.best`) with a delete control.
  Play JS 16.3 kB gzip, no third-party requests. `../reports/harni/qa/PIER-RUN-REFRESH-2026-10-01.md` is marked superseded.
- Legal pages rewritten (Privacy notice, Cookies and local storage, Website terms, Delivery and refunds):
  Version 2026-10-01, an "In short" box, a contents list, retention periods, recipients, security, rights and
  a fuller terms disclaimer. Two owner facts remain visible [NEEDS] boxes on the Privacy page (postal address,
  ICO fee registration or exemption). `npm run pages -- --list` reports 6 owner items. NOT legal advice: a UK
  solicitor should read them before launch.
- Docs updated: DECISIONS (ADR-025), EMAIL, LEGAL-REVIEW, DATA-PRIVACY, BUSINESS-RULES (BR-013 to BR-017),
  USER-JOURNEYS (J-007 to J-009), ARCHITECTURE, INTEGRATIONS, UX-SPEC, DESIGN-SYSTEM, ACCESSIBILITY,
  EVIDENCE-STATUS, LAUNCH-CHECKLIST, KNOWN-ISSUES (rows 30 to 38).
- Checks: `php tests/unit/mail.test.php` 27 PASS; `python3 tests/integration/mail-http.py` 4 captured
  messages, no real email sent; 41 unit tests PASS; Lighthouse mobile About and Play 100/100/100. NOT TESTED:
  real inbox delivery, spam placement, SPF/DKIM/DMARC, host PHP, a real phone, audio, a screen reader.
- Nothing is deployed or pushed.

## 2026-10-01, real catalogue from Amazon (localhost only)

- The catalogue is now the 13 books on the owner's Amazon author page, read from the page and each listing
  on 2026-10-01 (ADR-023). They replace the launch ten, which came from a planning list of 109 titles and
  do not exist on Amazon. The old list is kept in CATALOGUE.md as a historical planning list.
- All 13 are live on Amazon.co.uk as Kindle and paperback and all are in Kindle Unlimited, so in KDP Select.
  The site is a shop window: it takes no orders or payments and sells no ebook. Buttons are "Buy on Amazon"
  and "Get the paperback", both opening Amazon in a new tab. No prices.
- Four groups replace the three themes: Safe practice (5), Career and voice (2), Wellbeing for nurses (4),
  Everyday life (2). The Book data model gained `subtitle`, `kdpTitle`, `group`, `kindleUnlimited`,
  `paperbackUrl`, `published`, `pages`, `cover`, `blurb` and `whoFor`.
- Real covers (400 and 800 px, self-hosted) replace the designed SVG covers, with a CSS spine and sheen.
  The author photo is her Amazon profile image.
- Layout: Books has group chips, one "Most popular" feature row and 12 books in three rows of four.
  Home has a 3-cover fan, a credentials strip, four reader paths, four featured books, About with photo and
  a join card. Book pages show the cover, tags, two Amazon buttons, About this book, Who it's for, an advice
  note, an author box and four more books. About uses her Amazon bio in the first person.
- Copy: new homepage H1 ("Practical, evidence-based guides for NHS nurses and healthcare professionals.")
  and footer line. Privacy, Terms and Delivery and refunds no longer mention a checkout provider or ebook
  orders. Owner items flagged [NEEDS] or [CHECK] fell from 76 to 34.
- BR-002 now means no direct ebook sale while a book is in KDP Select (all 13 are). BR-008 is relaxed: site
  titles are tidied and `kdpTitle` holds the exact Amazon string. New rules BR-011 and BR-012.
- Checks: typecheck PASS, 10 unit tests PASS, build PASS, Lighthouse mobile Home 100/100/100 and Books
  100/100/92, then a vague "Read more" link was fixed. Screenshots of Home, Books and one book page at about
  1280px and Home and Books at 390px show no horizontal overflow. NOT TESTED: other book pages, About, Join,
  the legal pages, a real phone, a keyboard walk and a screen reader.
- Nothing is deployed or pushed.

## 2026-10-01, contact page and footer text (localhost only)

- Contact page body rebuilt to match the 21st.dev "contact-with-globe" block exactly (ADR-022), under the
  site's own page header band: contact rows, a draggable turning globe with real country outlines, and a
  "Send a message" card. Replaces the first attempt (simple SVG globe and a ticket card), which was dropped.
- The form opens the visitor's own email app. Nothing is stored or sent by the site.
- New packages: d3-geo, topojson-client, world-atlas (and types). The map loads in a lazy 131 kB chunk on
  this page only, with no request to another site. "Company" became "Subject"; the email field is optional.
- Footer: the personal-capacity and health notes moved into the line under the brand.
- Lighthouse on the built Contact page: 100 / 100 / 100.

## 2026-10-01, footer layout (localhost only)

- Footer rebuilt in the layout of the 21st.dev "footer-7" block (ADR-021), in this site's own colours,
  type and shape. Brand, one line, round Instagram and TikTok icon links and the join button on the
  left; Books, Explore and Help columns on the right; copyright and legal links under a rule.
- Not installed: React, Tailwind, shadcn and react-icons. The site is generated static HTML.
- Lighthouse on the built Contact page: 100 / 100 / 100.

## 2026-10-01, Airbnb-guideline rebrand (localhost only)

- Site rebranded from the Airbnb design guideline (ADR-020), replacing Azure Noir: white canvas, ink
  text, soft-grey bands, one coral accent, 8px buttons, 14px cards, light footer. No dark sections.
- Inter now sets all headings. Fraunces is kept only for the book covers.
- Book cards, covers, layouts and copy are unchanged. Phone hero cover fan tightened to fit 390px.
- Coral text and buttons use #E00B41, not the brand #FF385C, so contrast passes WCAG AA.
- Lighthouse on the built Home page: 100 / 100 / 100.

## 2026-10-01, Azure Noir rebrand (localhost only, replaced the same day)

- Palette replaced with the 21st.dev "Azure Noir" theme (ADR-019): navy dark sections, white and
  zinc light sections, electric-blue accent, 10px radius on buttons, chips and the menu button.
- Book cards, book covers, layouts, copy and Fraunces headings are unchanged.
- Two colours moved off the theme to pass WCAG AA (muted text on light, accent on dark).
- Lighthouse on the built Home page: 100 / 100 / 100. `/play/` keeps its gold-on-slate look.

## 2026-10-01, polish pass (localhost only)

- Books page is one grid of ten, five across and two rows, with group chips that dim the other
  groups. Home "Featured books" and each book page's "More books" show five, so no row has a gap.
  On a phone a row of five shows four, two by two.
- Cards share their rows through subgrid. Checked on the Books page: all ten share the same title,
  hook and link tops per row.
- Type scaled down: h1 now tops out at 52px, section headings at 34px, body 16px.
- Footer wordmark, quote band and book heading reduced to match.

## 2026-10-01, bookstore built locally (not deployed)

- Bookstore release built and checked on localhost only. Nothing is pushed or deployed, and
  the owner has said nothing is deployed until they authorise it.
- 23 generated pages plus Pier Run and a 404: Home, Books, ten book pages, About, Contact, Join
  the list, Thank you, Events, Reviews, and the Privacy, Cookies, Terms and Delivery and refunds
  drafts. `scripts/build-pages.ts` writes them from `src/data/books.ts` and `src/content/`, and
  writes `public/sitemap.xml` (20 URLs, with Events, Reviews, Thank you and 404 left out).
- The welcome page and Pier Run moved to `/play/`. `index.html` is now the generated Home page.
- New bookstore look (Rausch on white, ADR-018 to ADR-020; Inter, with Fraunces on the covers). The gold-on-slate look
  stays on `/play/`.
- Buy buttons follow the book data file: Amazon only with a link, and the ebook button only for an
  ebook that is not in KDP Select. One unit test covers the rules. No prices anywhere.
- Mailing list form, consent banner and statistics are placeholders. They collect and load nothing.
- Decision records ADR-011 to ADR-016 and the product, design, data and privacy documents were
  updated to match.
- `package.json` gained `pages`, `predev`, `prebuild` and `test`; `vite.config.ts` builds every
  page as an entry; `tsconfig.json` allows `.ts` import extensions. Version 0.2.0.

## 2026-09-05, deployed

- First deploy to `harni.uk`, 34 files by rsync into `~/harni.uk/`. No deletions;
  the origin-lock `.htaccess`, `cgi-bin/` and `.well-known/` were left alone.
- Verified live: `harni.uk` and `www.harni.uk` return 200 through Cloudflare,
  direct-to-origin returns 403, fonts load, the game runs, console is clean.
- Cloudflare's Email Obfuscation was mangling the contact links on the live site.
  Wrapped them in `email_off` comments and redeployed.
- Two Cloudflare behaviours worth knowing, neither a fault: it prepends its Content
  Signals block to `robots.txt` (our rules survive at the end), and it injects a
  script into the HTML, so bytes on the wire will not match bytes on disk.

## 2026-09-05, later

- Cut the "what's coming" section. The page is now hero, game, footer, and the hero
  says what the site is for rather than listing what it will hold.
- Dropped the portrait crop from `scripts/build-media.sh`, since nothing displays it
  any more. `public/media` went from 22 files to 13.
- Made the obstacles readable. They were drawn in near-black against a dark scene:
  benches now have a lit body with a gold rim light, gulls are white with a dark
  outline, and both they and the runner cast a contact shadow on the deck.

## 2026-09-05

First build. Nothing has been deployed.

- GEE OS website scaffold, project documents filled in with what is actually known.
- Vite and TypeScript, no framework. Dev and preview pinned to port 5152 with
  `strictPort`; registry block 15 claimed in `~/.claude/CLAUDE.md` and a row added to
  `~/.claude/bin/dev-all`.
- Welcome page: hero built from the supplied photograph, "what's coming" list,
  mailto contact.
- Pier Run, a canvas endless runner with a fixed 120 Hz simulation, coyote time,
  jump buffering, variable jump height, keyboard and touch input, pause, and a best
  score in `localStorage`. Jump the benches, duck the gulls, collect the lights.
- `scripts/build-media.sh` derives 22 responsive AVIF/WebP/JPEG files from
  `docs/IMG_3620.jpeg`.
- The source photograph was swapped from a hotel lobby to the seafront part-way
  through. The palette, the copy and the game's setting were re-themed to match; the
  game's physics were not touched.
- Fraunces and Inter self-hosted through Fontsource. No third-party requests.

## 7 October 2026: local server binding

Explicitly bound Vite development and preview to 127.0.0.1, preserving strict port 5152 and PHP proxy 5153. Workspace launcher added. TypeScript PASS; build FAIL due to missing Linux Rollup native dependency. HTTP verification BLOCKED by session socket permissions. Full evidence in workspace LOCAL-SERVERS.md.

## 7 October 2026: Linux restoration verified

Codex: clean npm install from unchanged lockfile PASS; typecheck/build, 44 site tests, 27 PHP tests and captured HTTP mail integration PASS. Workspace-local Ubuntu PHP 8.3 CLI restored without sudo; launcher forces real mail off. Local HTTP and explicit private-IP LAN HTTP/browser/WebSocket checks PASS. Second physical device and real email NOT TESTED. Optional media regeneration still needs macOS sips/cwebp/avifenc and is not required to run the site. Shared startup/restoration instructions: ../LOCAL-SERVERS.md. Earlier sandbox/network blockers are superseded by this verification. Prior work preserved; no deployment or commit.

## 7 October 2026, Codex fix follow-up

Fresh local website checks PASS and release reports populated; Mac, owner and live delivery gates remain open.
