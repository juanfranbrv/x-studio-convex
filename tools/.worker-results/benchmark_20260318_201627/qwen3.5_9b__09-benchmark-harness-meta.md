# Worker Result — 20260318_202558

**Model**: qwen3.5:9b
**Time**: 71s
**Tokens**: 2717 prompt → 1286 generated (18.66 tok/s)
**Task**: Improve the benchmark harness so format compliance is evaluated from the saved result markdown instead of stdout heuristics. The summary should distinguish YES, PARTIAL, UNCLEAR and NO, and report val

## Response

```edit:path:tools/run-benchmark.sh
<<<< SEARCH
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
=======
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
            gen_tokens="0"
            tok_sec="0"
            followed_format="NO"
            valid_blocks="0"
            has_extraneous_text="YES"
        fi
>>>> END

```
