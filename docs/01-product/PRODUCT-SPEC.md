# Product Specification

## Product promise

A visitor who has been given the address `harni.uk` before the site exists lands on
a finished-looking welcome page, understands what the site is for, has a way to make
contact, and has something to do while they are there.

## First-release proof

- User outcome to prove: the page loads, reads clearly on a phone and on a desktop,
  and the mini game is playable with a keyboard and with touch.
- Evidence that counts: viewport screenshots at 390x844 and 1440x900, a clean
  console, a completed run with a recorded score, and measured text contrast.
- Failure threshold: any console error, any text below 4.5:1 contrast, or a game
  that cannot be started or restarted.

## Scope

- Must have: hero, Pier Run, mailto contact, responsive layout,
  `prefers-reduced-motion` support, keyboard operation.
- Should have: responsive image set in AVIF/WebP/JPEG, local fonts (no third-party
  requests), Open Graph tags, best score kept in `localStorage`.
- Later: thoughts and views, which is what the site is for. A contact form. Whatever
  structure those need.
- Will not build now: CMS, backend, analytics, service worker, install prompt. For the bookstore release (below), analytics after consent and forms are allowed by ADR-011.

## Functional requirements

| ID | User outcome | Acceptance evidence | Priority | Status |
|---|---|---|---|---|
| FR-001 | Visitor sees a hero that names the site and says what it is for | Screenshot at 390x844 and 1440x900 | Must | Done |
| FR-002 | Visitor can reach the owner | `mailto:hello@harni.uk` present in header, hero and footer | Must | Done |
| FR-003 | Visitor can start, pause, lose and restart Pier Run | Observed in browser: start, `P` pause, `P` resume, crash, restart | Must | Done |
| FR-004 | The run keeps a personal best between visits | `localStorage` key `harni.pier-run.best` read back after reload | Should | Done |
| FR-005 | The game is playable on touch | Tap to jump, swipe down to duck; hint text swaps on `hover: none` | Must | Partial — code path written, not tested on a real device |
| FR-006 | Motion is suppressed for visitors who ask for it | Verified with `prefers-reduced-motion: reduce` emulated: 0 armed reveals, 14 shown immediately, hero transform unset, scenery drift frozen, game still playable | Must | Done |

## Non-functional requirements

- Accessibility: skip link, one `h1`, visible focus rings, `role="status"` for run
  results, all body text at or above 4.5:1. Measured: 8.05:1 to 10.25:1.
- Performance: no third-party requests at runtime. Fonts and images are served from
  the same origin. Hero image is preloaded with a matching `imagesrcset`.
- Browser support: build targets ES2022 and CSS for Safari 16. `color-mix`,
  `text-wrap` and `roundRect` are all used and all require a 2023-or-later browser;
  older browsers degrade to unmixed colours and plain wrapping rather than breaking.
- Privacy: nothing is collected. The only stored value is the local best score.
- Availability and recovery: static files. Recovery is a redeploy from `dist/`.

## Bookstore release (built on localhost, not deployed)

Supersedes the first-release scope above for the bookstore release. See ADR-011 to ADR-016 and ADR-023 (2026-10-01, the real 13-book catalogue and the shop-window model). The welcome-page requirements FR-001 to FR-006 stay as they are; the Pier Run game moves to its own page.

### Product promise

A reader lands on harni.uk, sees who Harni Muharami is and which 13 practical books for NHS nurses and healthcare professionals she has written, and can open any of them on Amazon (Kindle or paperback), or join the mailing list. harni.uk is a shop window: it takes no orders or payments, and sells no ebook (all 13 are in KDP Select).

### First-release proof

- User outcome to prove: from Home, a visitor reaches a book page in one click and sees the Amazon buttons for that book.
- Evidence that counts: screenshots of every page at 390x844 and 1440x900, a clean console, a keyboard walk, a `prefers-reduced-motion` check, measured text contrast of 4.5:1 or more, and a data-file test showing the buttons follow `amazonUrl`, `paperbackUrl`, `ebookCheckoutUrl` and `inKdpSelect`.
- Failure threshold: any console error, any text below 4.5:1, a "Buy ebook here" button on a book flagged `inKdpSelect`, or a price shown anywhere.

### Scope

- Must have: Home, Books, 13 book pages, About, Contact, Join the list, Thank you, Privacy, Cookies, Terms, Delivery and refunds; per-book "Buy on Amazon" and "Get the paperback" buttons; mailing list sign-up with consent; contact and social links; per-page titles and descriptions; updated sitemap.
- Should have: Events, Reviews and Pier Run pages; "About the author" box on every book page; the owner's real covers, self-hosted.
- Placeholders in the preview: mailing list and statistics. No checkout is needed while every book is in KDP Select. Nothing real is wired until the owner chooses the services.
- Will not build: basket, accounts, database, service worker, PWA install, reviews system, prices on the site, direct print sales, direct ebook sales while the books are in KDP Select, the other planned titles from the old 109-title list.

### Functional requirements (built on localhost, owner review pending)

| ID | User outcome | Acceptance evidence | Priority | Status |
|---|---|---|---|---|
| FR-007 | Visitor sees all 13 books and opens one | Books page shows chips for four groups, one "Most popular" feature row and 12 books in three rows of four; each links to its page. A data test checks 13 live books | Must | Built, Books screenshots and unit test PASS; other book pages NOT TESTED |
| FR-008 | Visitor sees the right buttons for a book | Data-file test: "Buy on Amazon" only with `amazonUrl`; "Get the paperback" only with `paperbackUrl`; "Buy ebook here" only with `ebookCheckoutUrl` and `inKdpSelect` false (none today); "Coming soon" otherwise. Both Amazon buttons open a new tab | Must | Built, unit tests PASS |
| FR-009 | Visitor joins the mailing list with consent | Form shows an unticked consent box and a Thank you page; double opt-in confirmed in the preview as a placeholder | Must | Built on localhost, NOT TESTED after ADR-023 |
| FR-010 | Visitor can reach the owner and follow her | Contact shows `info@harni.uk`, Instagram `@lulu_harni` and TikTok `@harni_m`; mailto links wrapped in `email_off` | Must | Built on localhost, NOT TESTED after ADR-023 |
| FR-011 | Visitor can read the legal pages from the footer | Privacy, Cookies, Terms and Delivery and refunds exist and are marked as drafts | Must | Built on localhost, NOT TESTED after ADR-023 |
| FR-012 | Every page has its own title and description | View source on each built page | Should | Built on localhost, NOT TESTED after ADR-023 |
| FR-013 | Statistics load only after the visitor accepts | Reject and no-choice paths load nothing; Accept and Reject equally prominent | Must | Built on localhost, NOT TESTED after ADR-023 |
| FR-014 | Empty pages stay out of search | Events, Reviews and Thank you carry `noindex` and are absent from `sitemap.xml` | Should | Built on localhost, NOT TESTED after ADR-023 |
| FR-015 | Pier Run still works on its own page | Controls: Space, Up or W jump; Down or S duck; P or Escape pause; tap and swipe down on touch | Should | Built on localhost, NOT TESTED after ADR-023 |
| FR-016 | Visitor sees who the author is | About page and the book-page box use only the owner's supplied facts | Must | Built on localhost, NOT TESTED after ADR-023 |

### Non-functional additions

- Third-party requests only where ADR-011 allows, and anything that sets cookies loads only after consent. Book covers and the author photo are self-hosted, not hotlinked from Amazon.
- Reading time: each page is capped to read in under two minutes on a phone (word caps in `docs/03-design/UX-SPEC.md`).
- Privacy: a mailing list email is held by an outside service; see `docs/05-security/DATA-PRIVACY.md`.
- Accessibility: WCAG 2.2 AA is the target (ASSUMPTION); see `docs/03-design/ACCESSIBILITY.md`.
