# Website presentation rebuild, 2 October 2026

Local implementation only. No deployment or live email.

## Changes

- Replaced the About page structure with a portrait-led introduction, professional background, education, writing focus, three selected books, expandable FAQs and press biography, and a single primary contact action. Removed the previous repeated career pathway, complete catalogue timeline, topic cards, pills and repeated calls to action. The previously removed personal section remains absent.
- Rebuilt all four legal page layouts using full-shell summaries and contents, with balanced heading/body rows on desktop and a single column on mobile. Legal wording and consent version remain unchanged. Outstanding owner facts remain visible.
- Pier Run obstacles have stronger colours, white edge separation, recognisable bench/bin details and concise object/action labels. Decorative furniture is lighter and moved behind the running lane. Collision dimensions and game rules remain unchanged.
- Reduced repeated actions on Home, Books, book detail pages and Events. Added real targets for category deep links.

## Verification

PASS: production build and TypeScript check; 44 site/game tests; 27 PHP mail checks.
PASS: all 27 built HTML pages at 390x900 and 1440x900, 54 browser checks. One H1 each, no horizontal overflow, no missing images after lazy images are requested, no empty links and no JavaScript exceptions.
PASS: internal links, fragment targets and unique IDs across all 27 pages.
PASS: visual inspection of About desktop/mobile, Privacy desktop and all eight game obstacle sprites. Screenshots and browser results are in `qa/review-2026-10-02/`.
PASS: mobile menu, FAQ expansion, category deep link/reset, native empty-contact-form validation, game start/jump/pause/resume. No form data sent.
PASS: git diff whitespace check.

NOT TESTED: physical mobile devices, screen reader, live mail delivery, external destination availability and production infrastructure. Legal owner facts and solicitor review remain open as recorded in docs/05-security/LEGAL-REVIEW.md. This is presentation verification, not legal approval.

The initial browser attempt encountered an occupied port, so its results were discarded. Successful checks used an isolated browser and a dedicated localhost port. Initial off-screen image checks were refined to load lazy images before asserting availability.
