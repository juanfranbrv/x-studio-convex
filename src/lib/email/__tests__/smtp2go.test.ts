import { describe, expect, it } from "vitest";

import {
  buildSmtp2goPayload,
  renderTransactionalEmail,
  type TransactionalEmailTemplate,
} from "../smtp2go";

describe("transactional email templates", () => {
  it("renderiza la plantilla welcome con asunto, html y texto", () => {
    const rendered = renderTransactionalEmail({
      template: "welcome",
      locale: "es",
      props: {
        name: "Juanfran",
        actionUrl: "https://postlaboratory.com/image",
      },
    });

    expect(rendered.subject).toContain("Bienvenido");
    expect(rendered.html).toContain("Juanfran");
    expect(rendered.html).toContain("https://postlaboratory.com/image");
    expect(rendered.text).toContain("Juanfran");
  });

  it("renderiza las plantillas soportadas sin contenido vacio", () => {
    const templates: TransactionalEmailTemplate[] = [
      "welcome",
      "betaApproved",
      "creditsPurchased",
    ];

    for (const template of templates) {
      const rendered = renderTransactionalEmail({
        template,
        locale: "es",
        props: {
          name: "Juanfran",
          actionUrl: "https://postlaboratory.com/settings",
          credits: 50,
          packName: "Pack Pro",
        },
      });

      expect(rendered.subject.trim().length).toBeGreaterThan(0);
      expect(rendered.html.trim().length).toBeGreaterThan(0);
      expect(rendered.text.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("SMTP2GO payload", () => {
  it("construye el payload con remitente, destino y reply-to", () => {
    const payload = buildSmtp2goPayload({
      apiKey: "api-test",
      from: "Post Laboratory <mail@postlaboratory.com>",
      replyTo: "mail@postlaboratory.com",
      to: "postlaboratorycorreo@gmail.com",
      rendered: {
        subject: "Hola",
        html: "<p>Hola</p>",
        text: "Hola",
      },
    });

    expect(payload.api_key).toBe("api-test");
    expect(payload.sender).toBe("Post Laboratory <mail@postlaboratory.com>");
    expect(payload.to).toEqual(["postlaboratorycorreo@gmail.com"]);
    expect(payload.text_body).toBe("Hola");
    expect(payload.html_body).toBe("<p>Hola</p>");
    expect(payload.headers).toEqual([{ header: "Reply-To", value: "mail@postlaboratory.com" }]);
  });
});
