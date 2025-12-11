#! /usr/bin/env bash
set -e

[[ -z "$1" ]] && echo "Missing working directory argument" && exit 1

echo "Removing postinstall"
sed -i '/^  "postinstall"/d' "$1"/package.json

echo "Installing root pnpm"
pnpm -C "$1" i