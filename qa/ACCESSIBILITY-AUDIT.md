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

- One `h1`, `h2` per section, `role="list"` on the rooms list.
- `role="status"` live region announces the end of a run.
- Canvas carries `role="img"` and a description of the controls.
- Decorative hero image has an empty `alt`; the portrait has a described `alt`.

## Not tested

VoiceOver, NVDA or any other screen reader. Touch target sizes on a real device.
Zoom to 200%. Windows High Contrast.
