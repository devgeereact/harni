# UX Specification

Status: built on localhost, not deployed. See ADR-011 to ADR-016 ADR-023 (real catalogue) and ADR-025 (2026-10-01). The About, Join, Events, Reviews, Pier Run and legal rows were updated for ADR-025.

Every page has one job and one next action. Word caps are for a phone read of under two minutes and exclude the header and footer. Copy for each page is in the project plan and is replaced here by the final words once approved.

| Screen or flow | Purpose | Primary action | Secondary action | Required states | Mobile decision | Desktop decision |
|---|---|---|---|---|---|---|
| Home (250 words) | Say who Harni is and point to the books. H1: "Practical, evidence-based guides for NHS nurses and healthcare professionals." Sections: hero with a 3-cover fan, credentials strip, four reader paths, four featured books, About with photo, join card | Open Books | Join the list | Loading, success | One column, 16px gutters | Wider layout, text capped near 65 characters |
| Books (200 words) | Show all 13 books: four group chips that dim the others, one large "Most popular" feature row, then 12 books in three full rows of four | Open a book | Join the list | Empty not applicable; "Coming soon" tag only if a book is not live | Two columns of cards, no horizontal overflow at 390px | Four columns from 48rem; cards share row heights (CSS subgrid) |
| Book page, used 13 times (250 words each) | Explain one book and send the reader to Amazon | Buy on Amazon (Kindle page) | Get the paperback | "Coming soon", live. "Buy ebook here" is not shown for any book while all are in KDP Select | Buttons full width, 48px high | Buttons side by side |
| About | Rich author profile built only from the owner's Amazon bio and listings (see "About page sections" below). Nothing invented, no dates for the career path | Explore books | Contact Harni, jump links | Verified biography and author photo; no invented quote or credentials | Single column; timeline and chips stack | Two-column facts and writing groups; timeline in rows |
| Contact (120 words) | Give clear ways to reach the owner | Send a message (opens the visitor's email app) or email `info@harni.uk` | Follow on social | Without JavaScript the form is hidden and the mail link stays; if the email app does not open, the ticket shows the address | One column | Two columns with a globe |
| Join the list (100 words) | Collect an email with explicit consent | Submit the form | Read the privacy notice | Error, success with a reference, unticked consent box. Note above the button: "You'll receive a copy of your sign-up by email, with how to unsubscribe." | Full-width field and button | Centred form |
| Thank you (100 words, noindex) | Confirm the sign-up | Check the inbox and confirm | Home, Books | Success only | One column | One column |
| Events | Show confirmed events, or say honestly there are none | Join the list | Send an enquiry | Upcoming list (data driven, empty today so the empty state with join-the-list shows), past events section, enquiry guidance, "what to include". Indexable, in the sitemap (ADR-025) | One column | One column |
| Reviews | Point readers to real reviews without copying them | Read reviews on Amazon | Write a review | Optional "Kind words" quotes only with written permission (none today), links to read and write a review on each book's Amazon page, cover cards for all 13 books. No copied reviews, no star rating. Indexable, in the sitemap (ADR-025) | Cover cards in two columns | Cover cards in a grid |
| Pier Run (100 words) | Host the Pier Run game | Play a round | See the books, Join the list | Start, playing, paused, game over end card (Play again, See the books). Score saving opt-in, with Delete saved score | Touch: tap to jump (hold for height), swipe down to duck | Keys: Space, Up or W jump (hold for height); Down or S duck; P or Escape pause |
| Privacy (350 words) | Explain what data is used | Email a data request | Back to Books | "In short" box, contents list, version line | One column, short headed sections | Same |
| Cookies (300 words) | Explain the statistics tool and consent | Change the cookie choice | Back to Books | "In short" box, contents list, version line | Same | Same |
| Terms (400 words) | Set the site rules and the advice section | Open Books | None | "In short" box, contents list, version line | Same | Same |
| Delivery and refunds (300 words) | Say that Amazon sells and delivers the books (paperback and Kindle) and handles refunds. harni.uk takes no orders | Email a question | None | "In short" box, contents list, version line | Same | Same |

## Header and footer

- Header: wordmark "Harni Muharami", menu (Home, Books, About, Contact) and a "Join the list" button.
- Footer: Explore (Events, Reviews, Pier Run), Legal (Privacy, Cookies, Terms, Delivery and refunds), Follow (Instagram, TikTok and an Amazon author page icon link), `info@harni.uk`, and the line "NHS nurse, clinical educator and author, based in London. I write in a personal capacity. These are my views, not those of my employer. My books give general guidance, not medical advice." (CHECK employer policy). The footer layout is the one in ADR-021.
- Cookie banner: Accept and Reject, equally prominent, with a link to Cookies. A footer link reopens it.

## Book page sections, top to bottom

1. Band: the real cover, title, subtitle, "by Harni Muharami", tags (Published date, Kindle Unlimited, pages) and two buttons: "Buy on Amazon" (Kindle page) and "Get the paperback". Both open Amazon in a new tab. While a book is "Coming soon": "Join the list".
2. About this book: the owner's Amazon description, lightly edited for punctuation. The "Inside you'll learn" lists stay on Amazon, with a link. Owner to confirm the wording.
3. Who it's for, from the owner's description.
4. Advice note: "This book gives general guidance. It is not medical or legal advice, and it is not NHS guidance."
5. About the author: the short bio and photo, with a "More about Harni" link.
6. More books: four other titles, and a Back to Books link.

No excerpt section and no prices (BR-003).

## About page sections, top to bottom (ADR-025)

1. Intro with jump links to the sections.
2. At-a-glance facts strip.
3. Professional background.
4. "Path so far": five steps, namely non-clinical roles, ward nursing, emergency department, clinical educator, author and researcher. No dates are invented.
5. The writing: the four groups with their books, and four "how I write" principles.
6. Who the books are for: audience chips taken from each book's `whoFor`.
7. Timeline of all 13 books by publication date (13 Nov 2025 to 5 Feb 2026), with covers and page counts.
8. Beyond the work.
9. Seven FAQs.
10. Press bios: one line, short and full.
11. Connect, including the Amazon author page.
12. Personal-capacity note.

The page also carries schema.org Person JSON-LD. Every fact comes from the owner's Amazon bio and listings.

## Legal page layout (ADR-025)

Privacy notice, Cookies and local storage, Website terms and Delivery and refunds share one layout: a title, "Version 2026-10-17, last updated 17 October 2026" (no Draft label), an "In short" summary box, a contents list that jumps to each numbered section, then the sections. Retention, recipients and similar facts sit in tables with captions. The public [NEEDS] boxes were removed at the owner's request on 2 October 2026; the owner facts are tracked in LEGAL-REVIEW.md.

## Pier Run look (ADR-025)

A bright, sunny seaside that is never dark. Four zones: Beach, Pier, Promenade (golden hour) and Fun fair. The nurse-runner is drawn in code. Hazards are benches, bins, crabs, a rolling ball, puddles, low and high gulls and bunting. Pickups are books and rare hearts; power-ups are an ice cream shield, kite glide and tea boost. Three hearts, combo up to x5. Sound is off by default. The end card offers Play again and See the books.

Test comprehension, navigation, form recovery, session expiry and permission denial. Remove decorative complexity that competes with the user's next step.
