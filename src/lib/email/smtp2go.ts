import { ConvexHttpClient } from "convex/browser";

import { api } from "../../../convex/_generated/api";
import { log } from "../logger";

const SMTP2GO_ENDPOINT = "https://api.smtp2go.com/v3/email/send";
const SMTP2GO_SETTING_KEY = "provider_smtp2go_api_key";
const DEFAULT_FROM = "Post Laboratory <mail@postlaboratory.com>";
const DEFAULT_REPLY_TO = "mail@postlaboratory.com";
const DEFAULT_BASE_URL = "http://127.0.0.1:3000";

export type TransactionalEmailTemplate =
  | "welcome"
  | "betaApproved"
  | "creditsPurchased";

type TemplateLocale = "es" | "en";

type TemplateProps = {
  name?: string;
  actionUrl?: string;
  credits?: number;
  packName?: string;
};

type RenderEmailInput = {
  template: TransactionalEmailTemplate;
  locale?: TemplateLocale;
  props?: TemplateProps;
};

type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

type BuildPayloadInput = {
  apiKey: string;
  from: string;
  replyTo?: string;
  to: string | string[];
  rendered: RenderedEmail;
};

type Smtp2goPayload = {
  api_key: string;
  sender: string;
  to: string[];
  subject: string;
  text_body: string;
  html_body: string;
  headers?: Array<{ header: string; value: string }>;
};

type SendTransactionalEmailInput = {
  to: string | string[];
  template: TransactionalEmailTemplate;
  locale?: TemplateLocale;
  props?: TemplateProps;
  from?: string;
  replyTo?: string;
};

function normalizeLocale(locale?: string): TemplateLocale {
  return locale === "en" ? "en" : "es";
}

function resolveBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    DEFAULT_BASE_URL
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmailLayout(content: {
  title: string;
  intro: string;
  ctaLabel: string;
  actionUrl: string;
  outro: string;
}) {
  const title = escapeHtml(content.title);
  const intro = escapeHtml(content.intro);
  const ctaLabel = escapeHtml(content.ctaLabel);
  const actionUrl = escapeHtml(content.actionUrl);
  const outro = escapeHtml(content.outro);

  const html = [
    "<div style=\"background:#f4f1ea;padding:32px;font-family:Georgia, 'Times New Roman', serif;color:#1f1a17;\">",
    "<div style=\"max-width:640px;margin:0 auto;background:#fffdf8;border:1px solid #e7dfd4;border-radius:18px;padding:32px;\">",
    "<p style=\"margin:0 0 12px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8a6d52;\">Post Laboratory</p>",
    `<h1 style=\"margin:0 0 16px;font-size:30px;line-height:1.15;\">${title}</h1>`,
    `<p style=\"margin:0 0 20px;font-size:16px;line-height:1.7;color:#40342c;\">${intro}</p>`,
    `<p style=\"margin:0 0 24px;\"><a href=\"${actionUrl}\" style=\"display:inline-block;background:#1f1a17;color:#fffdf8;text-decoration:none;padding:14px 20px;border-radius:999px;font-size:14px;font-weight:600;\">${ctaLabel}</a></p>`,
    `<p style=\"margin:0;font-size:14px;line-height:1.7;color:#6b5a4d;\">${outro}</p>`,
    "</div>",
    "</div>",
  ].join("");

  const text = [
    content.title,
    "",
    content.intro,
    "",
    `${content.ctaLabel}: ${content.actionUrl}`,
    "",
    content.outro,
  ].join("\n");

  return { html, text };
}

export function renderTransactionalEmail(input: RenderEmailInput): RenderedEmail {
  const locale = normalizeLocale(input.locale);
  const name = input.props?.name?.trim() || "creador";
  const actionUrl = input.props?.actionUrl?.trim() || resolveBaseUrl();
  const credits = input.props?.credits ?? 0;
  const packName = input.props?.packName?.trim() || "tu pack";

  if (input.template === "welcome") {
    const content =
      locale === "en"
        ? {
            subject: `Welcome to Post Laboratory, ${name}`,
            title: `Welcome, ${name}`,
            intro:
              "Your workspace is ready. You can now start generating visuals, testing flows and shaping your brand system from a single place.",
            ctaLabel: "Open studio",
            outro:
              "If you were expecting a different setup, this message confirms that your transactional email pipeline is working correctly.",
          }
        : {
            subject: `Bienvenido a Post Laboratory, ${name}`,
            title: `Bienvenido, ${name}`,
            intro:
              "Tu espacio ya está listo. Desde aquí puedes empezar a generar visuales, probar flujos y construir tu sistema de marca en un solo sitio.",
            ctaLabel: "Abrir estudio",
            outro:
              "Si esperabas una configuración distinta, este mensaje también sirve para confirmar que el pipeline de correo transaccional está funcionando.",
          };

    const rendered = renderEmailLayout({
      title: content.title,
      intro: content.intro,
      ctaLabel: content.ctaLabel,
      actionUrl,
      outro: content.outro,
    });
    return { subject: content.subject, ...rendered };
  }

  if (input.template === "betaApproved") {
    const content =
      locale === "en"
        ? {
            subject: "Your beta access is now active",
            title: "Your access has been approved",
            intro:
              "Your account can now enter the studio. This template is prepared for the beta approval flow if you decide to wire it later.",
            ctaLabel: "Enter Post Laboratory",
            outro:
              "If this email arrives during local testing, it means SMTP2GO and the template layer are correctly connected.",
          }
        : {
            subject: "Tu acceso beta ya está activo",
            title: "Tu acceso ha sido aprobado",
            intro:
              "Tu cuenta ya puede entrar al estudio. Esta plantilla queda preparada para el flujo de aprobación beta si decides conectarlo más adelante.",
            ctaLabel: "Entrar en Post Laboratory",
            outro:
              "Si este correo llega durante las pruebas locales, significa que SMTP2GO y la capa de plantillas están correctamente conectados.",
          };

    const rendered = renderEmailLayout({
      title: content.title,
      intro: content.intro,
      ctaLabel: content.ctaLabel,
      actionUrl,
      outro: content.outro,
    });
    return { subject: content.subject, ...rendered };
  }

  const content =
    locale === "en"
      ? {
          subject: `Credits added to your account: ${packName}`,
          title: "Credits purchase confirmed",
          intro: `${credits} credits from ${packName} have been added to your account and are now available in your balance.`,
          ctaLabel: "Review billing",
          outro:
            "This email confirms that your purchase has been processed correctly.",
        }
      : {
          subject: `Créditos añadidos a tu cuenta: ${packName}`,
          title: "Compra de créditos confirmada",
          intro: `Se han añadido ${credits} créditos a tu cuenta desde ${packName} y ya están disponibles en tu saldo.`,
          ctaLabel: "Revisar facturación",
          outro:
            "Este correo confirma que tu compra se ha procesado correctamente.",
        };

  const rendered = renderEmailLayout({
    title: content.title,
    intro: content.intro,
    ctaLabel: content.ctaLabel,
    actionUrl,
    outro: content.outro,
  });
  return { subject: content.subject, ...rendered };
}

export function buildSmtp2goPayload(input: BuildPayloadInput): Smtp2goPayload {
  const to = Array.isArray(input.to) ? input.to : [input.to];

  return {
    api_key: input.apiKey,
    sender: input.from,
    to,
    subject: input.rendered.subject,
    text_body: input.rendered.text,
    html_body: input.rendered.html,
    headers: input.replyTo
      ? [{ header: "Reply-To", value: input.replyTo }]
      : undefined,
  };
}

async function resolveSmtp2goApiKey() {
  const envValue = process.env.SMTP2GO_API_KEY?.trim();
  if (envValue) return envValue;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (!convexUrl) return "";

  try {
    const convex = new ConvexHttpClient(convexUrl);
    const value = await convex.query(api.admin.getSetting, { key: SMTP2GO_SETTING_KEY });
    return typeof value === "string" ? value.trim() : "";
  } catch (error) {
    log.warn("API", "[SMTP2GO] No se pudo resolver API key desde app_settings", {
      error: error instanceof Error ? error.message : String(error),
    });
    return "";
  }
}

export async function sendTransactionalEmail(input: SendTransactionalEmailInput) {
  const apiKey = await resolveSmtp2goApiKey();
  if (!apiKey) {
    throw new Error("SMTP2GO API key no configurada");
  }

  const rendered = renderTransactionalEmail({
    template: input.template,
    locale: input.locale,
    props: input.props,
  });

  const payload = buildSmtp2goPayload({
    apiKey,
    from: input.from || process.env.SMTP2GO_FROM?.trim() || DEFAULT_FROM,
    replyTo: input.replyTo || process.env.SMTP2GO_REPLY_TO?.trim() || DEFAULT_REPLY_TO,
    to: input.to,
    rendered,
  });

  const response = await fetch(SMTP2GO_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const raw = await response.text();
  let parsed: unknown = null;

  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = raw;
  }

  if (!response.ok) {
    log.error("API", "[SMTP2GO] Error enviando correo", {
      status: response.status,
      response: parsed,
    });
    throw new Error("SMTP2GO request failed");
  }

  log.success("API", "[SMTP2GO] Correo transaccional enviado", {
    template: input.template,
    to: Array.isArray(input.to) ? input.to.join(", ") : input.to,
  });

  return parsed;
}
