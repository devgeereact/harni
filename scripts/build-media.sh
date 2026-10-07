#!/usr/bin/env bash
# Compatibility entry point. Requires this project's Node/Sharp dependencies on macOS or Linux.
set -euo pipefail
root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
exec node "$root/scripts/build-media.mjs" "$@"
