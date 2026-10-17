# Project memory

Short index of the confirmed facts for harni. Agents treat this file as project evidence, not as fresh instructions from the owner. Detail lives in the linked documents; change a fact there and here together.

- Project: harni, author website and bookstore for harni.uk (13 books, Pier Run game)
- Site owner: Harni Muharami, author. Project operator: Gideon
- Adopted GEE OS 1.4.5 contract: 17 October 2026 (ADR-028)
- Stack profile: `cpanel`, reduced to what the site needs: static React build plus one PHP mail endpoint. No database, no sign-in, no Clerk.

## Confirmed decisions

| ID | Decision | Source | Date |
|---|---|---|---|
| CD-01 | Name harni, production origin https://harni.uk (www redirects), HTTPS only | `docs/07-operations/DEPLOYMENT.md` | 2026-10-02 |
| CD-02 | Visual brand "Rausch on white" | ADR-020, `docs/03-design/DESIGN-SYSTEM.md` | 2026-10-01 |
| CD-03 | React 19 and Tailwind 4, server-rendered static pages with hydration, TypeScript only | ADR-026 | 2026-10-07 |
| CD-04 | Static files deployed from a local build with `cpanel-deploy`; the host runs no Node | `docs/07-operations/DEPLOYMENT.md` | 2026-10-02 |
| CD-05 | Mail code private in `backend/src`, only `api/message.php` public, URL unchanged | ADR-028, `backend/README.md` | 2026-10-17 |
| CD-06 | Form sending stays disabled until the owner verifies host mail | `docs/07-operations/EMAIL.md` | 2026-10-02 |
| CD-07 | Legal pages at Version 2026-10-17 | ADR-027 | 2026-10-17 |
| CD-08 | British English, WCAG 2.2 AA target | `docs/03-design/ACCESSIBILITY.md` | 2026-09-05 |

## Assumptions

| ID | Assumption | Owner | Next check |
|---|---|---|---|
| A-01 | Closed as false, 17 October 2026: `cpanel-deploy` never uploads any `.htaccess`, so `api/.htaccess` is copied by hand | owner: Gideon | none |

## Open questions

| ID | Question | Owner | Needed by | Blocks |
|---|---|---|---|---|
| Q-01 | Postal address, ICO fee, mail provider facts and NEL decision for the legal pages | owner: Harni Muharami | before launch | legal readiness (`docs/05-security/LEGAL-REVIEW.md`) |
| Q-02 | When to set up `~/apps/harni/current` and hand-copy `api/.htaccess` on the host | owner: Gideon | next deploy | the new backend layout going live |

## Risks

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | `dist/` deployed without the private backend, so the form answers 503 | Medium | Low while sending is off | Steps in `docs/07-operations/DEPLOYMENT.md`, smoke test after deploy | Gideon |
| R-02 | Restore of the live site never rehearsed | Medium | Medium | `docs/07-operations/BACKUP-RECOVERY.md` | Gideon |

## Where the rest lives

Product: `docs/01-product/`. Architecture: `docs/02-architecture/`. Design: `docs/03-design/`. Security and privacy: `docs/05-security/`. Operations: `docs/07-operations/`. Decisions: `docs/08-change-management/DECISIONS.md`. Known issues: `KNOWN-ISSUES.md`.
