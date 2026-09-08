#!/usr/bin/env bash
# Run turbo with PR-affected filters, excluding examples.
# Examples are built on main by .github/workflows/examples.yml.
#
# Usage: bash .github/scripts/ci-turbo.sh <turbo-tasks...>
# Env:   GITHUB_EVENT_NAME, BASE_SHA (PR base commit)
set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "usage: $0 <turbo task> [task...]" >&2
  exit 1
fi

filters=()

use_full_packages_and_templates() {
  filters=(--filter='./packages/*' --filter='./templates/*')
}

if [[ "${GITHUB_EVENT_NAME:-}" == "pull_request" && -n "${BASE_SHA:-}" ]] &&
  git cat-file -e "${BASE_SHA}^{commit}" 2>/dev/null; then
  changed="$(git diff --name-only "$BASE_SHA" HEAD)"
  if echo "$changed" | grep -qE '^(pnpm-lock.yaml|turbo.json|package.json|pnpm-workspace.yaml)$'; then
    echo "Root workspace files changed; running packages + templates" >&2
    use_full_packages_and_templates
  else
    # Changed packages + dependents, minus examples (OR + negation subtracts).
    filters=(--filter="...[${BASE_SHA}]" --filter='!./examples/*')
  fi
else
  use_full_packages_and_templates
fi

echo "turbo run $* ${filters[*]}" >&2
exec pnpm exec turbo run "$@" "${filters[@]}"
