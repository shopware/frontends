import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import AccountOrdersPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

describe("AccountOrdersPage", () => {
  it("is titled like the Vue orders page in the page locale", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "en-GB" }) }),
    ).toEqual({ title: "Orders" });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "pl-PL" }) }),
    ).toEqual({ title: "Zamówienia" });
  });

  it("renders the header and the loading list on the server, since the orders are read in the browser", async () => {
    const html = await renderToHtml(<AccountOrdersPage />);

    expect(html).toContain("Orders</h1>");
    expect(html).toContain("View your current and past orders");
    expect(html).toContain('data-testid="orders-loading"');
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("<article");
  });

  it("renders the header in the provider locale", async () => {
    const html = await renderToHtml(withI18n(<AccountOrdersPage />, "de-DE"));

    expect(html).toContain("Bestellungen</h1>");
  });
});
