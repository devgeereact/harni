# Audit log

Every audit, review and checklist run for this project, newest first. Add new results here as a dated section; do not create separate audit files.

## 2026-09-05 · Pwa Release Checklist

_Merged from `docs/AUDIT.md` on 2026-10-30._

## PWA Release Gates

For every line record status, evidence, owner and date. Allowed statuses are `PASS`, `FAIL`, `PARTIAL`, `NOT TESTED`, `N/A` and `BLOCKED`. `N/A` requires a reason.

### Runtime and network

- [ ] Application works online.
- [ ] Network failure produces intentional behaviour.
- [ ] Offline behaviour matches the approved specification.
- [ ] Service worker registration, scope and lifecycle behave correctly.
- [ ] Old caches are removed safely.
- [ ] New versions update without trapping users on stale code.
- [ ] Failed requests recover appropriately.
- [ ] Duplicate submissions are prevented or made idempotent.
- [ ] API failures have visible, recoverable states.

### Installation and navigation

- [ ] Installation works on supported platforms.
- [ ] App icons and launch presentation work.
- [ ] The web app manifest is valid.
- [ ] Start URL, scope, deep links and refreshed routes work.

### Identity, data and synchronisation

- [ ] Authentication survives the intended application lifecycle.
- [ ] Private data is not cached accidentally.
- [ ] User work is not silently lost.
- [ ] Queueing, retry, conflict and synchronisation states are explicit where applicable.
- [ ] Database policies and permissions are verified.
- [ ] Role permissions are verified server-side.

### Experience and release

- [ ] Mobile layout works on supported sizes.
- [ ] Desktop layout works on supported sizes.
- [ ] Accessibility has been checked with recorded evidence.
- [ ] Production build succeeds.
- [ ] No critical console or runtime errors remain.
- [ ] No exposed secrets are present.
- [ ] No critical security findings remain open.
- [ ] Monitoring and error reporting are operational.
- [ ] Backup and recovery exist where applicable.
- [ ] Rollback is documented and feasible.
- [ ] The production environment has been verified directly.

Test online, slow, intermittent, offline and restored-network transitions. A simulated checkbox without observed behaviour is not a pass.

## 2026-09-05 · Website Launch Checklist

_Merged from `docs/AUDIT.md` on 2026-10-30._

## Website Launch and Quality Gates

Record status, evidence, owner and date. The lists supplied by Gideon are consolidated here without duplicate or corrupted numbering.

### Launch essentials

- [ ] Privacy policy reflects real data practices and has appropriate review.
- [ ] Terms page uses verified organisation and jurisdiction details.
- [ ] Primary call to action is clear and works.
- [ ] FAQ answers real user questions.
- [ ] `robots.txt` is intentional and valid.
- [ ] `sitemap.xml` is current and reachable.
- [ ] A useful custom 404 page exists.
- [ ] Meaningful images have appropriate alternative text.
- [ ] Analytics is configured with consent where required.
- [ ] Every indexable page has a specific title and description.
- [ ] Social sharing metadata and preview imagery work.
- [ ] Favicon and required brand icons work.
- [ ] Canonical URLs are correct.
- [ ] Cookie consent matches actual storage and applicable law.
- [ ] Mobile layouts and interactions are tested.
- [ ] Keyboard, focus, labels, contrast, landmarks and touch targets are checked.
- [ ] Forms are tested for validation, success, failure and recovery.
- [ ] Internal and external links are checked.
- [ ] Images, fonts, scripts and critical rendering are tuned to agreed budgets.

### Interface repair

- [ ] No unintended horizontal scrolling exists.
- [ ] Buttons and links perform their labelled action.
- [ ] Mobile navigation works and is accessible.
- [ ] Footer links work.
- [ ] Success and error messages are clear and actionable.
- [ ] Placeholder copy, dead navigation and temporary assets are removed.
- [ ] Logo returns to the expected home route.
- [ ] Telephone numbers and email addresses are actionable where appropriate.
- [ ] Copyright details are current.

### Conversion risks

- [ ] Pop-ups are limited, timed responsibly and easy to dismiss.
- [ ] Headline and value proposition are specific.
- [ ] Calls to action do not compete without a clear hierarchy.
- [ ] Copy and imagery are credible, specific and consistent with the product.
- [ ] Page speed meets the agreed budget.
- [ ] Long text is structured for scanning without hiding necessary detail.
- [ ] Animation and video do not distract, block access or harm performance.
- [ ] Forms ask only for necessary information.
- [ ] Pricing visibility follows the approved commercial strategy.
- [ ] Social proof is authentic and permissioned.
- [ ] Navigation supports the next step.
- [ ] Cookies and trackers are necessary, documented and controlled.

### Security checks

- [ ] API keys and secrets are absent from client bundles and version history.
- [ ] Environment variables and production settings are verified.
- [ ] Administrative routes require server-side authorisation.
- [ ] Authentication and role permissions are tested.
- [ ] User input is validated and safely rendered.
- [ ] SQL injection controls and database policies are verified.
- [ ] Rate limiting and abuse controls match risk.
- [ ] Third-party spending limits and alerts exist where supported.
- [ ] File uploads validate type, size, ownership, storage and delivery.
- [ ] CSRF protection is present where the authentication design requires it.
- [ ] CORS permits only intended origins, methods and headers.
- [ ] HTTPS is enforced.
- [ ] Security headers match the application.
- [ ] Cookies use appropriate `Secure`, `HttpOnly` and `SameSite` settings.
- [ ] Debug mode and verbose error disclosure are disabled in production.

Do not mark the site ready while a critical gate is failed, blocked or not tested.
