# Offline Specification

Applicability: N/A
Reason: Pages and forms need a connection. There is no cache allowlist, no service worker and no offline write. A failed send tells the visitor plainly and keeps their input so they can try again (see [EMAIL.md](../07-operations/EMAIL.md)). No other offline behaviour exists in the code, and none is described here.
Date: 2026-11-08
Decision owner: Gideon (operator and owner of the decision); approved 2026-11-08 (owner approval of the Phase 2 proposal to mark these specs N/A)

Revisit if: a service worker or any offline reading or writing is added (then this document and the PWA release gate must be completed first).
