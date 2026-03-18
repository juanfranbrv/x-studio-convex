#!/usr/bin/env bash
# cloud-worker.sh — Delegate coding tasks to cloud LLM APIs (OpenAI-compatible)
# Usage:
#   ./tools/cloud-worker.sh <spec-file> [model] [provider]
#
# Providers: groq, cerebras, together, openrouter
# Each needs its API key set as env var:
#   GROQ_API_KEY, CEREBRAS_API_KEY, TOGETHER_API_KEY, OPENROUTER_API_KEY
#
# Examples:
#   GROQ_API_KEY=gsk_xxx ./tools/cloud-worker.sh tools/specs/bench-01-simple-edit.json llama-3.3-70b-versatile groq
#   ./tools/cloud-worker.sh tools/specs/bench-01-simple-edit.json meta-llama/llama-4-scout-17b-16e-instruct openrouter

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$REPO_ROOT"

RESULTS_DIR="tools/.worker-results"

spec_file="${1:?Usage: cloud-worker.sh <spec-file> [model] [provider]}"
model="${2:-llama-3.3-70b-versatile}"
provider="${3:-groq}"

mkdir -p "$RESULTS_DIR"
timestamp=$(date +%Y%m%d_%H%M%S)
result_file="$RESULTS_DIR/result_${timestamp}.md"

# ── Provider config ───────────────────────────────────────
case "$provider" in
    groq)
        api_key="${GROQ_API_KEY:?Set GROQ_API_KEY}"
        api_url="https://api.groq.com/openai/v1/chat/completions"
        ;;
    cerebras)
        api_key="${CEREBRAS_API_KEY:?Set CEREBRAS_API_KEY}"
        api_url="https://api.cerebras.ai/v1/chat/completions"
        ;;
    together)
        api_key="${TOGETHER_API_KEY:?Set TOGETHER_API_KEY}"
        api_url="https://api.together.xyz/v1/chat/completions"
        ;;
    openrouter)
        api_key="${OPENROUTER_API_KEY:?Set OPENROUTER_API_KEY}"
        api_url="https://openrouter.ai/api/v1/chat/completions"
        ;;
    *)
        echo "❌ Unknown provider: $provider (use: groq, cerebras, together, openrouter)"
        exit 1
        ;;
esac

# ── Read spec ─────────────────────────────────────────────
if ! command -v jq &>/dev/null; then
    echo "❌ jq is required"
    exit 1
fi

task=$(jq -r '.task' "$spec_file")
output_format=$(jq -r '.output_format // "diff"' "$spec_file")
files_json=$(jq -r '.files[]' "$spec_file" 2>/dev/null || true)
inline_context=$(jq -r '.inline_context // ""' "$spec_file")

# ── Build context from files ──────────────────────────────
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

if [[ -n "$inline_context" ]]; then
    context+="
--- INLINE CONTEXT ---
${inline_context}
--- END INLINE CONTEXT ---
"
fi

# ── System prompt ─────────────────────────────────────────
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

# ── Build the user message ────────────────────────────────
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

# ── Call API ──────────────────────────────────────────────
echo "🌐 Sending to ${provider}/${model}..."
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
        temperature: 0.2,
        max_tokens: 4096
    }')
printf '%s' "$payload" > "$payload_file"

start_time=$(date +%s)

response=$(curl -s -X POST "$api_url" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${api_key}" \
    --data-binary "@${payload_file}")

end_time=$(date +%s)
elapsed=$((end_time - start_time))

# ── Parse response ────────────────────────────────────────
error=$(echo "$response" | jq -r '.error.message // empty' 2>/dev/null || true)
if [[ -n "$error" ]]; then
    echo "❌ API error: $error"
    echo "$response" | jq . 2>/dev/null || echo "$response"
    exit 1
fi

reply=$(echo "$response" | jq -r '.choices[0].message.content // "NO RESPONSE"')
prompt_tokens=$(echo "$response" | jq -r '.usage.prompt_tokens // 0')
gen_tokens=$(echo "$response" | jq -r '.usage.completion_tokens // 0')
total_tokens=$(echo "$response" | jq -r '.usage.total_tokens // 0')

# Calculate tok/s
if [[ $elapsed -gt 0 ]]; then
    tok_per_sec=$(( gen_tokens / elapsed ))
else
    tok_per_sec="$gen_tokens"
fi

# ── Save result ───────────────────────────────────────────
cat > "$result_file" <<RESULT_EOF
# Worker Result — ${timestamp}

**Provider**: ${provider}
**Model**: ${model}
**Time**: ${elapsed}s
**Tokens**: ${prompt_tokens} prompt → ${gen_tokens} generated (~${tok_per_sec} tok/s)
**Task**: ${task:0:200}

## Response

${reply}
RESULT_EOF

# ── Output ────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Done in ${elapsed}s | ${gen_tokens} tokens | ~${tok_per_sec} tok/s"
echo "📄 Result: ${result_file}"
echo "═══════════════════════════════════════════════"
echo ""
echo "$reply"
