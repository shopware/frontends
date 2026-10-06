import { describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import DeepLinkOrderPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

describe("DeepLinkOrderPage", () => {
  it("is titled as an order in the page locale and kept out of search engines", async () => {
    expect(
      await generateMetadata({
        params: Promise.resolve({ locale: "en-GB", deepCode: "deep-1" }),
      }),
    ).toEqual({ title: "Order", robots: { index: false, follow: false } });
    expect(
      await generateMetadata({
        params: Promise.resolve({ locale: "de-DE", deepCode: "deep-1" }),
      }),
    ).toEqual({ title: "Bestellung", robots: { index: false, follow: false } });
  });

  it("renders the loading skeleton on the server, since the order is looked up in the browser", async () => {
    const html = await renderToHtml(
      <DeepLinkOrderPage
        params={Promise.resolve({ locale: "en-GB", deepCode: "deep-1" })}
      />,
    );

    expect(html).toContain('data-testid="loading"');
    expect(html).not.toContain("<form");
    expect(html).not.toContain('data-testid="order-total"');
  });
});
