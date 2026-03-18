#!/usr/bin/env bash
# run-benchmark.sh — Run all benchmark specs against one or more models
# Usage:
#   ./tools/run-benchmark.sh [model]           # Run one model (default: all models)
#   ./tools/run-benchmark.sh --all             # Run all installed models
#   ./tools/run-benchmark.sh qwen3.5:27b       # Run specific model
#
# Results saved to tools/.worker-results/benchmark_<timestamp>/

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$REPO_ROOT"

OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
SPECS_DIR="tools/specs"
RESULTS_DIR="tools/.worker-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BENCH_DIR="${RESULTS_DIR}/benchmark_${TIMESTAMP}"

mkdir -p "$BENCH_DIR"

# ── Determine models to test ─────────────────────────────
if [[ "${1:-}" == "--all" ]]; then
    models=$(curl -s "${OLLAMA_URL}/api/tags" | jq -r '.models[].name')
elif [[ -n "${1:-}" ]]; then
    models="$*"
else
    echo "Usage: ./tools/run-benchmark.sh [model|--all]"
    echo ""
    echo "Available models:"
    curl -s "${OLLAMA_URL}/api/tags" | jq -r '.models[] | "  \(.name) (\(.details.parameter_size // "?"))"'
    exit 0
fi

# ── Collect benchmark specs (bench-* only) ────────────────
specs=$(ls ${SPECS_DIR}/bench-*.json 2>/dev/null || true)
spec_count=$(echo "$specs" | wc -l)

if [[ -z "$specs" ]]; then
    echo "❌ No benchmark specs found in ${SPECS_DIR}/bench-*.json"
    exit 1
fi

echo "╔════════════════════════════════════════════════════╗"
echo "║  LOCAL MODEL BENCHMARK SUITE                      ║"
echo "╠════════════════════════════════════════════════════╣"
echo "║  Specs: ${spec_count}                                        ║"
echo "║  Output: ${BENCH_DIR}  ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# ── CSV header ────────────────────────────────────────────
csv_file="${BENCH_DIR}/results.csv"
echo "model,spec_id,difficulty,time_s,prompt_tokens,gen_tokens,tok_per_sec,followed_format,valid_blocks,has_extraneous_text,quality_notes" > "$csv_file"

# ── Summary markdown ──────────────────────────────────────
summary_file="${BENCH_DIR}/SUMMARY.md"
cat > "$summary_file" <<'HDR'
# Benchmark Results

| Model | Task | Difficulty | Time | Tokens | tok/s | Format | Blocks | Extra Text | Notes |
|-------|------|-----------|------|--------|-------|--------|--------|------------|-------|
HDR

# ── Run benchmarks ────────────────────────────────────────
for model in $models; do
    echo ""
    echo "━━━ MODEL: ${model} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Warmup: load model into memory (skip for cloud models)
    if [[ "$model" != *":cloud"* ]]; then
        echo "🔄 Warming up ${model}..."
        curl -s -X POST "${OLLAMA_URL}/api/chat" \
            -H "Content-Type: application/json" \
            -d "{\"model\":\"${model}\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}],\"stream\":false,\"options\":{\"num_predict\":1}}" > /dev/null 2>&1 || true
    else
        echo "☁️  Cloud model — skipping warmup"
    fi

    for spec_file in $specs; do
        spec_id=$(jq -r '.id' "$spec_file")
        difficulty=$(jq -r '.difficulty // "unknown"' "$spec_file")
        task=$(jq -r '.task' "$spec_file")

        echo ""
        echo "  📋 [${spec_id}] ${task:0:80}..."

        # Build result filename
        safe_model=$(echo "$model" | tr ':/' '__')
        result_file="${BENCH_DIR}/${safe_model}__${spec_id}.md"

        # Run the worker (capture output)
        start_time=$(date +%s)
        output=$(bash tools/qwen-worker.sh "$spec_file" "$model" 2>&1) || true
        end_time=$(date +%s)
        elapsed=$((end_time - start_time))

        # Copy the latest result
        latest_result=$(ls -t ${RESULTS_DIR}/result_*.md 2>/dev/null | head -1)
        if [[ -n "$latest_result" ]]; then
            cp "$latest_result" "$result_file"
        fi

        # Parse metrics from output (use -oE for Windows compat)
        tok_sec=$(echo "$output" | grep -oE '[0-9.]+ tok/s' | head -1 | grep -oE '[0-9.]+' | head -1 || echo "0")
        gen_tokens=$(echo "$output" | grep -oE '[0-9]+ tokens' | head -1 | grep -oE '[0-9]+' | head -1 || echo "0")
        followed_format="NO"
        valid_blocks="0"
        has_extraneous_text="YES"

        # Read actual metrics from result file
        if [[ -f "$result_file" ]]; then
            prompt_tokens=$(grep -oE '[0-9]+ prompt' "$result_file" | grep -oE '[0-9]+' | head -1 || echo "0")
            gen_tokens_file=$(grep -oE '[0-9]+ generated' "$result_file" | grep -oE '[0-9]+' | head -1 || echo "0")
            tok_sec_file=$(grep -oE '[0-9.]+ tok/s' "$result_file" | grep -oE '[0-9.]+' | head -1 || echo "0")
            [[ -n "$gen_tokens_file" ]] && gen_tokens="$gen_tokens_file"
            [[ -n "$tok_sec_file" ]] && tok_sec="$tok_sec_file"
            [[ -n "$prompt_tokens" ]] || prompt_tokens="0"

            evaluation=$(node tools/evaluate-worker-result.mjs "$result_file")
            followed_format=$(echo "$evaluation" | jq -r '.followed_format')
            valid_blocks=$(echo "$evaluation" | jq -r '.valid_blocks')
            has_extraneous_text=$(echo "$evaluation" | jq -r '.has_extraneous_text')
        else
            prompt_tokens="0"
        fi

        echo "  ✅ ${elapsed}s | ${gen_tokens} tok | ${tok_sec} tok/s | format: ${followed_format} | blocks: ${valid_blocks} | extra: ${has_extraneous_text}"

        # Append to CSV
        echo "${model},${spec_id},${difficulty},${elapsed},${prompt_tokens},${gen_tokens},${tok_sec},${followed_format},${valid_blocks},${has_extraneous_text}," >> "$csv_file"

        # Append to summary
        echo "| ${model} | ${spec_id} | ${difficulty} | ${elapsed}s | ${gen_tokens} | ${tok_sec} | ${followed_format} | ${valid_blocks} | ${has_extraneous_text} | |" >> "$summary_file"
    done
done

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║  BENCHMARK COMPLETE                               ║"
echo "╠════════════════════════════════════════════════════╣"
echo "║  CSV:     ${csv_file}"
echo "║  Summary: ${summary_file}"
echo "╚════════════════════════════════════════════════════╝"
echo ""
cat "$summary_file"
