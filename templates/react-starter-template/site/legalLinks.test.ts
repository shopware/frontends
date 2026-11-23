import { describe, expect, it } from "vitest";

import { LEGAL_LINKS } from "./legalLinks";

describe("LEGAL_LINKS", () => {
  it("links no page until the shop sets one", () => {
    expect(LEGAL_LINKS).toEqual({ terms: null, revocation: null });
  });
});
