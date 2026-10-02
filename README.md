# harni

Author site and bookstore for `harni.uk`: Harni Muharami, an NHS nurse, clinical educator
and author. A shop window for her 13 practical books for NHS nurses and healthcare professionals
(all on Amazon.co.uk), plus Pier Run, a small canvas game kept on its own page. Built with Vite and TypeScript, no framework.

## Current state

- Lifecycle: the bookstore release is built and checked on localhost. **It is not deployed.**
  The owner checks the preview first, and nothing is pushed or deployed until the owner says so
  (ADR-016).
- Live today: `https://harni.uk/` still serves the first welcome page, deployed on 2026-09-05
  (see `CHANGELOG.md`). The bookstore replaces it only after an approved deploy.
- Catalogue: the real 13 books from the owner's Amazon author page, read on 2026-10-01 (ADR-023).
  harni.uk takes no orders or payments. Every book links to Amazon, and no ebook is sold here
  because all 13 are in KDP Select.
- Dev port: **5152** (registry block 15, `~/.claude/CLAUDE.md` § Dev-server ports). Pinned with
  `strictPort` on both `server` and `preview`. The owner's `dev-all` tool serves the site at
  `http://localhost:5202`.
- Added 2026-10-01 (ADR-025, localhost only): a PHP mail endpoint (`public/api/message.php`, off until the host sets `HARNI_MAIL_ENABLED=1`, see `docs/07-operations/EMAIL.md`) that sends detailed copies to the owner and to every sender; a richer About page; data-driven Events and Reviews (`src/data/events.ts`, `src/data/reviews.ts`, both empty until confirmed); rewritten legal pages (Version 2026-10-01, not legal advice); and a rebuilt bright Pier Run. Extra checks: `npm run test:mail`, `python3 tests/integration/mail-http.py`.
- Placeholders: the statistics tool is still a placeholder, and no checkout is needed. Content the owner has not supplied shows as a visible `[NEEDS: ...]` or
  `[CHECK: ...]` box. `npm run pages -- --list` counts them per page.

## Commands

```bash
npm install
npm run pages        # write every generated page and public/sitemap.xml
npm run dev          # pages first, then http://localhost:5152
npm test             # book data and buy-button rules (BR-001, BR-002), no extra dependency
npm run typecheck    # tsc --noEmit
npm run build        # pages, typecheck, then dist/
npm run preview      # serve dist/ on 5152
npm run media        # regenerate public/media from docs/IMG_3620.jpeg
```

`npm run pages` runs a `.ts` file directly in Node (version 22.6 or later). `npm run media`
needs `sips` (macOS), plus `cwebp` and `avifenc` (`brew install webp libavif`). The generated
images are committed, so it only has to run when the source photograph changes.

## Layout

```
src/data/books.ts       the 13 books, four groups, Amazon links and the buy-button rules
public/images/books/    the owner's real covers at 400 and 800 px (self-hosted)
public/images/author/   the author photo
src/content/            page words (pages.ts, legal.ts), layout, site facts, route list
scripts/build-pages.ts  writes every generated page and public/sitemap.xml
src/site.ts             client script: phone menu, consent banner, placeholder forms
src/styles/site.css     bookstore styles (Rausch on white, ADR-020)
play/index.html         Pier Run page, hand-written, with src/main.ts and the older styles
src/game/ src/lib/      Pier Run and its reveal and parallax helpers
tests/unit/             node:test tests
index.html, books/ ...  GENERATED pages. Do not edit by hand: edit src/content, then npm run pages
public/                 favicon, robots.txt, sitemap.xml (generated), media/, images/
docs/                   GEE OS project documents
```

## Adding or changing a book

Edit its entry in `src/data/books.ts` (fields are in `docs/02-architecture/DATA-MODEL.md`).
To add a book: give it a `slug`, `title`, `subtitle`, `kdpTitle`, `group`, `published`, `pages`,
`blurb` and `whoFor`, set `status: 'live'`, add `amazonUrl` and `paperbackUrl`, and save its cover
as `public/images/books/<stem>-400.jpg` and `-800.jpg`. Then run `npm run pages` and `npm test`.
The page shows "Buy on Amazon" only with an `amazonUrl`, "Get the paperback" only with a
`paperbackUrl`, and "Buy ebook here" only with a checkout link on an ebook that is not in KDP
Select (none today). No prices appear on the site.

## Pier Run

Fixed 120 Hz simulation with a render pass at display rate, so physics does not change with
frame rate. Controls: <kbd>Space</kbd>, <kbd>↑</kbd> or <kbd>W</kbd> to jump (hold for height),
<kbd>↓</kbd> or <kbd>S</kbd> to duck, <kbd>P</kbd> or <kbd>Esc</kbd> to pause. On touch: tap to
jump, swipe down to duck. The rebuilt game (ADR-025) keeps the best score in `localStorage` under
`harni.pier-run.best` only if the player ticks "Remember my best score on this device". Every access is
guarded, so a browser that blocks site data still plays.

## Copy and legal pages

The words come from the owner's approved copy and bio. Nothing about the author is invented. The
Privacy, Cookies, Terms and Delivery and refunds pages are AI drafts that the owner reads before
launch, ideally with a professional.

## Deploying

**Not authorised.** Do not deploy or push until the owner says so. When the owner does, the build
has to run locally because the cPanel host has no Node:

```bash
npm run build
cpanel-deploy dist harni.uk            # dry run, shows every change
cpanel-deploy dist harni.uk --go       # writes
```

Read `~/.claude/CLAUDE.md` §2 and `docs/07-operations/DEPLOYMENT.md` first. The docroot is
origin-locked by a `.htaccess` the repo does not own, and `cpanel-deploy` excludes `.htaccess`
by default. Leave it that way.
