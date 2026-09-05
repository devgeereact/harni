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
