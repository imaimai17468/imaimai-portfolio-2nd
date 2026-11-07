#!/bin/sh
# Writes the pages and hypersig.js, then the font subset to the pages' text.
set -eu
cd "$(dirname "$0")/.."
cargo run --quiet --manifest-path generator/Cargo.toml
uv run --quiet --no-project --with 'fonttools[woff]' python -I scripts/subset_fonts.py
