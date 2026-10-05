import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";
import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import { salesChannelContext } from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import { renderToHtml } from "@/test/render";

import { Price } from "./Price";

function withCurrency(isoCode: string) {
  return toStorefrontSession({
    ...salesChannelContext(null),
    currency: { isoCode } as Schemas["Currency"],
  });
}

describe("Price", () => {
  it("formats the value in euros for the en-GB locale before the session is read", async () => {
    const html = await renderToHtml(
      <Price value={1234.5} className="font-bold" data-testid="cart-total" />,
    );

    expect(html).toBe(
      '<span class="font-bold" data-testid="cart-total">€1,234.50</span>',
    );
  });

  it("uses the currency of the session context", async () => {
    const html = await renderToHtml(
      <SessionProvider session={withCurrency("GBP")}>
        <Price value={10} data-testid="order-total" />
      </SessionProvider>,
    );

    expect(html).toBe('<span data-testid="order-total">£10.00</span>');
  });

  it("falls back to euros for a context without a currency", async () => {
    const html = await renderToHtml(
      <SessionProvider session={toStorefrontSession(salesChannelContext(null))}>
        <Price value={0} />
      </SessionProvider>,
    );

    expect(html).toBe("<span>€0.00</span>");
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
  ])("renders nothing for %s", async (_, value) => {
    const html = await renderToHtml(
      <SessionProvider session={anonymousSession}>
        <Price value={value} data-testid="cart-subtotal" />
      </SessionProvider>,
    );

    expect(html).toBe("");
  });
});
