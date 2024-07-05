#! /usr/bin/env bash
set -e

[[ -z "$1" ]] && echo "Missing working directory argument" && exit 1

echo "Installing root pnpm"
pnpm -C $1 i