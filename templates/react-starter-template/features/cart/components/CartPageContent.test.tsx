import { describe, expect, it, vi } from "vitest";

import CartPage, {
  generateMetadata,
} from "@/app/[locale]/(checkout)/checkout/cart/page";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

vi.mock("server-only", () => ({}));

describe("CartPage", () => {
  it("names the page after the cart", async () => {
    expect(
      (await generateMetadata({ params: Promise.resolve({ locale: "en-GB" }) }))
        .title,
    ).toBe("My cart");
    expect(
      (await generateMetadata({ params: Promise.resolve({ locale: "de-DE" }) }))
        .title,
    ).toBe("Mein Warenkorb");
  });

  it("renders the title and the loading skeleton on the server", async () => {
    const html = await renderToHtml(<CartPage />);

    expect(html).toMatch(/<h1[^>]*>My cart<\/h1>/);
    expect(html).toContain('data-testid="cart-page-skeleton"');
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("Your cart is empty");
    expect(html).not.toContain("checkout-product-tile-item");
    expect(html).not.toContain('href="/checkout"');
  });

  it("renders the Polish title", async () => {
    const html = await renderToHtml(withI18n(<CartPage />, "pl-PL"));

    expect(html).toMatch(/<h1[^>]*>Mój koszyk<\/h1>/);
  });
});
