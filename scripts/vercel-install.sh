#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f node_modules/.pnpm/lock.yaml ] && ! cmp -s pnpm-lock.yaml node_modules/.pnpm/lock.yaml; then
  echo "pnpm-lock.yaml changed since the cached node_modules was installed, reinstalling from a clean node_modules"
  find . -name node_modules -type d -prune -not -path "./.git/*" -exec rm -rf {} +
fi

pnpm install --frozen-lockfile
