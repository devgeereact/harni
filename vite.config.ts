import { defineConfig } from 'vite';

import { routes } from './src/content/routes.ts';

// Every page is an HTML entry. The list comes from src/content/routes.ts, the same list that
// scripts/build-pages.ts writes the pages from, so a page is added in one place.
const input = Object.fromEntries(
  routes.map((route) => [route.key, new URL(`./${route.file}`, import.meta.url).pathname]),
);

// harni owns block 15 in ~/.claude/CLAUDE.md § Dev-server ports. Single-surface
// project, so it takes the 5NN2 (app) slot: 5152. The literal is repeated on
// server and preview on purpose — ~/.claude/bin/dev-all check greps for it, and
// a drifted port surfaces later as an opaque CORS or redirect failure rather
// than as "port in use".
export default defineConfig({
  server: { port: 5152, strictPort: true, proxy: { '/api/': 'http://127.0.0.1:5153' } },
  preview: { port: 5152, strictPort: true },
  build: {
    target: 'es2022',
    cssTarget: 'safari16',
    assetsInlineLimit: 2048,
    reportCompressedSize: false,
    rollupOptions: { input },
  },
});
