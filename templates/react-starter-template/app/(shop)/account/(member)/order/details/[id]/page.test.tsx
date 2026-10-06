import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import AccountOrderDetailsPage, { metadata } from "./page";

describe("AccountOrderDetailsPage", () => {
  it("is titled as an order", () => {
    expect(metadata.title).toBe("Order");
  });

  it("renders the back link and the loading skeleton on the server, since the order is read in the browser", async () => {
    const html = await renderToHtml(
      <AccountOrderDetailsPage params={Promise.resolve({ id: "order-1" })} />,
    );

    expect(html).toContain('href="/account/order"');
    expect(html).toContain("Back to orders list");
    expect(html).toContain("Order</h1>");
    expect(html).toContain('data-testid="loading"');
    expect(html).not.toContain('data-testid="order-total"');
  });
});
