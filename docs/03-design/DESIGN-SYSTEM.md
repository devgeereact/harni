# Design System

Status: rebranded to "Rausch on white" and checked on localhost on 2026-10-01 (ADR-020). Not deployed. The
page layouts, book cards and book covers come from ADR-018; the colours, type and shape replace the Azure Noir
palette of ADR-019. On 2026-10-01 ADR-023 replaced the designed covers with the owner's real covers, the three
themes with four groups, and the launch ten with the real 13 books. The page set and the approved words are
otherwise unchanged. Layout rules below were updated for ADR-023.

## Direction: "Rausch on white"

A warm, quiet marketplace look taken from the Airbnb design guideline (`npx getdesign@latest add airbnb`,
saved as DESIGN.md in a scratch folder, not in this repo): a pure white canvas, near-black ink, one
coral-red accent, soft corners, one shadow tier, modest type weights, and a light footer. The books are the
photography: the owner's real covers (ADR-023) carry the colour. The designed SVG covers of ADR-018 are retired.

What was taken from the guideline: white canvas, ink `#222222`, surface `#F7F7F7` and `#F2F2F2`, hairline
`#DDDDDD`, Rausch coral, 8px buttons, 14px cards and panels, pill chips and tags, the single shadow tier, 80px
header with a hairline, quiet headings (22px to 46px, weights 600 and 700), 64px sections, light footer, no dark
sections.

What was not taken: the Airbnb Cereal font (licensed, not available), so Inter is used as the guideline's own
suggested substitute; the search bar, product tabs and date picker (nothing here needs them); the Luxe and Plus
sub-brand colours.

## Principles

- One primary action per view. Filled coral button, outline for the second action.
- The books lead. Covers are large and tactile. Words stay short.
- Rhythm: white sections and soft-grey sections alternate, divided by hairlines. Nothing is dark.
- Generous but tidy space. 4px base unit, 8px steps. Section padding 40px to 64px.
- Motion explains something: a cover lifts on hover, a button presses, a section fades in once. Nothing loops except one slow float on the home cover.
- Everything works without motion, without JavaScript (except the placeholder form), and on a phone first.

## Colour

Tokens live in `src/styles/site.css`.

| Token | Hex | Used for |
|---|---|---|
| canvas | `#FFFFFF` | Page, header, cards |
| soft | `#F7F7F7` | Alternate sections, bands, credential strip, footer, notes |
| strong | `#F2F2F2` | Icon circles, outline-button hover, portrait placeholder |
| hairline | `#DDDDDD` | 1px dividers and card borders |
| hairline-strong | `#C1C1C1` | Tag and chip borders |
| ink | `#222222` | Headings and primary text, focus ring |
| body | `#3F3F3F` | Running text in long copy |
| muted | `#6A6A6A` | Secondary text, input borders |
| action | `#E00B41` | Buttons, links, text accents (the guideline's pressed coral) |
| action-hover | `#C80A3B` | Button hover |
| rausch | `#FF385C` | Shapes only: list dots, the quote mark, legal bullets |
| error | `#C13515` | Form errors |

Two values differ from the guideline so the site passes WCAG AA. The brand coral `#FF385C` is 3.52:1 on white,
so it never carries text; buttons and text accents use `#E00B41` (4.89:1 with white text). The guideline's
`#DDDDDD` input border is 1.36:1, so inputs use the muted grey.

Contrast, measured by script on 2026-10-01 (WCAG 2 formula):

| Pair | Ratio |
|---|---|
| ink on canvas / soft / strong | 15.91 / 14.9 / 14.21 |
| body on canvas | 10.53 |
| muted on canvas / soft / strong | 5.41 / 5.05 / 4.83 |
| action on canvas / soft | 4.89 / 4.57 |
| white on action (button text) | 4.89 |
| error on canvas | 5.54 |
| ink on flag yellow `#F6E3A1` | 12.44 |

Action text on `strong` is 4.37:1 and fails, so coral links are never placed on `#F2F2F2`.
The cover contrast figures for the ten designed covers (navy, terracotta, teal and so on) are historical:
those covers are retired (ADR-023). The real covers are the owner's images, so no contrast measurement applies
to them. Text that sits on the page next to a cover is measured as above.

## Typography

- Everything: Inter variable, self-hosted. The guideline asks for Airbnb Cereal VF, which is licensed; Inter is its named open substitute. Line height 1.5.
- Fraunces was used for the designed cover titles of ADR-018. Those covers are retired (ADR-023), so nothing needs Fraunces now. Check whether the font files can be dropped (KNOWN-ISSUES).
- Scale: h1 28px to 40px weight 700, hero title up to 46px weight 600, h2 22px to 28px weight 600, card title 16px weight 600, lede 16px to 19px, small 14px, labels 12px.
- Reading width: 42rem for prose, about 70 characters.
- No third-party font requests.

## Layout

- Shell: 80rem wide, 20px gutters on a phone.
- Breakpoints: 36rem, 48rem, 56rem, 64rem. Mobile first.
- Grid rule (ADR-023): book grids are four across from 48rem and two across on a phone. Thirteen books do not fill rows of five, so the Books page shows one large "Most popular" feature row, then 12 books in three full rows of four. Cards share row heights through CSS subgrid.
- Home: white hero with a fan of three covers, credential strip, four reader paths (the four groups), four featured books, About with the author photo, join card.
- Books: four group chips that dim the others, the "Most popular" feature row, then the 12 books in three rows of four.
- Book page: soft-grey band with the cover, title, subtitle, tags (Published date, Kindle Unlimited, pages) and the two Amazon buttons; then About this book, Who it's for, the advice note, the author box, and four more books.
- Most inner pages open with a soft-grey band (eyebrow, h1, optional lede and actions). About uses a dedicated white portrait-led introduction, a 70rem content width, restrained section dividers and soft-grey writing/contact sections. It retains the existing Inter typography, coral action colour, radii and cover treatment.

## Components

- Cover (ADR-023): the owner's real cover, saved from her Amazon listing at 400 and 800 px wide in `public/images/books/<stem>-400.jpg` and `-800.jpg`, self-hosted and never hotlinked. Aspect 5:8, `object-fit: cover`. A spine and a sheen are drawn by CSS over the image. Replaces the designed 2:3 SVG covers of ADR-018 (`src/content/covers.ts` is no longer the cover source). Alt text rules are in `ACCESSIBILITY.md`.
- Author photo: her Amazon author-page profile image, `public/images/author/harni-600.jpg`. It is a casual photo of her in front of a framed portrait drawing. She chose to use it. A more formal photo is recommended later (KNOWN-ISSUES). Used on About and in the author box.
- Button: 8px radius, 48px tall, weight 500. Filled coral for the primary ("Buy on Amazon"), white with a 1px ink outline for the second ("Get the paperback"). Press scale 0.98, arrow slides 4px. Small variant 44px.
- Card: cover, title (the link), hook, "Read more" cue with the book title hidden for screen readers. The whole card is the target. Grids are four across, with the "Most popular" feature row above the 12 others.
- Tag and chip: pill shape, 1px grey border. A pressed chip is filled ink.
- Path card: number in a grey circle, group name, the group's blurb, count, arrow. There are four, one per group (Safe practice, Career and voice, Wellbeing for nurses, Everyday life). 14px radius, 1px hairline, lifts with the single shadow on hover.
- Credential strip: four facts from the owner's bio.
- Pull quote: the owner's own sentence about wellbeing and speaking up.
- Join card: white card, hairline and the single shadow, 56px inputs with a visible label, inline errors, a polite status line.
- Footer: light grey, laid out like the 21st.dev "footer-7" block (ADR-021): brand mark, one line, round icon links for Instagram and TikTok and a join button on the left; three link columns (Books, Explore, Help) on the right; a rule, then the copyright and the legal links (Privacy, Cookies, Terms). The personal-capacity and health notes sit in the one-line description under the brand, as the owner asked. Plain HTML and this site's own tokens, not the React and Tailwind source.
- Contact page (ADR-022): the page header is the same soft-grey band as the other inner pages. Below it the section is the 21st.dev "contact-with-globe" block: two columns at 64rem; left, "Get in touch", reply note, boxed-icon rows for email, Instagram and TikTok, and a draggable turning globe of real country outlines (d3-geo, bundled, lazy) that fades into the section; right, a rounded white "Send a message" card with a dotted separator, uppercase labels, rounded fields (Full name, Subject, Email address, Message) and a coral Submit button. The form opens the visitor's email app and the page says nothing was sent. Fields use `#8A8A8A` borders and muted labels and placeholders for WCAG AA.
- Consent banner: exists but is not rendered while no statistics tool is chosen (ADR-017).

## Elevation

One tier, from the guideline: `0 0 0 1px rgba(0,0,0,.02), 0 2px 6px rgba(0,0,0,.04), 0 4px 8px rgba(0,0,0,.1)`.
Used on panels, the author box, the join card and path-card hover. The covers keep their own soft shadows.

## Motion

150 to 700ms, ease-out, transform and opacity only. Scroll reveal runs once per element. The home cover floats slowly.
`prefers-reduced-motion` turns every animation and transition off and shows content at once.

## Icons and imagery

Inline SVG only, one stroke weight. No emoji, no stock photos, no AI photos of people. The one seafront photograph stays on the Pier Run page.

## Pier Run page

SUPERSEDED by "Pier Run bright seaside look" below (ADR-025). Historical text: `/play/` keeps its own gold-on-slate scene and older styles on purpose: it is a photographic game page. Its header and footer links, personal-capacity line and tap targets match the rest of the site.

## Rules for new work

Define tokens and component states before decoration. Use real interface copy. A new section needs a heading level that follows the one before, a visible focus state, and a reduced-motion fallback. Never put the brand coral on text.

## Pier Run refresh

SUPERSEDED by "Pier Run bright seaside look" below (ADR-025); the dusk scene described here is gone. Historical text: Pier Run now uses the shared white/coral design tokens and Inter typography. The dusk scene is contained within the game canvas. A compact brand header, title, one-line controls and small footer replace the full-screen photo hero and long guide. Canvas height responds to viewport height; narrow and short-landscape layouts have dedicated rules. Score settings are collapsed by default. At zoomed or unusually small viewports, document scrolling remains available rather than clipping controls. No full-screen API or forced orientation is used.

## Page components added on 2026-10-01 (ADR-025)

Styles live in `src/styles/site.css`. All use the existing tokens, so no new colour or font is introduced.

- About: jump-link row, at-a-glance facts strip, "path so far" five-step list, writing group blocks, principle cards, audience chips (from each book's `whoFor`), a dated timeline with covers and page counts, FAQ list, press bio blocks (one line, short, full) and a connect block.
- Events: upcoming list, a calm empty state with the join-the-list button, a past events section, enquiry guidance and a "what to include" list.
- Reviews: optional "Kind words" quote cards (only with written permission, none today) and cover cards for all 13 books that link to each book's Amazon review pages.
- Legal pages: a version line, an "In short" summary box, a contents list with jump links, numbered sections, and tables that have a caption and column scope. The [NEEDS] box stays visible for owner-only facts.
- Footer social icons: Instagram, TikTok and Amazon. The Amazon icon is a simple glyph, not the brand mark.

## Pier Run bright seaside look (ADR-025)

The game page keeps a compact brand header and its own small footer (Privacy, Terms, Amazon) and uses the site tokens and fonts. The scene is bright and sunny and is never dark, in four zones: Beach, Pier, Promenade (golden hour) and Fun fair. Everything is drawn in code, with no image files. The nurse-runner, hazards (benches, bins, crabs, rolling ball, puddles, gulls, bunting), book pickups, hearts and power-ups share one palette in `src/game/palette.ts`. The HUD shows hearts, score and combo. Styles are in `src/styles/game.css` and `play/index.html`. Reduced motion turns off particles, parallax and idle scroll and lowers the pace cap (code and unit test; no before and after visual comparison yet). Sound is off by default.

### Pier Run original artwork polish

The game retains the white/coral interface, Inter typography and bright daytime zones. A cream postcard-style start panel and a four-stop route indicator frame the custom canvas illustration. Fictional coastal landmarks include a striped lighthouse and Harni’s reading room; the runner carries a book satchel and collectibles have wave motifs and ribbon bookmarks. These are game scenery, not claims of a real shop or venue. No dark overlay, external artwork dependency or change to the current physics/power-up rules was introduced.

### Seaside platform hero

The runner is now an original platform-game character with a sun-yellow cap, larger expressive face, coral windbreaker, teal shorts, white gloves and broad trainers. The figure has no borrowed franchise insignia or uniform. A dark teal outline provides definition against lighter daytime skies. Existing hitbox dimensions stay unchanged and forgiving. Double jumping is now available without a power-up; descending onto a beach ball gives a bounce and 20 points before combo multiplication. Side hits still use the existing heart system. Controls and start-card copy explain these moves briefly.


## Presentation update, 2 October 2026

About uses an editorial author profile: a large portrait and name, professional background, education, writing focus, a small selected-book shelf, expandable questions and one primary contact action. Supersedes earlier About layouts. Keep the biography factual and avoid duplicating the full catalogue.

Legal pages fill the shared shell. Summaries and contents span the width; individual sections use a heading column and a wider reading column from 56rem, stacking below that. Preserve full legal wording and the consent notice version when making layout-only changes.

Game hazards use named action cues, strong object colours and light edge separation. Decorative furniture is pale and set behind the playable lane. Keep collision boxes unchanged for visual-only edits.

## Shared page headers, 2 October 2026

Use `page-heading` for all editorial page introductions, including the shared band, Home, About, Events and book details. White background, left alignment, small eyebrow, bold balanced heading, consistent responsive vertical spacing and readable lead text. Split layouts retain imagery. Book titles use a smaller responsive scale to accommodate long names. Pier Run uses matching alignment and type in a compact header to preserve game space.
