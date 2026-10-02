# Accessibility Audit

Date: 2026-09-05. Partial: measured contrast and inspected markup and behaviour.
No assistive technology was run, so this is not a sign-off.

## Verified

- Contrast: 8.05:1 for body text and 10.25:1 for the eyebrow against the page
  background, measured from computed colours with the WCAG 2 formula. AAA for
  normal text. Re-measured after the palette changed.
- `prefers-reduced-motion: reduce` removes the reveal animation, the hero parallax
  and the drift of the sea, railings and deck. Verified with emulated media.
- Focus is visible: a 2px brass outline with 3px offset, including on the game panel.
- Skip link is the first focusable element and appears on focus.
- The game is keyboard-operable end to end: start, jump, duck, pause, resume,
  restart.
- Space only starts a run when the game panel already has focus, so it stays a page
  scroll everywhere else.

## Present but unverified

- One `h1` per page and `h2` per section.
- `role="status"` live region announces the end of a run.
- Canvas carries `role="img"` and a description of the controls.
- On `/play/` the hero photograph has a described `alt`: "Figure in a pale coat photographing the
  low sun over Brighton's ruined West Pier". The portrait crop no longer exists.

## Bookstore release, 2026-10-01 (partial, localhost only)

Measured in a browser and by script. Not a sign-off: no assistive technology was run.

- Contrast: seven text and background pairs, 4.99:1 to 14.27:1, all pass AA.
- Structure: one `h1` on every page; the Books page has a hidden `h2` so headings do not jump from
  `h1` to `h3`. Every `<img>` has `alt`. Book tiles and social icons are `aria-hidden` and sit
  beside the text that names them. "View book" links carry `View book: <title>`.
- Keyboard: the skip link is the first stop, with a 3px focus ring. The phone menu uses
  `aria-expanded` and closes with Escape. Form errors move focus to the first bad field.
- Layout: no horizontal scroll at 375px or 390px on any page.
- Target size: everything is 24px or taller at 375px, which meets WCAG 2.2 AA. See known issue 15.
- Motion: bookstore pages animate nothing. `/play/` honours `prefers-reduced-motion`.
- External links that open a new tab say so in hidden text.

## Not tested

VoiceOver, NVDA or any other screen reader. Touch target sizes and the phone menu on a real device.
Zoom to 200%. Windows High Contrast. A full keyboard walk of every page. Safari and Firefox.
