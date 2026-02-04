import { ALL_FORBIDDEN_TOKENS, FORBIDDEN_TOKEN_GROUPS } from "./forbiddenTokens";
import type {
  NarrativeOut,
  NarrativeLintReport,
  SanitizedNarrativeOut,
} from "./types";

export type RegenerateNarrativeFn = (params: {
  reason: string;
  previous: NarrativeOut;
}) => Promise<NarrativeOut>;

export type GuidanceLintReport = NarrativeLintReport;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTokenRegex(token: string): RegExp {
  const escaped = escapeRegExp(token.trim());
  if (!escaped) return /$a/;
  const hasLetterOrDigit = /[A-Za-z0-9]/.test(escaped);
  const boundary = hasLetterOrDigit ? "\\b" : "";
  return new RegExp(`${boundary}${escaped}${boundary}`, "gi");
}

function cleanSpacing(value: string): string {
  return value.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
}

function findAndStripTokens(input: string): {
  cleaned: string;
  removed: string[];
  byCategory: Record<string, string[]>;
} {
  let cleaned = input;
  const removed: string[] = [];
  const byCategory: Record<string, string[]> = {};

  for (const [category, tokens] of Object.entries(FORBIDDEN_TOKEN_GROUPS)) {
    for (const token of tokens) {
      const regex = buildTokenRegex(token);
      if (regex.test(cleaned)) {
        removed.push(token);
        if (!byCategory[category]) byCategory[category] = [];
        byCategory[category].push(token);
        cleaned = cleaned.replace(regex, "");
      }
    }
  }

  cleaned = cleanSpacing(cleaned);
  return { cleaned, removed, byCategory };
}

function isCoherentSubject(subject: string): boolean {
  const compact = subject.trim();
  if (compact.length < 3) return false;
  return /[A-Za-z0-9]/.test(compact);
}

function mergeCategoryMaps(
  target: Record<string, string[]>,
  source: Record<string, string[]>
) {
  for (const [category, tokens] of Object.entries(source)) {
    if (!target[category]) target[category] = [];
    target[category].push(...tokens);
  }
}

function finalizeLintReport(params: {
  removedTokens: string[];
  byField: Record<string, string[]>;
  byCategory: Record<string, string[]>;
  changed: boolean;
}): NarrativeLintReport {
  const uniqueRemoved = Array.from(new Set(params.removedTokens));
  const uniqueByField: Record<string, string[]> = {};
  const uniqueByCategory: Record<string, string[]> = {};

  for (const [field, tokens] of Object.entries(params.byField)) {
    uniqueByField[field] = Array.from(new Set(tokens));
  }

  for (const [category, tokens] of Object.entries(params.byCategory)) {
    uniqueByCategory[category] = Array.from(new Set(tokens));
  }

  return {
    removedTokens: uniqueRemoved,
    changed: params.changed || uniqueRemoved.length > 0,
    byField: uniqueByField,
    byCategory: uniqueByCategory,
  };
}

export function sanitizeTextField(input: string, field: string) {
  const result = findAndStripTokens(input);
  const byField = result.removed.length > 0 ? { [field]: result.removed } : {};
  return {
    cleaned: result.cleaned,
    removedTokens: result.removed,
    byField,
    byCategory: result.byCategory,
    changed: result.cleaned !== input || result.removed.length > 0,
  };
}

export function sanitizeGuidance(input: string | undefined) {
  if (!input) {
    return {
      cleaned: "",
      lint: finalizeLintReport({
        removedTokens: [],
        byField: {},
        byCategory: {},
        changed: false,
      }),
    };
  }

  const result = sanitizeTextField(input, "guidance");
  return {
    cleaned: result.cleaned,
    lint: finalizeLintReport({
      removedTokens: result.removedTokens,
      byField: result.byField,
      byCategory: result.byCategory,
      changed: result.changed,
    }),
  };
}

export async function sanitizeNarrative(
  narrative: NarrativeOut,
  options?: {
    regenerate?: RegenerateNarrativeFn;
    extraFields?: Record<string, string | undefined>;
  }
): Promise<SanitizedNarrativeOut> {
  const byField: Record<string, string[]> = {};
  const byCategory: Record<string, string[]> = {};
  const removedTokens: string[] = [];

  const subjectResult = sanitizeTextField(narrative.subject, "subject");
  removedTokens.push(...subjectResult.removedTokens);
  mergeCategoryMaps(byCategory, subjectResult.byCategory);
  if (Object.keys(subjectResult.byField).length > 0) {
    byField.subject = subjectResult.removedTokens;
  }

  const contextResult = narrative.context
    ? sanitizeTextField(narrative.context, "context")
    : null;
  if (contextResult) {
    removedTokens.push(...contextResult.removedTokens);
    mergeCategoryMaps(byCategory, contextResult.byCategory);
    if (Object.keys(contextResult.byField).length > 0) {
      byField.context = contextResult.removedTokens;
    }
  }

  let emotionCleaned = narrative.emotion;
  if (narrative.emotion && narrative.emotion.length > 0) {
    const emotionRemoved: string[] = [];
    const emotionByCategory: Record<string, string[]> = {};
    const cleanedItems = narrative.emotion.map((entry) => {
      const res = sanitizeTextField(entry, "emotion");
      emotionRemoved.push(...res.removedTokens);
      mergeCategoryMaps(emotionByCategory, res.byCategory);
      return res.cleaned;
    });
    emotionCleaned = cleanedItems.filter((entry) => entry.trim().length > 0);
    if (emotionRemoved.length > 0) {
      byField.emotion = emotionRemoved;
      removedTokens.push(...emotionRemoved);
      mergeCategoryMaps(byCategory, emotionByCategory);
    }
  }

  if (options?.extraFields) {
    for (const [field, value] of Object.entries(options.extraFields)) {
      if (!value) continue;
      const result = sanitizeTextField(value, field);
      if (result.removedTokens.length > 0) {
        byField[field] = result.removedTokens;
        removedTokens.push(...result.removedTokens);
        mergeCategoryMaps(byCategory, result.byCategory);
      }
    }
  }

  const changed =
    subjectResult.changed ||
    (contextResult ? contextResult.changed : false) ||
    removedTokens.length > 0;

  const lint = finalizeLintReport({
    removedTokens,
    byField,
    byCategory,
    changed,
  });

  const sanitized: SanitizedNarrativeOut = {
    ...narrative,
    subject: subjectResult.cleaned,
    context: contextResult ? contextResult.cleaned : narrative.context,
    emotion: emotionCleaned,
    lint,
    __sanitized: true,
  };

  if (!isCoherentSubject(sanitized.subject) && options?.regenerate) {
    const retry = await options.regenerate({
      reason:
        "Subject incoherente tras sanitizacion (se eliminaron tokens esteticos o quedo vacio).",
      previous: narrative,
    });
    return sanitizeNarrative(retry, { regenerate: undefined });
  }

  return sanitized;
}

export function containsForbiddenTokens(value: string): boolean {
  const lower = value.toLowerCase();
  return ALL_FORBIDDEN_TOKENS.some((token) => lower.includes(token));
}
