import { describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import CheckoutSuccessPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

describe("CheckoutSuccessPage", () => {
  it("is titled as the order confirmation", () => {
    expect(metadata.title).toBe("Order confirmation");
  });

  it("renders the loading skeleton on the server, since the order is read in the browser", async () => {
    const html = await renderToHtml(
      <CheckoutSuccessPage params={Promise.resolve({ id: "order-1" })} />,
    );

    expect(html).toContain('data-testid="loading"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('<output class="sr-only">Loading...</output>');
    expect(html).not.toContain('data-testid="checkout-success-page"');
  });
});
