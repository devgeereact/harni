# Email and content verification, 1 October 2026

Follow-up: the owner requested a simple mailing-list thank-you and contact copies only. Removed public routing/CONFIRM instructions and the confirmation step. Subscription welcome contains no submitted-details copy; consent still requires the checkbox. Updated mail tests (19 checks) and production build PASS. Previous workflow descriptions below record the initial implementation and are superseded by this correction.

Outcome: PARTIAL. Requested changes implemented locally. Live mail delivery, deployment and final legal approval are not complete.

## Changes

- Contact JSON form routes to info@harni.uk; subscription JSON form routes to subscribe@harni.uk. PHP emits separate plain-text owner and visitor messages with reference, UTC timestamp, full details and appropriate next steps.
- Browser reports mail acceptance, copy-only failure and uncertain network results distinctly. No personal information is placed in URL parameters. Fixed recipients, field limits, header-injection validation, origin checks, honeypot and locked per-address/network/global limits apply on the server.
- Subscription is a manual request/CONFIRM workflow, not an automated mailing-list platform. No marketing follows from contact enquiries or unconfirmed requests.
- Amazon author social link added to shared footer and Pier Run footer. About expanded from recorded biography and catalogue. Events provides enquiry guidance without invented dates. Reviews links each real book listing without fabricated testimonials or ratings.
- Pier Run has richer instructions, optional per-visit score storage, deletion and pause/resume controls. Game motion remains; no equivalent non-visual mode is claimed.
- All four legal pages rewritten as coherent drafts based on actual behaviour. Unknown operator/provider facts and legal review remain explicit launch gates in docs/05-security/LEGAL-REVIEW.md.

## Evidence

| Check | Status | Evidence |
|---|---|---|
| TypeScript | PASS | `npm run typecheck` |
| Node unit tests | PASS | `npm test`: 12 tests, including optional storage and blocked-storage handling |
| PHP syntax | PASS | `php -l public/api/message.php` |
| Mail logic | PASS | `npm run test:mail`: 19 checks covering routing, copy content, consent, invalid input, injection, failure handling and rate limits |
| Complete HTTP mail path | PASS | `python3 tests/integration/mail-http.py`: both forms accepted; exactly four messages captured locally; correct owner/visitor destinations; no real mail transport used |
| HTTP rejection paths | PASS | Synthetic local requests: GET 405, untrusted Origin 403, invalid address 422, missing consent 422, valid contact/subscription with disabled sending 503 |
| Vite/PHP proxy | PASS | POST through localhost:5202 returns the correct disabled subscription response |
| Built links and output | PASS | All internal href/src targets exist on ten affected built pages, no visible NEEDS/CHECK flags, PHP copy matches source |
| Updated page routes | PASS | HTTP 200 plus h1 for About, Contact, Join, Events, Reviews, Play, Privacy, Cookies, Terms, Delivery/refunds on localhost:5202 |
| Production build | PASS | `npm run build`: 26 generated pages, 25 sitemap URLs, PHP copied into dist/api |
| Desktop/mobile visual and keyboard checks | BLOCKED | No connected browser; computer-use Accessibility/Screen Recording permissions pending. No claim based on old screenshots |
| Real inbox arrival, spam placement, authentication | NOT TESTED | Provider/host configuration unverified; no real email sent |
| Legal readiness | PARTIAL | Current ICO and UK legislation checked; operator/provider facts and professional review outstanding |
| Deployment | NOT TESTED | No push, deploy, DNS or remote configuration changes |

## Remaining action

Confirm the mail service and legal operator facts, complete browser review, and follow the EMAIL.md setup and approved live verification process. Preserve the previous build for rollback. Sending stays disabled until configured; direct email links remain available.

## Contact acknowledgement follow-up

Owner requested an acceptance checkbox. Added a required, initially unchecked control linking Privacy Notice and Website Terms, shortened surrounding copy, and enforced explicit acceptance in PHP. Recorded acknowledgement wording/version in contact emails. Contact copies retained; no marketing consent inferred. PASS: 21 mail checks, TypeScript/build and diff whitespace check. Visual interaction remains NOT TESTED.
