import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";
import { testTranslator } from "@/test/i18n";

import {
  emptyCheckoutTerms,
  hasDigitalLineItem,
  validateCheckoutTerms,
} from "./checkoutTerms";
import { cartLineItem } from "./checkoutTestDoubles";

const t = testTranslator();

function digitalPayload(): Schemas["LineItem"]["payload"] {
  return {
    productType: "digital",
  } as unknown as Schemas["LineItem"]["payload"];
}

describe("hasDigitalLineItem", () => {
  it("finds no digital item in a physical cart or an empty one", () => {
    expect(hasDigitalLineItem([cartLineItem()])).toBe(false);
    expect(
      hasDigitalLineItem([cartLineItem({ states: ["is-physical"] })]),
    ).toBe(false);
    expect(hasDigitalLineItem([])).toBe(false);
    expect(hasDigitalLineItem(undefined)).toBe(false);
  });

  it("finds a digital product by its product type or its download state", () => {
    expect(
      hasDigitalLineItem([
        cartLineItem(),
        cartLineItem({ id: "line-2", payload: digitalPayload() }),
      ]),
    ).toBe(true);
    expect(
      hasDigitalLineItem([cartLineItem({ states: ["is-download"] })]),
    ).toBe(true);
  });

  it("finds a digital product inside a container line item", () => {
    expect(
      hasDigitalLineItem([
        cartLineItem({
          type: "container",
          children: [cartLineItem({ id: "child", payload: digitalPayload() })],
        }),
      ]),
    ).toBe(true);
  });
});

describe("validateCheckoutTerms", () => {
  const none = { revocation: false, dataProtection: false };

  it("always requires the terms and conditions", () => {
    expect(validateCheckoutTerms(emptyCheckoutTerms, none, t)).toEqual({
      tos: "Please accept the general terms and conditions to place your order.",
    });
    expect(
      validateCheckoutTerms({ ...emptyCheckoutTerms, tos: true }, none, t),
    ).toEqual({});
  });

  it("requires the revocation waiver and the data protection only when asked", () => {
    const all = { revocation: true, dataProtection: true };

    expect(validateCheckoutTerms(emptyCheckoutTerms, all, t)).toEqual({
      tos: "Please accept the general terms and conditions to place your order.",
      revocation:
        "Please confirm this to get immediate access to the digital content.",
      dataProtection:
        "Please confirm that you have read the data protection information.",
    });
    expect(
      validateCheckoutTerms(
        { tos: true, revocation: true, dataProtection: true },
        all,
        t,
      ),
    ).toEqual({});
  });

  it("returns Polish messages with the Polish translator", () => {
    expect(
      validateCheckoutTerms(
        emptyCheckoutTerms,
        { revocation: false, dataProtection: true },
        testTranslator("pl-PL"),
      ),
    ).toEqual({
      tos: "Zaakceptuj ogólne warunki handlowe, aby złożyć zamówienie.",
      dataProtection:
        "Potwierdź zapoznanie się z informacjami o ochronie danych.",
    });
  });
});
