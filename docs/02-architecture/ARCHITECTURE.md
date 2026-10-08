> Layout cleanup, 7 October 2026: generated route HTML belongs in ignored `.generated/pages/`, which is Vite's HTML root. Canonical source stays in `src/`, public assets/PHP in `public/`, and deployable output in `dist/`. There are no generated route folders at the project root. All 27 public routes remain unchanged. See README.md for the current layout.

> Current candidate, 7 October 2026 (ADR-026): all 27 routes are rendered and hydrated with React. Tailwind theme/utilities supplement the existing CSS without Preflight. Repository-owned content is parsed at build time into a typed tree, rendered by React, and carried as inert script-safe JSON for matching client hydration. Feature modules own navigation, consent, filters and forms; game/globe/reveal modules have effect cleanup. The PHP contract and public words are retained. Sharp replaces macOS-only media tooling. See README.md and ../reports/harni/qa/reports/REACT-REBUILD-2026-10-07.md. The earlier architecture below is historical where it specifies no framework or the retired client entry.

# Architecture

Status: built on localhost, not deployed. See ADR-011 to ADR-016 ADR-023 (real catalogue and shop-window model), ADR-024 and ADR-025 (2026-10-01, PHP mail endpoint, data-driven Events and Reviews, Pier Run modules).

## Context and constraints

- Expected users and traffic: UNKNOWN. ASSUMPTION: low traffic, readers on phones.
- Environments: localhost for the preview (`vite.config.ts` pins 5152; the owner's `dev-all` tool serves it at 5202, see KNOWN-ISSUES); the existing cPanel host behind Cloudflare for any later deploy.
- Availability: static files. Recovery is a redeploy from `dist/`.
- Privacy: enquiries and sign-ups sit in the two mailboxes, and the visitor receives a copy of each. There is no confirmation step. Statistics load only after consent. See `docs/05-security/DATA-PRIVACY.md`.
- Cost: ASSUMPTION up to 10 pounds a month. There are no per-sale fees on harni.uk because it takes no payments (ADR-023).
- Deployment: build locally and ship with `cpanel-deploy`. Nothing is deployed until the owner says (ADR-016).

## Decision

- Architecture: a static multi-page site built with Vite and TypeScript from one book data file (`src/data/books.ts`, 13 books). Built on localhost. harni.uk is a shop window: it takes no orders or payments and sells no ebook, because all 13 books are in KDP Select.
- Trust boundaries: the browser talks to the static host, and by links, embeds or consent-gated scripts to outside services (Amazon, mailing list, statistics). No checkout provider is needed while every book is in KDP Select. Book covers and the author photo are self-hosted, so there are no Amazon image requests.
- Client responsibilities: render pages; apply the per-book button rules (BR-001, BR-002, BR-011); show the consent banner; load the statistics tool only after consent.
- Server responsibilities: serve static pages and execute the PHP mail endpoint at `/api/message.php`. No accounts or message database. A private file stores keyed rate-limit counters. Mail transport is disabled until verified; see ADR-024 and `docs/07-operations/EMAIL.md`.
- Alternatives considered: keep the single welcome page; add a framework such as React or Astro later if the site outgrows plain pages.
- Consequences and risks: Vite needs multiple HTML inputs (`build.rollupOptions.input`) and a build-time step that generates a page per book from the data file; the old rules forbidding forms and third-party scripts are superseded by ADR-011; consent code adds complexity and needs tests.

## Runtime map

| Component | Responsibility | Data handled | Dependency | Failure behaviour | Owner |
|---|---|---|---|---|---|
| Static pages (Vite build) | Serve Home, Books, About, Contact, legal and other pages | None | Vite 7, TypeScript 5.9 | Redeploy from `dist/` | Owner |
| Book data file `src/data/books.ts` | Holds every book and its channel switches | Book fields (see `DATA-MODEL.md`) | None | Build fails on a type error | Owner |
| Page generator (build time, `scripts/build-pages.ts`) | Makes one page per book from the data file | Book fields | Vite config | Build fails | Owner |
| Consent banner (client, new) | Records the visitor's choice and gates the statistics tool | Cookie choice | Browser storage (method UNKNOWN) | No tool loads | Owner |
| Mail forms and PHP endpoint `public/api/message.php` | Contact to `info@harni.uk` and sign-up to `subscribe@harni.uk` (recipients fixed server side). Sends the owner notification and a detailed multipart copy (plain text and HTML, escaped, base64) to the visitor. Subscriber copy carries `List-Unsubscribe`. Rate limits use keyed hashes in a private state directory. Off unless `HARNI_MAIL_ENABLED=1` plus `HARNI_MAIL_STATE_DIR` and `HARNI_MAIL_RATE_KEY` are set | Name, email, subject, message, acknowledgement or consent wording and version, reference, UTC time | PHP 8.1+ and the host mail transport, both unverified. Tests: `tests/unit/mail.test.php`, `tests/integration/mail-http.py` | Honest error, input kept, direct email links; if only the copy fails the visitor keeps the reference | Owner |
| Events data `src/data/events.ts` | `EventItem` type, `upcomingEvents`, `pastEvents`, `formatEventDate`. The list is EMPTY because no event is confirmed. Read at build time by the page generator | Event fields | None | Empty state shown | Owner |
| Reviews data `src/data/reviews.ts` | `ReviewQuote` type (with `permissionDate` and `permissionRecord`), `amazonReviewsUrl` and `amazonWriteReviewUrl` helpers. The list is EMPTY because no written permission exists | Quote fields, ASIN | None | Empty state, Amazon links still shown | Owner |
| Legal and About content `src/content/legal.ts`, `src/content/pages.ts` | Page words for the four legal pages (Version 2026-10-01) and the rebuilt About page with Person JSON-LD. Styles in `src/styles/site.css` | None | None | Build fails on a type error | Owner |
| Hosted checkout link (external) | Not used. Would sell an ebook on harni.uk, which BR-002 blocks while a book is in KDP Select (all 13 are) | None | None | Not applicable | Owner |
| Amazon links (external) | Send readers to a book's Kindle page ("Buy on Amazon") and paperback page ("Get the paperback"), each in a new tab | None | Amazon | Button hidden | Owner |
| Self-hosted images | Real covers at 400 and 800 px in `public/images/books/` and the author photo in `public/images/author/harni-600.jpg`; the CSS draws a spine and sheen over each cover | None | None | Broken image if a file is missing; the unit test checks both cover files exist | Owner |
| Statistics tool (external, after consent) | Counts visits | Page views | Tool UNKNOWN | Not loaded | Owner |
| Pier Run game (`src/game/`, rebuilt 2026-10-01) | Bright seaside runner on `/play/`. Modules: `audio`, `collision`, `consent`, `difficulty`, `effects`, `entities`, `hud`, `palette`, `physics`, `rng`, `scene`, `scoring`, `spawner`, `sprites`, `zones`, with `config`, `input`, `render`, `storage`, `types`, `world` and `index`. Styles in `src/styles/game.css`. Report: `../reports/harni/qa/PIER-RUN-REBUILD-2026-10-01.md` | Best score in `localStorage` key `harni.pier-run.best`, only if the player opts in. Nothing in sessionStorage or cookies | None. No third-party requests. Play JS 16.3 kB gzip | Page still loads; blocked storage is tolerated | Owner |
