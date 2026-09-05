# harni

Welcome page for `harni.uk`, a personal space for the owner's thoughts and views.
One static page: a hero built from their photograph of the seafront at dusk, and
Pier Run, a small canvas endless runner in the same light. Built with Vite and
TypeScript, no framework.

## Current state

- Lifecycle: first release built, not deployed.
- Production URL: `https://harni.uk/` — DNS, TLS and the Cloudflare origin lock are
  in place, but the docroot is still empty and serves the cPanel default page.
- Dev port: **5152** (registry block 15, `~/.claude/CLAUDE.md` § Dev-server ports).
  Pinned with `strictPort` on both `server` and `preview`.

## Commands

```bash
npm install
npm run dev         # http://localhost:5152
npm run typecheck   # tsc --noEmit
npm run build       # typecheck, then dist/
npm run preview     # serve dist/ on 5152
npm run media       # regenerate public/media from docs/IMG_3620.jpeg
```

`npm run media` needs `sips` (macOS), plus `cwebp` and `avifenc`
(`brew install webp libavif`). The generated files are committed, so it only has to
run when the source photograph changes.

## Layout

```
index.html              markup, copy and the responsive <picture> sets
src/main.ts             boot: fonts, styles, reveal, parallax, game mount
src/styles/             tokens, base, sections, game
src/lib/                reveal and parallax, both reduced-motion aware
src/game/               Pier Run: config, world, render, input, storage
scripts/build-media.sh  photograph to AVIF/WebP/JPEG at four widths
public/media/           generated image set (committed)
docs/                   GEE OS project documents
```

## Pier Run

Fixed 120 Hz simulation with a render pass at display rate, so physics does not
change with frame rate. The world is 360 units tall and as wide as the canvas
aspect makes it; the renderer scales to whatever size the element is.

Controls: <kbd>Space</kbd>, <kbd>↑</kbd> or <kbd>W</kbd> to jump (hold for height),
<kbd>↓</kbd> or <kbd>S</kbd> to duck, <kbd>P</kbd> or <kbd>Esc</kbd> to pause.
On touch: tap to jump, swipe down to duck. Best score is kept in `localStorage`
under `harni.pier-run.best` and every access is guarded, so a browser that
blocks site data still plays.

The loop parks itself when the panel scrolls off screen or the tab is hidden.

## Copy

Everything visible is placeholder voice written to be true rather than
impressive: the site says it is being built, because it is. Replace it before
launch. `hello@harni.uk` is used in three places and has not been tested.

## Deploying

Not deployed yet. The build has to run locally because the cPanel host has no Node.
When the copy is ready:

```bash
npm run build
cpanel-deploy dist harni.uk            # dry run, shows every change
cpanel-deploy dist harni.uk --go       # writes
```

Read `~/.claude/CLAUDE.md` §2 first. The docroot is origin-locked by a `.htaccess`
the repo does not own, and `cpanel-deploy` excludes `.htaccess` by default — leave
it that way.
