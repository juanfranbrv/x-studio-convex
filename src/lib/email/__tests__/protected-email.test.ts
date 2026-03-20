import { describe, expect, it } from "vitest";

import {
  getProtectedContactEmail,
  getProtectedContactMailto,
} from "../protected-email";

describe("protected contact email", () => {
  it("reconstruye el email oficial", () => {
    expect(getProtectedContactEmail()).toBe("mail@postlaboratory.com");
  });

  it("genera el mailto correspondiente", () => {
    expect(getProtectedContactMailto()).toBe("mailto:mail@postlaboratory.com");
  });
});
