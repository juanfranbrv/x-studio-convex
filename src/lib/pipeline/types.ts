export type StyleFamily =
  | "photo"
  | "line_art"
  | "watercolor"
  | "oil_paint"
  | "3d_cartoon"
  | "anime"
  | "cartoon2d"
  | "other";

export interface StyleDNA {
  version: "1.0";
  source: "reference_image_analysis";
  family: StyleFamily;
  render_medium: string;
  line_quality?: string;
  shading?: string;
  lighting?: string;
  texture?: string;
  color_behavior?: string;
  positives: string[];
  negatives: string[];
}

export interface BrandLock {
  language: "es";
  palette: {
    fondo: string;
    texto: string;
    acento: string;
  };
  backgroundIsAbsolute: boolean;
  logo?: {
    enabled: boolean;
    position: "bottom-right";
    sizePctH: number;
    maxWidthPct: number;
  };
  textRules: {
    allowOnlyTextField: boolean;
    forbidExtraText: boolean;
  };
}

export interface LayoutSpec {
  blueprintId: string;
  rules: string[];
}

export interface NarrativeOut {
  slide: number;
  subject: string;
  context?: string;
  emotion?: string[];
}

export type NarrativeRawOut = NarrativeOut;

export interface NarrativeLintReport {
  removedTokens: string[];
  changed: boolean;
  byField: Record<string, string[]>;
  byCategory: Record<string, string[]>;
}

export interface SanitizedNarrativeOut extends NarrativeOut {
  lint: NarrativeLintReport;
  __sanitized: true;
}

export interface StyleToBrandAdapterOut {
  applicationRules: string[];
  materialTranslationRules: string[];
  degradationPolicy: {
    tierA_nonnegotiable: string[];
    tierB_prefer: string[];
    tierC_optional: string[];
  };
}

export interface CompiledPromptInput {
  brand: BrandLock;
  style: StyleDNA;
  adapter: StyleToBrandAdapterOut;
  layout: LayoutSpec;
  narrative: SanitizedNarrativeOut;
  text: {
    headline: string;
    body: string;
    cta?: string;
    url?: string;
  };
}

export interface CompiledPrompt {
  slide: number;
  prompt: string;
}
