# Release report, 7 October 2026

Decision: **NO-GO for production release**. Overall acceptance: **PARTIAL**.

The local rebuild candidate exists under Rebrand/harni. Its original active checkout remains the recovery path. Local verification does not establish Mac compatibility or live enquiry delivery.

## Fresh local checks

| Check | Result |
| --- | --- |
| TypeScript checking | PASS |
| Unit suite | PASS |
| Production build | PASS |
| Lint | NOT APPLICABLE, no separate lint command; strict typecheck used |
| Browser regression suite | PASS, 59 checks |
| Actual Mac and Safari | NOT TESTED |
| Deployed delivery and hosting | NOT TESTED |
| Owner content/design/legal sign-off | BLOCKED pending owner input |
| Full accessibility, security, performance and SEO acceptance | NOT TESTED in this follow-up; browser checks cover only their named scenarios |

Commands: `mise exec -- npm run typecheck`, `mise exec -- npm test`, `mise exec -- npm run build`, `mise exec -- npm run test:browser` and, where defined, `mise exec -- npm run lint`.

Detailed rebuild evidence: [rebuild report](../../qa/reports/REACT-REBUILD-2026-10-07.md). Fresh follow-up: [local verification](../../qa/reports/FOLLOW-UP-2026-10-07.md).

## Remaining gates

Actual Mac execution, owner feature and legal acceptance, verified hosting/PHP transport and delivered contact/subscription messages. No live mail is enabled by this follow-up.

Local form failures are intentional: browser success fixtures simulate the remote response and do not prove delivery. A local 503 must not be removed merely to make the form appear successful.

## Recovery and next action

No deployment or original-project cutover occurred. Continue using the original active checkout if this candidate needs rollback. Before any approved deployment, retain the previous deployed artefact, verify the candidate against current original changes, and check routes and actual owner-controlled enquiry delivery afterwards.

Complete the open gates above before changing this decision. No business facts, approvals or delivery results were invented.
