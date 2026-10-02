# Data Model

Status: built on localhost, not deployed. See ADR-011 to ADR-016 and ADR-023 (2026-10-01, which changed the Book entity).

| Entity | Purpose | Owner | Sensitive fields | Retention | Deletion | Relationships |
|---|---|---|---|---|---|---|
| Book | One entry per book in `src/data/books.ts`, 13 in all. Fields: `slug`; `title` and `subtitle` (tidied for the site); `kdpTitle` (the exact Amazon title, typos included); `hook` (one line for cards); `group` (`safe`, `career`, `wellbeing` or `life`); `status` (`coming-soon` or `live`); `inKdpSelect` and `kindleUnlimited` (booleans); `amazonUrl?` (the Kindle listing); `paperbackUrl?`; `ebookCheckoutUrl?` (optional, used only if not in KDP Select); `published` (ISO date); `pages`; `cover` (file stem for `public/images/books/<stem>-400.jpg` and `-800.jpg`); `blurb` (string array, the owner's Amazon description lightly edited for punctuation); `whoFor`. `getBuyOptions(book)` returns `{amazon, paperback, ebook}`, each a URL or null. `amazonAuthorUrl` is exported. The old `excerpt?` and `coverImage?` fields and the `theme` field of ADR-018 are gone | Owner | None | Kept in the repository | Remove the entry | Drives Books, Home and each book page |
| Group | Four topic groups in `src/data/books.ts`: Safe practice (5 books), Career and voice (2), Wellbeing for nurses (4), Everyday life (2). Fields: `key`, `number`, `name`, `blurb`. They sort titles and add no claims | Owner | None | Kept in the repository | Remove the entry | Books chips, Home reader paths, book-page related list |
| Event | Optional list for the Events page. Fields: `date` (`YYYY-MM-DD`), `place`, `link?` | Owner | None | Until the event has passed | Remove the entry | Events page |
| ReviewQuote | Optional real reader quote, used with permission. Fields: `name or initials`, `bookSlug`, `quote` | Owner | Reader name: needs permission | Until withdrawn | Remove on request | Reviews page |
| Subscription request | Email, consent wording/version, time, reference and sign-up consent | Owner subscription mailbox | Email address | Until withdrawal with necessary consent/suppression evidence; operating policy pending | Email `subscribe@harni.uk` | Form consent, owner notification and simple welcome email |
| ConsentChoice | The visitor's cookie choice | The visitor's browser | None | UNKNOWN: storage method and lifetime | Visitor changes or clears it | Cookie banner |
| PierRunBest | Optional personal best, key `harni.pier-run.best` | Visitor browser; never sent to server | None | Until cleared; accessed only after opt-in each visit | Untick saving, delete button or browser settings | Pier Run page |

Document constraints, indexes, audit history, migration path, fixtures, backup and recovery. Every row-level access rule must trace to a role or business rule.
