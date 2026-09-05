# Changelog

## 2026-09-05

First build. Nothing has been deployed.

- GEE OS website scaffold, project documents filled in with what is actually known.
- Vite and TypeScript, no framework. Dev and preview pinned to port 5152 with
  `strictPort`; registry block 15 claimed in `~/.claude/CLAUDE.md` and a row added to
  `~/.claude/bin/dev-all`.
- Welcome page: hero built from the supplied photograph, "what's coming" list,
  mailto contact.
- Pier Run, a canvas endless runner with a fixed 120 Hz simulation, coyote time,
  jump buffering, variable jump height, keyboard and touch input, pause, and a best
  score in `localStorage`. Jump the benches, duck the gulls, collect the lights.
- `scripts/build-media.sh` derives 22 responsive AVIF/WebP/JPEG files from
  `docs/IMG_3620.jpeg`.
- The source photograph was swapped from a hotel lobby to the seafront part-way
  through. The palette, the copy and the game's setting were re-themed to match; the
  game's physics were not touched.
- Fraunces and Inter self-hosted through Fontsource. No third-party requests.
