import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { CheckoutHeader } from "./CheckoutHeader";

vi.mock("server-only", () => ({}));

describe("CheckoutHeader", () => {
  it("links the logo and the continue-shopping action to the homepage", async () => {
    const html = await renderToHtml(<CheckoutHeader locale="en-GB" />);

    expect(html).toMatch(
      /<a [^>]*href="\/"[^>]*><img [^>]*alt="Shopware Frontends Demo Store"/,
    );
    expect(html).toMatch(/<a [^>]*href="\/"[^>]*>Continue Shopping<\/a>/);
  });

  it("speaks Polish and links to the Polish homepage", async () => {
    const html = await renderToHtml(
      withI18n(<CheckoutHeader locale="pl-PL" />, "pl-PL"),
    );

    expect(html).toMatch(
      /<a [^>]*href="\/pl-PL"[^>]*><img [^>]*alt="Shopware Frontends Demo Store"/,
    );
    expect(html).toMatch(/<a [^>]*href="\/pl-PL"[^>]*>Kontynuuj zakupy<\/a>/);
  });

  it("always shows the language switcher above the checkout bar", async () => {
    const html = await renderToHtml(<CheckoutHeader locale="en-GB" />);

    expect(html).toMatch(/<button type="button" aria-expanded="false"/);
    expect(html).toContain('<span lang="en-GB">English</span>');
    expect(html.indexOf('aria-expanded="false"')).toBeLessThan(
      html.indexOf('alt="Shopware Frontends Demo Store"'),
    );
  });
});
