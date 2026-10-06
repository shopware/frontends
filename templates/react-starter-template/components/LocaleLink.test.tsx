import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { LocaleLink } from "./LocaleLink";

describe("LocaleLink", () => {
  it("keeps internal paths unprefixed for the default locale and without a provider", async () => {
    expect(
      await renderToHtml(<LocaleLink href="/account">Account</LocaleLink>),
    ).toBe('<a href="/account">Account</a>');
    expect(
      await renderToHtml(withI18n(<LocaleLink href="/">Home</LocaleLink>)),
    ).toBe('<a href="/">Home</a>');
  });

  it.each([
    ["/", "/pl-PL"],
    [
      "/account/login?redirect=%2Fcheckout",
      "/pl-PL/account/login?redirect=%2Fcheckout",
    ],
    ["/pl-PL/account", "/pl-PL/account"],
    ["https://shopware.com/", "https://shopware.com/"],
    ["#main", "#main"],
  ])("renders %s as %s under pl-PL", async (href, expected) => {
    const html = await renderToHtml(
      withI18n(<LocaleLink href={href}>Link</LocaleLink>, "pl-PL"),
    );

    expect(html).toBe(`<a href="${expected}">Link</a>`);
  });

  it("prefixes the pathname of a URL object", async () => {
    const html = await renderToHtml(
      withI18n(
        <LocaleLink href={{ pathname: "/checkout", query: { step: "2" } }}>
          Checkout
        </LocaleLink>,
        "de-DE",
      ),
    );

    expect(html).toBe('<a href="/de-DE/checkout?step=2">Checkout</a>');
  });

  it("passes the other props to the link", async () => {
    const html = await renderToHtml(
      withI18n(
        <LocaleLink
          href="/checkout/cart"
          className="font-bold"
          data-testid="checkout-cart-link"
          prefetch={false}
        >
          Cart
        </LocaleLink>,
        "de-DE",
      ),
    );

    expect(html).toBe(
      '<a class="font-bold" data-testid="checkout-cart-link" href="/de-DE/checkout/cart">Cart</a>',
    );
  });
});
