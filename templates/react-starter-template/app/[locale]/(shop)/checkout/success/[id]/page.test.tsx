import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import CheckoutSuccessPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

function params(locale: string) {
  return Promise.resolve({ locale, id: "order-1" });
}

describe("CheckoutSuccessPage", () => {
  it("is titled as the order confirmation", async () => {
    expect((await generateMetadata({ params: params("en-GB") })).title).toBe(
      "Order confirmation",
    );
  });

  it("translates the title for the URL locale", async () => {
    expect((await generateMetadata({ params: params("pl-PL") })).title).toBe(
      "Potwierdzenie zamówienia",
    );
    expect((await generateMetadata({ params: params("de-DE") })).title).toBe(
      "Bestellbestätigung",
    );
  });

  it("renders the loading skeleton on the server, since the order is read in the browser", async () => {
    const html = await renderToHtml(
      <CheckoutSuccessPage params={params("en-GB")} />,
    );

    expect(html).toContain('data-testid="loading"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('<output class="sr-only">Loading...</output>');
    expect(html).not.toContain('data-testid="checkout-success-page"');
  });

  it("announces the loading state in Polish", async () => {
    const html = await renderToHtml(
      withI18n(<CheckoutSuccessPage params={params("pl-PL")} />, "pl-PL"),
    );

    expect(html).toContain('<output class="sr-only">Ładowanie...</output>');
  });
});
