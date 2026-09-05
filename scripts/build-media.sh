#!/usr/bin/env bash
# Regenerates the responsive image set in public/media from the source photograph.
# Requires: sips (macOS), cwebp and avifenc (brew install webp libavif).
set -euo pipefail

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
src="$root/docs/IMG_3620.jpeg"
out="$root/public/media"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

for tool in sips cwebp avifenc; do
  command -v "$tool" >/dev/null || { printf 'Missing tool: %s\n' "$tool" >&2; exit 69; }
done

[ -f "$src" ] || { printf 'Missing source image: %s\n' "$src" >&2; exit 66; }
mkdir -p "$out"

# Encode one master into avif + webp + jpeg at the given widths.
encode() {
  master=$1; name=$2; shift 2
  for width in "$@"; do
    sips -Z "$width" "$master" --out "$tmp/${name}-${width}.png" >/dev/null
    sips -s format jpeg -s formatOptions 62 "$tmp/${name}-${width}.png" \
      --out "$out/${name}-${width}.jpg" >/dev/null
    cwebp -quiet -q 78 -m 6 "$tmp/${name}-${width}.png" -o "$out/${name}-${width}.webp"
    avifenc --min 24 --max 34 --speed 4 --jobs all \
      "$tmp/${name}-${width}.png" "$out/${name}-${width}.avif" >/dev/null
  done
}

# Full frame, used as the hero backdrop.
sips -s format png "$src" --out "$tmp/wide.png" >/dev/null
encode "$tmp/wide.png" "shore" 1920 1280 800 480

# Portrait crop around the figure (source is 2048x1536).
sips -c 900 700 --cropOffset 480 800 "$src" --out "$tmp/portrait.png" >/dev/null
encode "$tmp/portrait.png" "portrait" 900 600 400

# Tiny blurred placeholder, inlined as a data URI at build time.
sips -Z 16 "$tmp/wide.png" --out "$tmp/lqip.png" >/dev/null
sips -s format jpeg -s formatOptions 30 "$tmp/lqip.png" --out "$out/shore-lqip.jpg" >/dev/null

printf 'Wrote %s files to %s\n' "$(ls -1 "$out" | wc -l | tr -d ' ')" "$out"
