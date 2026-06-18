#!/usr/bin/env bash
# Stop quality gate: run typecheck (tsgo) / biome / oxlint / oxfmt / knip / similarity in order,
# all treated as blocking. Any violation triggers decision:block to force a fix loop on Claude.

set -uo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$ROOT"

# Skip when there are no changes
if [ -z "$(git status --porcelain)" ]; then
  exit 0
fi

# ---- Layer 1: typecheck / biome / oxlint / oxfmt (blocking gate) ----
OUT=$(bun run typecheck 2>&1 && bun run check 2>&1 && bun run lint 2>&1 && bun run format 2>&1)
RC=$?
if [ $RC -ne 0 ]; then
  printf '%s' "$OUT" | jq -Rs '{
    systemMessage: "⛔ Stop block: typecheck / biome / oxlint / oxfmt failed",
    decision: "block",
    reason: ("Stop hook: typecheck / biome / oxlint / oxfmt failed. Fix before ending the turn.\n\n" + .)
  }'
  exit 0
fi

# ---- Layer 2: knip / similarity (blocking) ----
KNIP=$(bunx knip 2>&1 || true)
SIM_BIN="$HOME/.cargo/bin/similarity-ts"
SIM=$( ([ -x "$SIM_BIN" ] && "$SIM_BIN" ./src 2>&1) || true)

KNIP_HAS=$(printf '%s' "$KNIP" | grep -cE '^(Unused |Duplicate |Configuration |Unresolved )' || true)

# Filter out similarity findings where the source line has a similarity-ignore comment
SIM_UNIGNORED=0
if printf '%s' "$SIM" | grep -qE 'Total similar (type pairs|functions) found: [1-9]'; then
  while IFS= read -r loc; do
    file=$(printf '%s' "$loc" | sed 's/\.\///' | cut -d: -f1)
    line=$(printf '%s' "$loc" | cut -d: -f2)
    prev=$((line - 1))
    if [ "$prev" -ge 1 ] && [ -f "$file" ]; then
      prev_content=$(sed -n "${prev}p" "$file")
      case "$prev_content" in *similarity-ignore*) continue ;; esac
    fi
    SIM_UNIGNORED=$((SIM_UNIGNORED + 1))
  done <<< "$(printf '%s' "$SIM" | grep -oE '\./[^ ]+:[0-9]+' | sort -u)"
fi
SIM_HAS=$SIM_UNIGNORED

if [ "$KNIP_HAS" -gt 0 ] || [ "$SIM_HAS" -gt 0 ]; then
  KNIP_SUM=$(printf '%s' "$KNIP" | grep -E '^(Unused |Duplicate |Configuration |Unresolved )' | tr '\n' ' ' || true)
  SIM_SUM=$(printf '%s' "$SIM" | grep -oE 'Total similar type pairs found: [0-9]+|Total similar functions found: [0-9]+' | tr '\n' ' ' || true)
  SUM=""
  [ -n "$KNIP_SUM" ] && SUM="knip: ${KNIP_SUM}"
  [ -n "$SIM_SUM" ] && SUM="${SUM}| similarity: ${SIM_SUM}"

  DETAIL=""
  [ -n "$KNIP" ] && DETAIL="${DETAIL}=== knip output ===
${KNIP}

"
  [ -n "$SIM" ] && DETAIL="${DETAIL}=== similarity output ===
${SIM}
"

  printf '%s' "$DETAIL" | jq -Rs --arg sum "$SUM" '{
    systemMessage: ("⛔ Stop block: advisory findings — " + $sum),
    decision: "block",
    reason: (
      "Unused code / similar types detected. Address with one of the following:\n\n" +
      "## knip (unused code)\n" +
      "1. Delete if unnecessary\n" +
      "2. If kept intentionally (template usage, etc.), attach `/** @public <reason> */` JSDoc (for unused files, add to `ignore` in knip.json)\n\n" +
      "## similarity (similar types/functions)\n" +
      "Evaluate in this order — do NOT skip to similarity-ignore:\n" +
      "1. **Unify**: Can one type be deleted and the other reused? (e.g. export from the lower layer, import in the upper)\n" +
      "2. **Extract shared type**: If both layers need their own but share a common shape, extract the shared portion into a common module\n" +
      "3. **similarity-ignore**: ONLY when the types genuinely serve different domains and will diverge (e.g. DB schema vs API response that happen to match today). The comment MUST explain WHY unification is wrong, not just that they are 'different layers'\n\n" + .
    )
  }'
  exit 0
fi

# All clean
echo '{"systemMessage":"✅ Stop quality gate: typecheck / biome / oxlint pass (knip/similarity: clean)"}'
exit 0
