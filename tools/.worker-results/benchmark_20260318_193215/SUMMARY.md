# Benchmark Results

| Model | Task | Difficulty | Time | Tokens | tok/s | Format | Blocks | Extra Text | Notes |
|-------|------|-----------|------|--------|-------|--------|--------|------------|-------|
| gpt-oss:20b | 01-simple-edit | easy | 9s | 335 | 40.76 | YES | 1 | NO | |
| gpt-oss:20b | 02-refactor | medium | 68s | 2583 | 39.11 | YES | 1 | NO | |
| gpt-oss:20b | 03-generate-type | medium | 16s | 570 | 39.85 | YES | 1 | NO | |
| gpt-oss:20b | 04-test-gen | hard | 27s | 999 | 39.42 | YES | 1 | NO | |
| gpt-oss:20b | 05-multi-file | hard | 14s | 520 | 40.25 | YES | 2 | NO | |
| gpt-oss:20b | 06-i18n-save-preset-dialog | easy | 31s | 892 | 33.47 | YES | 1 | NO | |
| gpt-oss:20b | 07-logger-branding-configurator | medium | 67s | 2273 | 35.53 | YES | 9 | NO | |
| gpt-oss:20b | 08-i18n-creation-flow-batch | medium | 158s | 4096 | 27.11 | NO | 0 | NO | |
| gpt-oss:20b | 09-benchmark-harness-meta | medium | 110s | 4096 | 37.91 | NO | 0 | NO | |
| gpt-oss:20b | 10-logger-analyze-brand-dna | hard | 197s | 4096 | 22.09 | PARTIAL | 4 | YES | |
| gpt-oss:20b | 11-i18n-carousel-page | hard | 180s | 4096 | 23.96 | NO | 0 | NO | |
