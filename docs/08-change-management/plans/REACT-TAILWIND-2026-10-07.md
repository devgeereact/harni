# Harni React/Tailwind reconstruction, 7 October 2026

Authority: the owner asked to continue the next project under the approved GEE OS, React and Tailwind direction, preserving originals and naming rebuilt candidates after them. Local work only in Rebrand/harni. No push, deployment, live email, credential access or destructive retirement.

## Inspected baseline

Original HEAD 6ef5762. Preserved dirty CURRENT-TASK, CHANGELOG and Vite configuration in a source-only patch. The untracked original .claude folder is left untouched. Clean install, production build and 44 unit tests pass on Linux. npm run media fails before writing output because it requires macOS sips. Source content, 13-book catalogue, 27 route entries, metadata, static no-JavaScript reading, PHP mail contract, author images and Pier Run are existing product requirements.

## Implementation

1. Retain the GEE document hierarchy and record one current task, with historical updates archived.
2. Keep source content and book data authoritative. Parse trusted build-time HTML into a typed document tree, render that tree through React on the server and hydrate the same tree in the browser. Preserve multi-page URLs, static readable content, metadata, JSON-LD and no-JavaScript fallbacks. Do not turn search-indexable pages into an empty client-only shell.
3. Replace navigation, catalogue filtering, consent and mail-form DOM scripts with React components. Keep game and globe as lifecycle-managed visual islands. Retain established CSS tokens and layout; add Tailwind 4 without Preflight to avoid an unintended design reset.
4. Replace macOS-only media processing with project-local Sharp and a tested Node script. Pin the actually supported Node runtime locally with Mise. Add clean setup, doctor, guarded startup and Linux/macOS CI.
5. Validate source-content/route parity, static and hydrated pages at desktop/mobile widths, menus, filters, forms using an intercepted local response, and game interactions. Mail transport stays off in normal development; PHP transport tests use local capture only.

## Release gate

Candidate relocation under Rebrand does not mean release approval. Preserve original checkout and Git history. Record PASS/FAIL/PARTIAL/NOT TESTED evidence, Mac execution limits, external mail/legal/hosting blockers, and rollback to the original build. No public LAN exposure until an explicit private-interface setting is used, with safe allowed host/origin handling.
