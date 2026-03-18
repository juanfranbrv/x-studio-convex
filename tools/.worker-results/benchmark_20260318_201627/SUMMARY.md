# Benchmark Results

| Model | Task | Difficulty | Time | Tokens | tok/s | Format | Blocks | Extra Text | Notes |
|-------|------|-----------|------|--------|-------|--------|--------|------------|-------|
| qwen3.5:9b | 01-simple-edit | easy | 17s | 304 | 18.99 | YES | 1 | NO | |
| qwen3.5:9b | 02-refactor | medium | 54s | 1003 | 19.03 | NO | 0 | NO | |
| qwen3.5:9b | 03-generate-type | medium | 31s | 571 | 19.31 | YES | 1 | NO | |
| qwen3.5:9b | 04-test-gen | hard | 42s | 781 | 19.23 | YES | 1 | NO | |
| qwen3.5:9b | 05-multi-file | hard | 22s | 413 | 19.56 | NO | 0 | YES | |
| qwen3.5:9b | 06-i18n-save-preset-dialog | easy | 89s | 1307 | 16.16 | YES | 1 | NO | |
| qwen3.5:9b | 07-logger-branding-configurator | medium | 69s | 1076 | 17.15 | NO | 0 | NO | |
| qwen3.5:9b | 08-i18n-creation-flow-batch | medium | 232s | 3149 | 14.4 | YES | 3 | NO | |
| qwen3.5:9b | 09-benchmark-harness-meta | medium | 71s | 1286 | 18.66 | YES | 1 | NO | |
| qwen3.5:9b | 10-logger-analyze-brand-dna | hard | 350s | 4096 | 12.49 | NO | 0 | NO | |
| qwen3.5:9b | 11-i18n-carousel-page | hard | 908s | 4096 | 4.59 | NO | 0 | YES | |
