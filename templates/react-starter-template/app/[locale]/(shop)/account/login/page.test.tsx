import { beforeEach, describe, expect, it, vi } from "vitest";

import { germany } from "@/components/form/countries.fixture";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import LoginPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/platform/shopware/loadCountryOptions", () => ({
  loadCountryOptions: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(loadCountryOptions).mockReset();
  vi.mocked(loadCountryOptions).mockResolvedValue({
    countries: [germany],
    countriesUnavailable: false,
  });
});

describe("LoginPage", () => {
  it("is titled like the Vue login page in the page locale", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "en-GB" }) }),
    ).toEqual({ title: "Login & Registration" });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "pl-PL" }) }),
    ).toEqual({ title: "Logowanie i rejestracja" });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "de-DE" }) }),
    ).toEqual({ title: "Anmelden & Registrieren" });
  });

  it("loads the registration countries for the page locale", async () => {
    const html = await renderToHtml(
      withI18n(
        <LoginPage params={Promise.resolve({ locale: "de-DE" })} />,
        "de-DE",
      ),
    );

    expect(loadCountryOptions).toHaveBeenCalledExactlyOnceWith(
      "de-DE",
      "Registration",
    );
    expect(html).toContain('data-testid="country-select"');
  });
});
