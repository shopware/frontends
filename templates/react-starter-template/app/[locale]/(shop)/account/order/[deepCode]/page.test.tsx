import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeepLinkOrderPageContent } from "@/features/account/orders/components/DeepLinkOrderPageContent";
import { loadShopSettings } from "@/platform/shopware/loadShopSettings";
import { shopSettings } from "@/platform/shopware/shopSettings.fixture";
import { renderToHtml } from "@/test/render";

import DeepLinkOrderPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));

vi.mock("@/platform/shopware/loadShopSettings", () => ({
  loadShopSettings: vi.fn(),
}));

vi.mock(
  "@/features/account/orders/components/DeepLinkOrderPageContent",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/features/account/orders/components/DeepLinkOrderPageContent")
      >();
    return {
      ...actual,
      DeepLinkOrderPageContent: vi.fn(actual.DeepLinkOrderPageContent),
    };
  },
);

beforeEach(() => {
  vi.mocked(DeepLinkOrderPageContent).mockClear();
  vi.mocked(loadShopSettings).mockReset();
  vi.mocked(loadShopSettings).mockResolvedValue(shopSettings());
});

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

  it("passes the shop's order refund setting to the content", async () => {
    const params = Promise.resolve({ locale: "en-GB", deepCode: "deep-1" });
    vi.mocked(loadShopSettings).mockResolvedValue(
      shopSettings({ cart: { enableOrderRefunds: true } }),
    );

    await renderToHtml(<DeepLinkOrderPage params={params} />);

    expect(loadShopSettings).toHaveBeenCalledTimes(1);
    expect(vi.mocked(DeepLinkOrderPageContent).mock.calls[0]?.[0]).toEqual({
      params,
      orderRefundsEnabled: true,
    });
  });

  it("keeps cancellation off on a backend without the setting", async () => {
    await renderToHtml(
      <DeepLinkOrderPage
        params={Promise.resolve({ locale: "en-GB", deepCode: "deep-1" })}
      />,
    );

    expect(
      vi.mocked(DeepLinkOrderPageContent).mock.calls[0]?.[0],
    ).toMatchObject({ orderRefundsEnabled: false });
  });
});
