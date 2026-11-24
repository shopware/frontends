import { beforeEach, describe, expect, it, vi } from "vitest";

import { OrderDetailsPageContent } from "@/features/account/orders/components/OrderDetailsPageContent";
import { loadShopSettings } from "@/platform/shopware/loadShopSettings";
import { shopSettings } from "@/platform/shopware/shopSettings.fixture";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import AccountOrderDetailsPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));

vi.mock("@/platform/shopware/loadShopSettings", () => ({
  loadShopSettings: vi.fn(),
}));

vi.mock(
  "@/features/account/orders/components/OrderDetailsPageContent",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/features/account/orders/components/OrderDetailsPageContent")
      >();
    return {
      ...actual,
      OrderDetailsPageContent: vi.fn(actual.OrderDetailsPageContent),
    };
  },
);

beforeEach(() => {
  vi.mocked(OrderDetailsPageContent).mockClear();
  vi.mocked(loadShopSettings).mockReset();
  vi.mocked(loadShopSettings).mockResolvedValue(shopSettings());
});

describe("AccountOrderDetailsPage", () => {
  it("is titled as an order in the page locale", async () => {
    expect(
      await generateMetadata({
        params: Promise.resolve({ locale: "en-GB", id: "order-1" }),
      }),
    ).toEqual({ title: "Order" });
    expect(
      await generateMetadata({
        params: Promise.resolve({ locale: "pl-PL", id: "order-1" }),
      }),
    ).toEqual({ title: "Zamówienie" });
  });

  it("renders the back link and the loading skeleton on the server, since the order is read in the browser", async () => {
    const html = await renderToHtml(
      <AccountOrderDetailsPage
        params={Promise.resolve({ locale: "en-GB", id: "order-1" })}
      />,
    );

    expect(html).toContain('href="/account/order"');
    expect(html).toContain("Back to orders list");
    expect(html).toContain("Order</h1>");
    expect(html).toContain('data-testid="loading"');
    expect(html).not.toContain('data-testid="order-total"');
  });

  it("renders a prefixed Polish back link under pl-PL", async () => {
    const html = await renderToHtml(
      withI18n(
        <AccountOrderDetailsPage
          params={Promise.resolve({ locale: "pl-PL", id: "order-1" })}
        />,
        "pl-PL",
      ),
    );

    expect(html).toContain('href="/pl-PL/account/order"');
    expect(html).toContain("Powrót do listy zamówień");
    expect(html).toContain("Zamówienie</h1>");
  });

  it("passes the shop's order refund setting to the content", async () => {
    const params = Promise.resolve({ locale: "en-GB", id: "order-1" });
    vi.mocked(loadShopSettings).mockResolvedValue(
      shopSettings({ cart: { enableOrderRefunds: true } }),
    );

    await renderToHtml(<AccountOrderDetailsPage params={params} />);

    expect(loadShopSettings).toHaveBeenCalledTimes(1);
    expect(vi.mocked(OrderDetailsPageContent).mock.calls[0]?.[0]).toEqual({
      params,
      orderRefundsEnabled: true,
    });
  });
});
