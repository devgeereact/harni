import { defineConfig } from 'vite';

// harni owns block 15 in ~/.claude/CLAUDE.md § Dev-server ports. Single-surface
// project, so it takes the 5NN2 (app) slot: 5152. The literal is repeated on
// server and preview on purpose — ~/.claude/bin/dev-all check greps for it, and
// a drifted port surfaces later as an opaque CORS or redirect failure rather
// than as "port in use".
export default defineConfig({
  server: { port: 5152, strictPort: true },
  preview: { port: 5152, strictPort: true },
  build: {
    target: 'es2022',
    cssTarget: 'safari16',
    assetsInlineLimit: 2048,
    reportCompressedSize: false,
  },
});
