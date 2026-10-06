import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import AccountOrderDetailsPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

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
});
