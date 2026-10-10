# Project Context

## Problem and outcome

- Problem: `harni.uk` resolves, is on TLS, and is origin-locked, but the docroot is
  empty, so the domain currently serves the cPanel default page.
- People affected: anyone the owner sends the address to before the real site exists.
- Situation in which it occurs: the full personal site is still being built; the
  domain is already in circulation.
- Measurable desired outcome: a single welcome page that loads fast, reads as
  deliberate rather than as a placeholder, and gives a visitor a reason to stay for
  more than three seconds.
- Why now: the domain and TLS work was completed on 2026-08-28. Content is the only
  thing missing.

## Boundaries

- First release: one page. Hero, the Pier Run mini game, a mailto contact. No CMS,
  no backend, no analytics. The "what's coming" list was cut on 2026-09-05: the
  owner wanted a plain welcome, not a roadmap.
- Explicit exclusions: authentication, forms, database, service worker, PWA install,
  cookie banner. None of them have a use yet.
- Constraints: the cPanel host has no Node, so the build runs locally and ships a
  static `dist/`. Deploys go through `~/.claude/bin/cpanel-deploy` over rsync.
- Existing assets to preserve: `docs/IMG_3620.jpeg` is the supplied source
  photograph: a figure in a pale coat on the seafront at dusk, photographing the
  low sun over the ruined West Pier at Brighton. Every image in `public/media/` is
  derived from it by `scripts/build-media.sh`. It replaced an earlier hotel-lobby
  photograph mid-build, and the palette and the mini game were re-themed to match.

## Fact register

| Statement | Status | Evidence or owner | Next check |
|---|---|---|---|
| `harni.uk` is a personal brand site, not a hospitality business | FACT | Owner, 2026-09-05 | — |
| Docroot `~/harni.uk/` is empty apart from `cgi-bin/`, `.well-known/` and the origin-lock `.htaccess` | FACT | `~/.claude/CLAUDE.md` §2, 2026-08-28 | Re-check before first deploy |
| The figure in the photograph is the site owner | ASSUMPTION | Owner supplied the image as the brand image; the figure is in silhouette | Confirm before writing any biography copy |
| `hello@harni.uk` is a live mailbox | ASSUMPTION | Address used in the page; not tested | Send a test message before launch |
| Visible copy is placeholder voice, not final | FACT | Written for this scaffold | Owner replaces before launch |
| Port 5152 is allocated to this project | DECISION | `~/.claude/CLAUDE.md` § Dev-server ports, block 15 | — |
| The owner is Harni Muharami, an NHS nurse and clinical educator in London | FACT | Owner bio, 2026-10-01 | None |
| The bookstore contact address is `info@harni.uk`; the live page uses `hello@harni.uk` | ASSUMPTION | Owner message, 2026-10-01 | Confirm which mailbox receives mail |
| Instagram `@lulu_harni` and TikTok `@harni_m` are live and public | ASSUMPTION | Owner messages, 2026-10-01 | Confirm both |
| Print is made and shipped by Amazon KDP. Each book is sold in one channel, Amazon. All 13 books are live on Amazon.co.uk as Kindle and paperback | FACT | ADR-012, ADR-023; Amazon listings read 2026-10-01 | Re-check at deploy |
| The launch ten titles of ADR-015 are superseded. The catalogue is the 13 books on the owner's Amazon author page, listed in `docs/01-product/CATALOGUE.md` | FACT | ADR-023; Amazon author page and 13 listings read 2026-10-01 | Re-read Amazon before any deploy |
| KDP Select blocks selling an enrolled ebook on other sites | ASSUMPTION | Third-party sources only, so PARTIAL | Read KDP's own Select terms. The practical effect is settled for now: all 13 books show Kindle Unlimited, so harni.uk sells no ebook (BR-002) |
| Legal pages are AI-drafted and the owner reads them before launch | DECISION | Owner message, 2026-10-01 | Professional review advised before direct ebook sales |
| Amazon author page: https://www.amazon.co.uk/stores/author/B0G27S5PSV | FACT | Owner supplied it, 2026-10-01 | None |
| All 13 books show Kindle Unlimited, so are enrolled in KDP Select, so no ebook is sold on harni.uk | FACT | Amazon listings read 2026-10-01; ADR-023 | Re-check if the owner leaves KDP Select |
| The books were published between 11 Dec 2025 and 5 Feb 2026. One Amazon review exists (5.0, The Honest Truth About Nurses). The site shows no reviews | FACT | Amazon listings read 2026-10-01 | Re-read before any deploy |
| The audience is NHS nurses and healthcare professionals. Eleven of the 13 books are NHS nursing and healthcare titles. Two are life titles | FACT | Amazon listings, ADR-023 | None |
| The covers are the owner's real covers, saved from Amazon at 400 and 800 px wide and self-hosted in `public/images/books/` | FACT | `public/images/books/`, ADR-023 | Owner to confirm she is happy to use them |
| The author photo is her Amazon author-page profile image, in `public/images/author/harni-600.jpg`. It is a casual photo in front of a framed portrait drawing. She chose to use it | FACT | Owner choice, 2026-10-01 | Recommend a more formal photo later |
| The Amazon bio says she "contributes to high-quality, evidence-based patient care". The owner published it, so the phrase is usable | FACT | Amazon author page, 2026-10-01 | None |
| harni.uk is a shop window: it takes no orders or payments, and every purchase happens on Amazon | DECISION | ADR-023 | None |
| Dev server: `http://127.0.0.1:5152` (`vite.config.ts`). The older `dev-all` port 5202 is retired | FACT | Verified 2026-10-08 | None |

## Bookstore release (built on localhost, not deployed)

- Supersedes the first-release boundary above for the bookstore release. See ADR-011 to ADR-016 and ADR-023 (2026-10-01, real catalogue).
- Scope: Home, Books, 13 book pages (the real catalogue, ADR-023), About, Contact, Join the list, Thank you, Events, Reviews, Pier Run, Privacy, Cookies, Terms, Delivery and refunds.
- Allowed by ADR-011: a mailing list form, a statistics tool after consent, a cookie consent banner, hosted checkout links, social links. Checkout links are not used: every book is in KDP Select, so the site links to Amazon only (ADR-023). The other items are placeholders in the localhost preview.
- Still excluded: authentication, database, service worker, PWA install, basket, accounts, prices on the site.
- Hosting is unchanged: cPanel behind Cloudflare, build locally and ship `dist/` with `cpanel-deploy`. Choosing other hosts and payment companies is not decided.
- Built on localhost only. Nothing is pushed or deployed. The owner checks the preview first, and deploy is NOT authorised.
