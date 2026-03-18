# Worker Result — 20260318_192812

**Model**: gpt-oss:20b
**Time**: 27s
**Tokens**: 778 prompt → 1020 generated (39.87 tok/s)
**Task**: Improve the benchmark harness so format compliance is evaluated from the saved result markdown instead of stdout heuristics. The summary should distinguish YES, PARTIAL, UNCLEAR and NO, and report val

## Response

```edit:tools/evaluate-worker-result.mjs
<<<< SEARCH
const responseMarker = '## Response';
const markerIndex = raw.indexOf(responseMarker);
const response = (markerIndex >= 0 ? raw.slice(markerIndex + responseMarker.length) : raw).trim();
====
const response = raw.trim();
>>>> END
```
