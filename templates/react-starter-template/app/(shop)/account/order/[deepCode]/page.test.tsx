import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import DeepLinkOrderPage, { metadata } from "./page";

describe("DeepLinkOrderPage", () => {
  it("is titled as an order and kept out of search engines", () => {
    expect(metadata.title).toBe("Order");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders the loading skeleton on the server, since the order is looked up in the browser", async () => {
    const html = await renderToHtml(
      <DeepLinkOrderPage params={Promise.resolve({ deepCode: "deep-1" })} />,
    );

    expect(html).toContain('data-testid="loading"');
    expect(html).not.toContain("<form");
    expect(html).not.toContain('data-testid="order-total"');
  });
});
