#! /usr/bin/env bash
set -e

[[ -z "$1" ]] && echo "Missing working directory argument" && exit 1

echo "Removing postinstall from ./package.json"
sed -i '/^    "postinstall"/d' "$1"/package.json

echo "Removing prepare from ./examples/amazon-pay-button-example/package.json"
jq 'del(.scripts.prepare)' "$1"/examples/amazon-pay-button-example/package.json > "$1"/examples/amazon-pay-button-example/package.json.tmp \
&& mv "$1"/examples/amazon-pay-button-example/package.json.tmp "$1"/examples/amazon-pay-button-example/package.json

echo "Installing root pnpm"
pnpm -C "$1" i