import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import AccountOrdersPage, { metadata } from "./page";

describe("AccountOrdersPage", () => {
  it("is titled like the Vue orders page", () => {
    expect(metadata.title).toBe("Orders");
  });

  it("renders the header and the loading list on the server, since the orders are read in the browser", async () => {
    const html = await renderToHtml(<AccountOrdersPage />);

    expect(html).toContain("Orders</h1>");
    expect(html).toContain("View your current and past orders");
    expect(html).toContain('data-testid="orders-loading"');
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("<article");
  });
});
