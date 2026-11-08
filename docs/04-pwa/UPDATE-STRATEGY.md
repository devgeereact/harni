# Update Strategy

Applicability: N/A
Reason: There is no service worker, so there is no cache versioning or migration. Visitors get new pages on their next load. The only update and rollback path is the release process in [DEPLOYMENT.md](../07-operations/DEPLOYMENT.md) (see its "Rollback" section).
Date: 2026-11-08
Decision owner: Gideon (operator and owner of the decision); approved 2026-11-08 (.planning/QUESTIONS.md E3)

Revisit if: a service worker is added (then upgrade from the previous production version must be verified, not only a clean install).
