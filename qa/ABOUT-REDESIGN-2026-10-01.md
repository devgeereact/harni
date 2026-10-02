# About redesign, 1 October 2026

Owner requested a complete cleaner, professional About page rebuild. Local only, no deployment.

## Design and scope

Preserved `/about/`, navigation, existing brand colours and type, author photo, verified biography and original cover assets. Replaced the generic title band, quote banner, repeated boxes and social panel with a portrait introduction, professional background, writing section, personal background and contact invitation. No invented credentials, dates, employers or testimonials. Shared navigation and legal pages unchanged.

Scoped CSS uses a 70rem content width, mobile-first stacked sections and two-column arrangements from 56rem. Existing reduced-motion/focus behaviour remains; no new animation or dependencies.

## Verification

- PASS: production build including TypeScript.
- PASS: built About page has exactly one h1; local link targets and on-page anchor exist; all images have alt attributes and explicit dimensions, and resolve to built files.
- PASS: git diff whitespace check.
- BLOCKED: browser visual, mobile viewport and keyboard review. No browser connection available in computer-use inventory. Static checks do not prove visual layout or runtime accessibility.

Next: review `/about/` in the existing localhost preview, including desktop and mobile widths. No release or deployment claim.
