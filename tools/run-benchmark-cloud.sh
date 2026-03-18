#!/usr/bin/env bash
# run-benchmark-cloud.sh — Run benchmark specs against cloud LLM APIs
# Usage:
#   GROQ_API_KEY=xxx ./tools/run-benchmark-cloud.sh groq [model1 model2 ...]
#
# Default models per provider:
#   groq:      llama-3.3-70b-versatile, llama-4-scout-17b-16e-instruct
#   cerebras:  llama-3.3-70b
#   together:  meta-llama/Llama-3.3-70B-Instruct-Turbo
#   openrouter: meta-llama/llama-3.3-70b-instruct:free

set -euo pipefail

SPECS_DIR="tools/specs"
RESULTS_DIR="tools/.worker-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BENCH_DIR="${RESULTS_DIR}/benchmark_cloud_${TIMESTAMP}"

mkdir -p "$BENCH_DIR"

provider="${1:?Usage: run-benchmark-cloud.sh <provider> [model1 model2 ...]}"
shift

# ── Default models per provider ───────────────────────────
if [[ $# -eq 0 ]]; then
    case "$provider" in
        groq)     models=("llama-3.3-70b-versatile" "llama-4-scout-17b-16e-instruct") ;;
        cerebras) models=("llama-3.3-70b") ;;
        together) models=("meta-llama/Llama-3.3-70B-Instruct-Turbo") ;;
        openrouter) models=("meta-llama/llama-3.3-70b-instruct:free") ;;
        *) echo "❌ Unknown provider"; exit 1 ;;
    esac
else
    models=("$@")
fi

# ── Collect specs ─────────────────────────────────────────
specs=$(ls ${SPECS_DIR}/bench-*.json 2>/dev/null || true)
spec_count=$(echo "$specs" | wc -l)

echo "╔════════════════════════════════════════════════════╗"
echo "║  CLOUD MODEL BENCHMARK — ${provider^^}"
echo "╠════════════════════════════════════════════════════╣"
echo "║  Models: ${#models[@]}  |  Specs: ${spec_count}                     ║"
echo "║  Output: ${BENCH_DIR}"
echo "╚════════════════════════════════════════════════════╝"

# ── CSV + Summary ─────────────────────────────────────────
csv_file="${BENCH_DIR}/results.csv"
echo "provider,model,spec_id,difficulty,time_s,prompt_tokens,gen_tokens,tok_per_sec,followed_format" > "$csv_file"

summary_file="${BENCH_DIR}/SUMMARY.md"
cat > "$summary_file" <<'HDR'
# Cloud Benchmark Results

| Provider | Model | Task | Difficulty | Time | Gen Tokens | tok/s | Format OK |
|----------|-------|------|-----------|------|------------|-------|-----------|
HDR

# ── Run ───────────────────────────────────────────────────
for model in "${models[@]}"; do
    echo ""
    echo "━━━ ${provider}/${model} ━━━━━━━━━━━━━━━━━━━━━━━━━"

    for spec_file in $specs; do
        spec_id=$(jq -r '.id' "$spec_file")
        difficulty=$(jq -r '.difficulty // "unknown"' "$spec_file")
        task=$(jq -r '.task' "$spec_file")

        echo "  📋 [${spec_id}] ${task:0:80}..."

        safe_model=$(echo "$model" | tr '/:' '__')
        result_file="${BENCH_DIR}/${provider}__${safe_model}__${spec_id}.md"

        start_time=$(date +%s)
        output=$(bash tools/cloud-worker.sh "$spec_file" "$model" "$provider" 2>&1) || true
        end_time=$(date +%s)
        elapsed=$((end_time - start_time))

        # Copy latest result
        latest_result=$(ls -t ${RESULTS_DIR}/result_*.md 2>/dev/null | head -1)
        if [[ -n "$latest_result" ]]; then
            cp "$latest_result" "$result_file"
        fi

        # Parse
        gen_tokens=$(echo "$output" | grep -oP '(\d+) tokens' | head -1 | grep -oP '\d+' || echo "0")
        tok_sec=$(echo "$output" | grep -oP '~(\d+) tok/s' | grep -oP '\d+' || echo "0")
        prompt_tokens="0"
        if [[ -f "$result_file" ]]; then
            prompt_tokens=$(grep -oP '(\d+) prompt' "$result_file" | grep -oP '\d+' | head -1 || echo "0")
            gt=$(grep -oP '→ (\d+) generated' "$result_file" | grep -oP '\d+' || echo "0")
            [[ -n "$gt" ]] && gen_tokens="$gt"
        fi

        followed_format="?"
        if echo "$output" | grep -qP '(<<<< SEARCH|```edit:|```create:)'; then
            followed_format="YES"
        elif echo "$output" | grep -qP '(UNCLEAR:)'; then
            followed_format="UNCLEAR"
        else
            followed_format="NO"
        fi

        echo "  ✅ ${elapsed}s | ${gen_tokens} tok | ~${tok_sec} tok/s | format: ${followed_format}"

        echo "${provider},${model},${spec_id},${difficulty},${elapsed},${prompt_tokens},${gen_tokens},${tok_sec},${followed_format}" >> "$csv_file"
        echo "| ${provider} | ${model} | ${spec_id} | ${difficulty} | ${elapsed}s | ${gen_tokens} | ${tok_sec} | ${followed_format} |" >> "$summary_file"

        # Rate limit protection (free tiers)
        sleep 3
    done
done

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║  CLOUD BENCHMARK COMPLETE                         ║"
echo "╚════════════════════════════════════════════════════╝"
cat "$summary_file"
