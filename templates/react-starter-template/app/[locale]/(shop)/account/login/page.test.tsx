import { beforeEach, describe, expect, it, vi } from "vitest";

import { germany } from "@/components/form/countries.fixture";
import { loadRegistrationReferences } from "@/features/account/registrationReferences";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";
import { shopSettings } from "@/platform/shopware/shopSettings.fixture";
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

vi.mock("@/features/account/registrationReferences", () => ({
  loadRegistrationReferences: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(loadRegistrationReferences).mockReset();
  vi.mocked(loadRegistrationReferences).mockResolvedValue({
    settings: shopSettings().loginRegistration,
    salutations: [],
    salutationsUnavailable: false,
    birthYearMax: 2026,
  });
  vi.mocked(loadCountryOptions).mockReset();
  vi.mocked(loadCountryOptions).mockResolvedValue({
    countries: [germany],
    countriesUnavailable: false,
  });
});

describe("LoginPage", () => {
  it("is titled like the Vue login page in the page locale and kept out of the index", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "en-GB" }) }),
    ).toEqual({
      title: "Login & Registration",
      robots: { index: false, follow: true },
    });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "pl-PL" }) }),
    ).toEqual({
      title: "Logowanie i rejestracja",
      robots: { index: false, follow: true },
    });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "de-DE" }) }),
    ).toEqual({
      title: "Anmelden & Registrieren",
      robots: { index: false, follow: true },
    });
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

  it("loads the registration settings for the page locale and hands them to the form", async () => {
    vi.mocked(loadRegistrationReferences).mockResolvedValue({
      settings: shopSettings({
        loginRegistration: {
          showSalutation: true,
          showAccountTypeSelection: false,
          passwordMinLength: 10,
        },
      }).loginRegistration,
      salutations: [{ label: "Frau", value: "salutation-mrs" }],
      salutationsUnavailable: false,
      birthYearMax: 2026,
    });

    const html = await renderToHtml(
      withI18n(
        <LoginPage params={Promise.resolve({ locale: "de-DE" })} />,
        "de-DE",
      ),
    );

    expect(loadRegistrationReferences).toHaveBeenCalledExactlyOnceWith("de-DE");
    expect(html).toContain('data-testid="registration-salutation-select"');
    expect(html).toContain('<option value="salutation-mrs">Frau</option>');
    expect(html).not.toContain("registration-account-type-select");
    expect(html).toContain(">Mindestens 10 Zeichen</p>");
  });
});
