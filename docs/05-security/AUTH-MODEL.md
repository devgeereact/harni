# Authentication Model

Applicability: N/A
Reason: The site has no accounts, sign-in, admin area, sessions or passwords. The only protected surface is the mail endpoint, guarded by an Origin allow-list and rate limits (see [API-SPEC.md](../02-architecture/API-SPEC.md)). The 1 Nov 2026 security checklist in [docs/AUDIT.md](../AUDIT.md) records the authentication, admin-route and password items as N/A.
Date: 2026-11-08
Decision owner: Gideon (operator and owner of the decision); approved 2026-11-08 (.planning/QUESTIONS.md E3)

Revisit if: an admin area, CMS or visitor accounts are ever added (then the house sign-in standard applies and this document must be written before the feature ships).
