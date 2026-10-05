import { describe, expect, it } from "vitest";

import CartPage, { metadata } from "@/app/(checkout)/checkout/cart/page";
import { renderToHtml } from "@/test/render";

describe("CartPage", () => {
  it("names the page after the cart", () => {
    expect(metadata.title).toBe("My cart");
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
});
