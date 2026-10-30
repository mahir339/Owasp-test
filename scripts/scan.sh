#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p reports
docker run --rm \
  -v "$ROOT:/app" \
  ghcr.io/owasp-dep-scan/dep-scan \
  depscan --src /app --reports-dir /app/reports
