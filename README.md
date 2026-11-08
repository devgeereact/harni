# Harni

Author website for harni.uk. It presents Harni Muharami's 13 books, which are sold on Amazon, with a contact form, a mailing-list sign-up and the Pier Run game. The site takes no orders. This React and Tailwind rebuild preserves the public wording, design, URLs, search metadata and PHP mail contract.

## Run on Linux or macOS

Install Mise through its official instructions, then run these commands inside this project:

```sh
mise trust mise.toml
mise install
mise exec -- npm run setup
mise exec -- npm run dev
```

Open http://127.0.0.1:5152. Setup uses the committed npm lockfile and installs dependencies for the current OS, including Sharp and Chromium. Never transfer `node_modules`, `dist`, browser caches or machine-specific tools between systems. Transfer tracked source through Git, retain the lockfile, and run setup on the destination. Keep private configuration on its own machine. `.env.example` lists variable names only, never values; the real values live in the host's private configuration.

Node 24.21.0 is pinned in `mise.toml` and `.node-version` (a unit test keeps them and the CI workflows equal). Do not substitute another package manager: npm stays and pnpm is deferred (ADR-030). PHP 8.1+ is optional for browsing and required to exercise the mail endpoint. Supply an installed PHP through PATH or `HARNI_PHP_BIN`; setup does not alter the global toolchain. The launcher forces mail sending off, starts PHP on loopback if available, reports port conflicts and stops its own children on Ctrl+C. Without PHP, frontend browsing works but form delivery does not.

## Intentional trusted-LAN preview

Find the private IPv4 address assigned to your computer, then substitute it below:

```sh
HARNI_HOST=192.168.1.50 mise exec -- npm run dev
```

Open `http://192.168.1.50:5152` from your trusted LAN. The address must actually belong to this computer. Wildcard and public addresses are rejected. Mail is blocked in LAN previews, and the Vite `server.fs.deny` list blocks PHP source, `.agent/`, `docs/` and environment files. No router forwarding, firewall changes or public tunnel is configured. Cross-device access depends on the existing network/firewall and must be checked from that device.

`HARNI_WEB_PORT` and `HARNI_MAIL_PORT` override 5152/5153 when those ports are occupied. Existing processes are never stopped. Both ports must differ. `npm run preview` serves the build using the same private API proxy/guard and host settings. Production PHP hosting remains a separate decision.

## Checks and media

```sh
mise exec -- npm run doctor
mise exec -- npm run check        # typecheck, unit tests and PHP lint in one gate (no browser tests)
mise exec -- npm run typecheck
mise exec -- npm test
mise exec -- npm run build
mise exec -- npm run test:browser
# With a local PHP 8.1+ installation, no real mail is sent:
mise exec -- npm run test:mail
python3 backend/tests/mail-http.py
```

The HTTP mail test uses an isolated local capture transport and temporary state. Do not run live email tests without separate authority. The optional `doctor -- --mail` check requires PHP. Biome and a separate lint configuration are deferred (ADR-030). Strict TypeScript, unit checks and browser checks cover the implemented changes.

`npm run media` regenerates the existing shore image derivatives using project-local Sharp, without `sips`, Homebrew, `cwebp` or `avifenc`. Alternative public source/output paths: `npm run media -- --input '/path/source photo.jpg' --output '/path/derived assets'`. Only generated shore files at the chosen output are replaced. Existing images were retained during this migration; the encoder was tested using synthetic temporary fixtures.

## Source layout

The project root contains source and GEE OS support folders. Page URLs are no longer represented by folders at the project root.

```text
harni/
├── src/          React app, features, content, data and styles
├── public/       Images and media
├── backend/      PHP mail endpoint: public entry in backend/public/api/, private code in backend/src/ (deployed outside the web root)
├── scripts/      Setup, development and page generation
├── tests/        Unit, browser and integration checks
├── docs/         GEE OS design, architecture and operations
├── qa/           Verification evidence and history
├── .agent/       GEE OS project and task state
├── .generated/   Ignored development HTML, recreated automatically
└── dist/         Ignored production output, recreated by build
```

All 27 generated HTML pages live inside `.generated/pages/`. `npm run dev` and `npm run build` regenerate them automatically. `npm run pages` regenerates them explicitly after editing public content. Do not edit generated HTML. `dist/` retains the route folders needed for static hosting, such as `/books/safe-by-design/`; these are build output, rather than extra source folders.


- `src/app/`: React document rendering and hydration.
- `src/features/`: navigation, catalogue, consent, mail forms and canonical game document.
- `src/content/`, `src/data/`: existing typed public copy, routes, book facts and metadata. Change these, then run `npm run pages`; generated route HTML is not edited by hand.
- `src/game/`, `src/lib/`: preserved game engine and lifecycle-managed visual helpers.
- `src/styles/`: original design tokens/styles plus Tailwind theme and utilities. Preflight is deliberately omitted to preserve the approved design.
- `scripts/`: page generation, portable media, setup, doctor and managed development startup.
- `.agent/`, `docs/`, `qa/`: GEE OS project state, decisions and evidence.

The build converts repository-owned content to a typed tree, renders it with React on the server, then hydrates that same tree. Static pages remain useful without JavaScript. This is not an API for rendering arbitrary external HTML. Browser forms validate input and POST JSON to the unchanged PHP endpoint, with duplicate-request protection and preserved input after failures.

## Release status

The React rebuild was merged to `main` as PR 4 (merge commit d60e544) and deployed on 2026-11-08 (Deploy run 42457618070, 3 smoke checks passed). Live GET checks showed Book and BreadcrumbList JSON-LD on a book page, 403 on `/assets/`, `/images/` and `/media/`, and 405 on a GET to `/api/message.php`. `main` is protected.

Still open:

- Mail sending is switched off on the host (NOT TESTED).
- Real devices and a screen reader have not been used (NOT TESTED).
- The live site still lacks HSTS and a Content-Security-Policy, and Cloudflare NEL is on; both are planned for Phase 5.

The detailed release report is on the owner's Mac, outside this repository (`../reports/harni/qa/reports/REACT-REBUILD-2026-10-07.md`).
