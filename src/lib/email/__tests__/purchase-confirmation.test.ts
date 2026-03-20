import { describe, expect, it } from "vitest";

import { buildCreditsPurchaseEmailJob } from "../purchase-confirmation";

describe("credits purchase confirmation email", () => {
  it("no genera envio si la compra ya estaba completada", () => {
    const job = buildCreditsPurchaseEmailJob({
      alreadyCompleted: true,
      userEmail: "postlaboratorycorreo@gmail.com",
      credits: 30,
      packName: "Studio Pack",
      actionUrl: "https://postlaboratory.com/settings#credits",
    });

    expect(job).toBeNull();
  });

  it("genera el envio si la compra se completa por primera vez", () => {
    const job = buildCreditsPurchaseEmailJob({
      alreadyCompleted: false,
      userEmail: "postlaboratorycorreo@gmail.com",
      credits: 30,
      packName: "Studio Pack",
      actionUrl: "https://postlaboratory.com/settings#credits",
    });

    expect(job).not.toBeNull();
    expect(job?.to).toBe("postlaboratorycorreo@gmail.com");
    expect(job?.template).toBe("creditsPurchased");
    expect(job?.props.credits).toBe(30);
    expect(job?.props.packName).toBe("Studio Pack");
  });
});
