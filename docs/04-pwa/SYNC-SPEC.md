# Synchronisation Specification

Applicability: N/A
Reason: There is no local queue or background sync. A form submit is one synchronous POST to `/api/message.php` with no automatic retry (see [EMAIL.md](../07-operations/EMAIL.md) and [API-SPEC.md](../02-architecture/API-SPEC.md)). The only browser storage is the opt-in best-score key `harni.pier-run.best`, which is never sent anywhere.
Date: 2026-11-08
Decision owner: Gideon (operator and owner of the decision); approved 2026-11-08 (.planning/QUESTIONS.md E3)

Revisit if: the site ever queues work on the device or keeps data that must be reconciled with a server.
