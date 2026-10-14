import { describe, expect, it } from "vitest";

import { testTranslator } from "@/test/i18n";

import { cartNotifications, cartResultMessages } from "./useLineItemActions";

const en = testTranslator("en-GB");

describe("cartNotifications", () => {
  it("takes the toast type from the error level", () => {
    expect(
      cartNotifications(
        {
          ok: true,
          errors: [
            { messageKey: "product-not-found", level: 20 },
            { messageKey: "payment-method-blocked", level: 10 },
            { messageKey: "promotion-excluded", level: 0 },
            { messageKey: "billing-address-invalid" },
          ],
        },
        en,
      ).map(({ type }) => type),
    ).toEqual(["error", "warning", "info", "error"]);
  });

  it("resolves the template message with the error params", () => {
    expect(
      cartNotifications(
        {
          ok: true,
          errors: [
            {
              messageKey: "promotion-not-found",
              params: { promotionCode: "NOPE" },
              level: 20,
            },
            {
              messageKey: "promotion-not-eligible-already-added",
              params: { name: "SUMMER" },
              level: 0,
            },
          ],
        },
        en,
      ),
    ).toEqual([
      {
        type: "error",
        message: "Promotion with code NOPE could not be found.",
      },
      {
        type: "info",
        message:
          'The promotion for code "SUMMER" has already been added to your cart. A promotion can only be applied once per order.',
      },
    ]);
  });

  it("falls back to the backend translation, then to the message", () => {
    expect(
      cartNotifications(
        {
          ok: true,
          errors: [
            {
              messageKey: "custom-plugin-error",
              params: {
                translatedMessage: "Übersetzter Text",
                message: "Raw text",
              },
            },
            {
              messageKey: "custom-plugin-error",
              params: {
                translatedMessage: "checkout.custom-plugin-error",
                message: "Raw text",
              },
            },
            {
              messageKey: "custom-plugin-error",
              params: { translatedMessage: "", message: "Raw text" },
            },
            {
              messageKey: "salutation-missing-billing-address",
              params: {
                translatedMessage: 'Please set one <a href="%url%">here</a>.',
              },
            },
            { messageKey: "custom-plugin-error" },
          ],
        },
        en,
      ).map(({ message }) => message),
    ).toEqual([
      "Übersetzter Text",
      "Raw text",
      "Raw text",
      "Please set one here.",
    ]);
  });

  it("prefers the template message over the backend translation", () => {
    expect(
      cartNotifications(
        {
          ok: true,
          errors: [
            {
              messageKey: "product-not-found",
              params: { translatedMessage: "Backend text" },
            },
          ],
        },
        en,
      ),
    ).toEqual([{ type: "error", message: "The product could not be found." }]);
  });

  it("reports the failure message only without cart errors", () => {
    expect(
      cartNotifications({ ok: false, message: "Request failed" }, en),
    ).toEqual([{ type: "error", message: "Request failed" }]);
    expect(
      cartNotifications(
        {
          ok: false,
          message: "Request failed",
          errors: [{ messageKey: "product-not-found", level: 10 }],
        },
        en,
      ),
    ).toEqual([
      { type: "warning", message: "The product could not be found." },
    ]);
    expect(cartNotifications({ ok: false }, en)).toEqual([]);
    expect(cartNotifications({ ok: true, message: "Ignored" }, en)).toEqual([]);
  });

  it("speaks the translator's language", () => {
    expect(
      cartNotifications(
        {
          ok: true,
          errors: [
            {
              messageKey: "promotion-not-eligible-not-logged-in",
              level: 0,
            },
          ],
        },
        testTranslator("de-DE"),
      ),
    ).toEqual([
      {
        type: "info",
        message: "Bitte melden Sie sich an, um diesen Gutschein einzulösen.",
      },
    ]);
  });
});

describe("cartResultMessages", () => {
  it("returns the messages of the notifications", () => {
    expect(
      cartResultMessages(
        {
          ok: true,
          errors: [
            {
              messageKey: "product-stock-reached",
              params: { name: "Lamp", quantity: 3 },
              level: 10,
            },
            { messageKey: "unknown-code", params: { message: "Backend text" } },
          ],
        },
        en,
      ),
    ).toEqual(["The product Lamp is only available 3 times", "Backend text"]);
  });
});
