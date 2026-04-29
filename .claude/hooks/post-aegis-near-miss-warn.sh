#!/usr/bin/env bash
# PostToolUse(mcp__aegis__aegis_compile_context) hook:
# aegis_compile_context の返り値に glob_no_match の near_miss_edges が
# 含まれていたら、target_files と bash の extglob + globstar でクロスマッチし、
# bash でマッチするのに Aegis で glob_no_match されているケース (suspicious) のみを
# additionalContext で warning として注入する。
#
# 判定ロジック:
#   A) bash の extglob + globstar で target_files のいずれかとマッチする pattern
#      → Aegis と bash の glob 実装差異 = suspicious (bug 確定)
#   B) bash でもマッチしない → routine な未マッチ → スキップ
#   C) reason が command_mismatch → 常にスキップ
#
# 出力:
#   - suspicious 0 件 → exit 0 (無音)
#   - 1〜3 件 → 全件リスト
#   - 4 件以上 → 最初の 3 件 + 「他 N 件」省略表記

set -euo pipefail
shopt -s extglob globstar nullglob

INPUT=$(cat)

# tool_response がなければ素通り
TOOL_RESPONSE=$(printf '%s' "$INPUT" | jq -r 'if .tool_response then "present" else "absent" end' 2>/dev/null || true)
if [ "${TOOL_RESPONSE:-absent}" = "absent" ]; then
  exit 0
fi

# target_files を配列に取り出す
mapfile -t TARGET_FILES < <(printf '%s' "$INPUT" | jq -r '.tool_input.target_files // [] | .[]' 2>/dev/null || true)

# near_miss_edges から glob_no_match かつ command_mismatch でないものだけ抽出
NEAR_MISS_JSON=$(printf '%s' "$INPUT" | jq -c '
  .tool_response.debug_info.near_miss_edges // []
  | map(select(.reason == "glob_no_match"))
' 2>/dev/null || true)

EDGE_COUNT=$(printf '%s' "$NEAR_MISS_JSON" | jq 'length' 2>/dev/null || true)

if [ -z "$EDGE_COUNT" ] || [ "$EDGE_COUNT" -eq 0 ]; then
  exit 0
fi

# target_files が空なら素通り
if [ "${#TARGET_FILES[@]}" -eq 0 ]; then
  exit 0
fi

# suspicious な near_miss を収集する
SUSPICIOUS_ITEMS=()

while IFS= read -r EDGE; do
  PATTERN=$(printf '%s' "$EDGE" | jq -r '.pattern // ""')
  DOC_ID=$(printf '%s' "$EDGE" | jq -r '.target_doc_id // "unknown"')

  if [ -z "$PATTERN" ]; then
    continue
  fi

  # 各 target_file に対して bash の extglob + globstar でマッチ判定
  MATCHED=false
  for TARGET in "${TARGET_FILES[@]}"; do
    # shellcheck disable=SC2053
    if [[ "$TARGET" == $PATTERN ]]; then
      MATCHED=true
      break
    fi
  done

  if [ "$MATCHED" = "true" ]; then
    SUSPICIOUS_ITEMS+=("  - pattern: ${PATTERN} → doc_id: ${DOC_ID}")
  fi
done < <(printf '%s' "$NEAR_MISS_JSON" | jq -c '.[]' 2>/dev/null || true)

SUSPICIOUS_COUNT="${#SUSPICIOUS_ITEMS[@]}"

if [ "$SUSPICIOUS_COUNT" -eq 0 ]; then
  exit 0
fi

# メッセージ組み立て
if [ "$SUSPICIOUS_COUNT" -le 3 ]; then
  LIST=$(printf '%s\n' "${SUSPICIOUS_ITEMS[@]}")
  SUFFIX=""
else
  LIST=$(printf '%s\n' "${SUSPICIOUS_ITEMS[0]}" "${SUSPICIOUS_ITEMS[1]}" "${SUSPICIOUS_ITEMS[2]}")
  REMAINING=$(( SUSPICIOUS_COUNT - 3 ))
  SUFFIX="
  ...他 ${REMAINING} 件 (詳細は debug_info.near_miss_edges を直接参照)"
fi

CONTEXT="[Aegis near_miss_edges 警告] 以下の edge_hint は bash (extglob + globstar) では target_files にマッチするにもかかわらず、Aegis 側で glob_no_match となっています。Aegis の glob 実装バグの可能性があります。\`aegis_observe({event_type: \"compile_miss\", ...})\` で報告するか、admin surface (aegis_import_doc / edge 編集) で edge_hint の glob パターンを修正してください。

該当 edge_hint:
${LIST}${SUFFIX}"

jq -n --arg ctx "$CONTEXT" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $ctx
  }
}'
