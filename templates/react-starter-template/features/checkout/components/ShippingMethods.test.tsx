import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";
import { renderToHtml } from "@/test/render";

import { shippingMethod, shippingMethods } from "../checkout.fixture";
import { ShippingMethods } from "./ShippingMethods";

function radio(html: string, value: string): string {
  const match = html.match(new RegExp(`<input[^>]*value="${value}"[^>]*/>`));
  expect(match, value).not.toBeNull();
  return match?.[0] ?? "";
}

function render(methods: Schemas["ShippingMethod"][], selected: string | null) {
  return renderToHtml(
    <ShippingMethods
      legend="Shipping"
      shippingMethods={methods}
      selectedShippingMethod={selected}
      onChange={() => {}}
    />,
  );
}

describe("ShippingMethods", () => {
  it("renders one labelled native radio per method inside a named group", async () => {
    const html = await render(shippingMethods, "shipping-express");

    expect(html).toMatch(
      /^<fieldset[^>]*><legend class="sr-only">Shipping<\/legend>/,
    );
    expect(html.match(/data-testid="checkout-shipping-method"/g)).toHaveLength(
      2,
    );
    expect(html).toContain('<label for="shipping-method-shipping-standard"');
    const standard = radio(html, "shipping-standard");
    expect(standard).toContain('id="shipping-method-shipping-standard"');
    expect(standard).toContain('type="radio"');
    expect(standard).toContain('name="shipping-method"');
    expect(standard).not.toContain("checked");
    const express = radio(html, "shipping-express");
    expect(express).toContain('id="shipping-method-shipping-express"');
    expect(express).toContain('checked=""');
    expect(html).toContain(">Standard</span>");
    expect(html).toContain(">Express</span>");
  });

  it("shows the delivery time and the method icon", async () => {
    const html = await render(
      [
        shippingMethod({
          deliveryTime: { translated: { name: "1-3 days" } },
          media: { url: "https://cdn.test/dhl.svg" },
        } as Partial<Schemas["ShippingMethod"]>),
      ],
      null,
    );

    expect(html).toContain(">1-3 days</span>");
    expect(html).toMatch(
      /<img src="https:\/\/cdn.test\/dhl.svg" alt="Standard"/,
    );
  });
});
