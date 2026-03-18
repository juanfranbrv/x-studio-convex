#!/usr/bin/env bash
# qwen-worker.sh — Delegate coding tasks to Ollama models (local or cloud)
# Usage:
#   ./tools/qwen-worker.sh <spec-file> [model] [--apply]
#
# spec-file: JSON with { task, files[], output_format }
# model:     ollama model name (default: qwen3.5:9b)
#            use ":cloud" suffix for Ollama Cloud (e.g. glm-5:cloud)
# --apply:   auto-apply file changes to worktree (default: dry-run)
#
# Cloud setup:
#   Set OLLAMA_API_KEY env var (get it from ollama.com)
#   Cloud models auto-detect by ":cloud" suffix or OLLAMA_URL=https://ollama.com

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$REPO_ROOT"

OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
DEFAULT_MODEL="qwen3.5:9b"
RESULTS_DIR="tools/.worker-results"

spec_file="${1:?Usage: qwen-worker.sh <spec-file> [model] [--apply]}"
model="${2:-$DEFAULT_MODEL}"
apply_mode=false
[[ "${3:-}" == "--apply" ]] && apply_mode=true

mkdir -p "$RESULTS_DIR"
timestamp=$(date +%Y%m%d_%H%M%S)
result_file="$RESULTS_DIR/result_${timestamp}.md"

# ── Read spec ──────────────────────────────────────────────
if ! command -v jq &>/dev/null; then
    echo "❌ jq is required. Install: choco install jq / scoop install jq"
    exit 1
fi

task=$(jq -r '.task' "$spec_file")
output_format=$(jq -r '.output_format // "diff"' "$spec_file")
files_json=$(jq -r '.files[]' "$spec_file" 2>/dev/null || true)
inline_context=$(jq -r '.inline_context // ""' "$spec_file")

# ── Build context from files ───────────────────────────────
context=""
if [[ -n "$files_json" ]]; then
    while IFS= read -r filepath; do
        filepath="${filepath//$'\r'/}"
        [[ -z "$filepath" ]] && continue
        if [[ -f "$filepath" ]]; then
            content=$(cat "$filepath")
            context+="
--- FILE: ${filepath} ---
${content}
--- END FILE ---
"
        else
            context+="
--- FILE: ${filepath} (NOT FOUND) ---
"
        fi
    done <<< "$files_json"
fi

# ── Append inline context if present ──────────────────────
if [[ -n "$inline_context" ]]; then
    context+="
--- INLINE CONTEXT ---
${inline_context}
--- END INLINE CONTEXT ---
"
fi

# ── System prompt ──────────────────────────────────────────
system_prompt='You are a precise coding assistant. You receive a task spec and file contents.

RULES:
1. Output ONLY the requested changes, no explanations unless asked.
2. For file edits, output a structured block per file:

```edit:path/to/file
<<<< SEARCH
exact lines to find
====
replacement lines
>>>> END
```

3. You may output multiple edit blocks.
4. Match indentation exactly.
5. If a file needs to be created, use:

```create:path/to/file
file contents here
```

6. Never invent code you are unsure about. If the task is unclear, output ONLY: UNCLEAR: <your question>
7. Keep changes minimal — do exactly what is asked, nothing more.'

# ── Build the user message ─────────────────────────────────
user_msg="TASK:
${task}

CONTEXT FILES:
${context}

OUTPUT FORMAT: ${output_format}"

system_file=$(mktemp)
user_file=$(mktemp)
payload_file=$(mktemp)
trap 'rm -f "$system_file" "$user_file" "$payload_file"' EXIT
printf '%s' "$system_prompt" > "$system_file"
printf '%s' "$user_msg" > "$user_file"

# ── Detect cloud mode ─────────────────────────────────────
is_cloud=false
auth_header=""
if [[ "$model" == *":cloud"* ]] || [[ "$OLLAMA_URL" == *"ollama.com"* ]]; then
    is_cloud=true
    OLLAMA_URL="https://ollama.com"
    if [[ -n "${OLLAMA_API_KEY:-}" ]]; then
        auth_header="-H \"Authorization: Bearer ${OLLAMA_API_KEY}\""
    else
        echo "⚠️  Cloud mode detected but OLLAMA_API_KEY not set. Trying without auth..."
    fi
fi

# ── Call Ollama ────────────────────────────────────────────
if [[ "$is_cloud" == true ]]; then
    echo "☁️  Sending to Ollama Cloud: ${model}..."
else
    echo "🤖 Sending to local: ${model}..."
fi
echo "📋 Task: ${task:0:120}..."

payload=$(jq -n \
    --arg model "$model" \
    --rawfile system "$system_file" \
    --rawfile user "$user_file" \
    '{
        model: $model,
        messages: [
            { role: "system", content: $system },
            { role: "user", content: $user }
        ],
        stream: false,
        options: {
            temperature: 0.2,
            num_predict: 4096
        }
    }')
printf '%s' "$payload" > "$payload_file"

start_time=$(date +%s)

if [[ -n "$auth_header" ]]; then
    response=$(curl -s -X POST "${OLLAMA_URL}/api/chat" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${OLLAMA_API_KEY}" \
        --data-binary "@${payload_file}")
else
    response=$(curl -s -X POST "${OLLAMA_URL}/api/chat" \
        -H "Content-Type: application/json" \
        --data-binary "@${payload_file}")
fi

end_time=$(date +%s)
elapsed=$((end_time - start_time))

# ── Parse response ─────────────────────────────────────────
if echo "$response" | jq -e '.error' &>/dev/null 2>&1; then
    error=$(echo "$response" | jq -r '.error')
    echo "❌ Ollama error: $error"
    exit 1
fi

reply=$(echo "$response" | jq -r '.message.content // "NO RESPONSE"')
eval_count=$(echo "$response" | jq -r '.eval_count // 0')
prompt_tokens=$(echo "$response" | jq -r '.prompt_eval_count // 0')
tokens_per_sec=$(echo "$response" | jq -r '
    if .eval_duration and .eval_duration > 0 then
        (.eval_count / .eval_duration * 1000000000 * 100 | floor) / 100
    else 0 end
')

# ── Save result ────────────────────────────────────────────
cat > "$result_file" <<RESULT_EOF
# Worker Result — ${timestamp}

**Model**: ${model}
**Time**: ${elapsed}s
**Tokens**: ${prompt_tokens} prompt → ${eval_count} generated (${tokens_per_sec} tok/s)
**Task**: ${task:0:200}

## Response

${reply}
RESULT_EOF

# ── Output ─────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Done in ${elapsed}s | ${eval_count} tokens | ${tokens_per_sec} tok/s"
echo "📄 Result: ${result_file}"
echo "═══════════════════════════════════════════════"
echo ""
echo "$reply"
