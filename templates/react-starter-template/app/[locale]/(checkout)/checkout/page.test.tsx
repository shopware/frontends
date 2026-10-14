import { beforeEach, describe, expect, it, vi } from "vitest";

import { germany } from "@/components/form/countries.fixture";
import type { LegalLinks } from "@/features/checkout/checkoutSettings";
import type { CheckoutPageContentProps } from "@/features/checkout/components/CheckoutPageContent";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";
import { loadShopSettings } from "@/platform/shopware/loadShopSettings";
import { shopSettings } from "@/platform/shopware/shopSettings.fixture";
import { renderToHtml } from "@/test/render";

import CheckoutPage, { generateMetadata } from "./page";

const content = vi.hoisted(() => ({
  props: [] as CheckoutPageContentProps[],
}));

const legal = vi.hoisted(() => ({
  links: { terms: null, revocation: null } as LegalLinks,
}));

vi.mock("server-only", () => ({}));

vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));

vi.mock("@/features/checkout/components/CheckoutPageContent", () => ({
  CheckoutPageContent: (props: CheckoutPageContentProps) => {
    content.props.push(props);
    return null;
  },
}));

vi.mock("@/platform/shopware/loadCountryOptions", () => ({
  loadCountryOptions: vi.fn(),
}));

vi.mock("@/platform/shopware/loadShopSettings", () => ({
  loadShopSettings: vi.fn(),
}));

vi.mock("@/site/legalLinks", () => ({
  get LEGAL_LINKS() {
    return legal.links;
  },
}));

const templateSettings = {
  showCustomerComment: false,
  requireDataProtectionCheckbox: false,
  passwordMinLength: 8,
  legalLinks: { terms: null, revocation: null },
};

beforeEach(() => {
  content.props = [];
  legal.links = { terms: null, revocation: null };
  vi.mocked(loadCountryOptions).mockReset();
  vi.mocked(loadShopSettings).mockReset();
  vi.mocked(loadShopSettings).mockResolvedValue(shopSettings());
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
      {
        countries: [germany],
        countriesUnavailable: false,
        settings: templateSettings,
      },
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
      { countries: [], countriesUnavailable: true, settings: templateSettings },
    ]);
  });

  it("hands the checkout only its slice of the shop settings and the legal links", async () => {
    vi.mocked(loadCountryOptions).mockResolvedValue({
      countries: [germany],
      countriesUnavailable: false,
    });
    vi.mocked(loadShopSettings).mockResolvedValue(
      shopSettings({
        loginRegistration: {
          requireDataProtectionCheckbox: true,
          passwordMinLength: 12,
          showSalutation: true,
        },
        cart: { showCustomerComment: true, enableOrderRefunds: true },
      }),
    );
    legal.links = { terms: "/navigation/terms", revocation: null };

    await renderToHtml(
      <CheckoutPage params={Promise.resolve({ locale: "en-GB" })} />,
    );

    expect(loadShopSettings).toHaveBeenCalledTimes(1);
    expect(content.props[0]?.settings).toEqual({
      showCustomerComment: true,
      requireDataProtectionCheckbox: true,
      passwordMinLength: 12,
      legalLinks: { terms: "/navigation/terms", revocation: null },
    });
  });
});
