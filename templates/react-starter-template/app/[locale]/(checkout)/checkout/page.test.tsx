import { beforeEach, describe, expect, it, vi } from "vitest";

import { germany } from "@/components/form/countries.fixture";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";
import { renderToHtml } from "@/test/render";

import CheckoutPage, { generateMetadata } from "./page";

const content = vi.hoisted(() => ({
  props: [] as Array<{
    countries: CountryOption[];
    countriesUnavailable: boolean;
  }>,
}));

vi.mock("server-only", () => ({}));

vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));

vi.mock("@/features/checkout/components/CheckoutPageContent", () => ({
  CheckoutPageContent: (props: {
    countries: CountryOption[];
    countriesUnavailable: boolean;
  }) => {
    content.props.push(props);
    return null;
  },
}));

vi.mock("@/platform/shopware/loadCountryOptions", () => ({
  loadCountryOptions: vi.fn(),
}));

beforeEach(() => {
  content.props = [];
  vi.mocked(loadCountryOptions).mockReset();
});

describe("CheckoutPage", () => {
  it("is titled in the page locale", async () => {
    const english = await generateMetadata({
      params: Promise.resolve({ locale: "en-GB" }),
    });
    const german = await generateMetadata({
      params: Promise.resolve({ locale: "de-DE" }),
    });

    expect(english).toEqual({ title: "Checkout" });
    expect(german).toEqual({ title: "Kasse" });
  });

  it("loads the countries for the page locale and hands them to the checkout", async () => {
    vi.mocked(loadCountryOptions).mockResolvedValue({
      countries: [germany],
      countriesUnavailable: false,
    });

    await renderToHtml(
      <CheckoutPage params={Promise.resolve({ locale: "pl-PL" })} />,
    );

    expect(loadCountryOptions).toHaveBeenCalledExactlyOnceWith(
      "pl-PL",
      "Checkout",
    );
    expect(content.props).toEqual([
      { countries: [germany], countriesUnavailable: false },
    ]);
  });

  it("hands the unavailable state to the checkout when the countries cannot be read", async () => {
    vi.mocked(loadCountryOptions).mockResolvedValue({
      countries: [],
      countriesUnavailable: true,
    });

    await renderToHtml(
      <CheckoutPage params={Promise.resolve({ locale: "de-DE" })} />,
    );

    expect(content.props).toEqual([
      { countries: [], countriesUnavailable: true },
    ]);
  });
});
