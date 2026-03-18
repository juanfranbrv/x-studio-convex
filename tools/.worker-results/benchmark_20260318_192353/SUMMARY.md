# Benchmark Results

| Model | Task | Difficulty | Time | Tokens | tok/s | Format | Blocks | Extra Text | Notes |
|-------|------|-----------|------|--------|-------|--------|--------|------------|-------|
| gpt-oss:20b | 01-simple-edit | easy | 19s | 713 | 39.77 | YES | 1 | NO | |
| gpt-oss:20b | 02-refactor | medium | 44s | 1706 | 39.27 | YES | 1 | NO | |
| gpt-oss:20b | 03-generate-type | medium | 14s | 544 | 39.81 | YES | 1 | NO | |
| gpt-oss:20b | 04-test-gen | hard | 20s | 775 | 39.54 | YES | 1 | NO | |
| gpt-oss:20b | 05-multi-file | hard | 23s | 855 | 39.76 | PARTIAL | 2 | NO | |
| gpt-oss:20b | 06-i18n-save-preset-dialog | easy | 102s | 3627 | 36.56 | NO | 0 | YES | |
| gpt-oss:20b | 07-logger-branding-configurator | medium | 5s | 141 | 39.91 | UNCLEAR | 0 | YES | |
| gpt-oss:20b | 08-i18n-creation-flow-batch | medium | 12s | 315 | 37.84 | UNCLEAR | 0 | YES | |
| gpt-oss:20b | 09-benchmark-harness-meta | medium | 27s | 1020 | 39.87 | YES | 1 | NO | |
| gpt-oss:20b | 10-logger-analyze-brand-dna | hard | 7s | 195 | 39.43 | UNCLEAR | 0 | YES | |
| gpt-oss:20b | 11-i18n-carousel-page | hard | 18s | 635 | 39.04 | UNCLEAR | 0 | YES | |
