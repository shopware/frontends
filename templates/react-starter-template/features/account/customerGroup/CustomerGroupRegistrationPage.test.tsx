import { beforeEach, describe, expect, it, vi } from "vitest";

import { germany } from "@/components/form/countries.fixture";
import { RegistrationForm } from "@/features/account/components/RegistrationForm";
import { apiClientError } from "@/features/session/session.fixture";
import type { Locale } from "@/i18n/config";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";
import { readCustomerGroupRegistration } from "@/platform/shopware/reads/customerGroupRegistration";
import type { CustomerGroupRegistration } from "@/platform/shopware/reads/customerGroupRegistration";
import { resolveContentLanguage } from "@/platform/shopware/reads/languages";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { CustomerGroupRegistrationPage } from "./CustomerGroupRegistrationPage";

vi.mock("server-only", () => ({}));

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/platform/shopware/reads/customerGroupRegistration", () => ({
  readCustomerGroupRegistration: vi.fn(),
}));

vi.mock("@/platform/shopware/loadCountryOptions", () => ({
  loadCountryOptions: vi.fn(),
}));

vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveContentLanguage: vi.fn(),
}));

vi.mock(
  "@/features/account/components/RegistrationForm",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/features/account/components/RegistrationForm")
      >();
    return { RegistrationForm: vi.fn(actual.RegistrationForm) };
  },
);

const merchants: CustomerGroupRegistration = {
  id: "group-b2b",
  title: "Merchant registration",
  introduction: "<p>Register as a <strong>merchant</strong>.</p>",
  companyOnly: false,
  metaDescription: "Become a merchant",
};

function answer(group: CustomerGroupRegistration) {
  vi.mocked(readCustomerGroupRegistration).mockResolvedValue(group);
}

async function render(
  locale: Locale = "en-GB",
  languageId: string | null = null,
) {
  return renderToHtml(
    withI18n(
      await CustomerGroupRegistrationPage({
        customerGroupId: "group-b2b",
        locale,
        languageId,
      }),
      locale,
    ),
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  answer(merchants);
  vi.mocked(loadCountryOptions).mockResolvedValue({
    countries: [germany],
    countriesUnavailable: false,
  });
  vi.mocked(resolveContentLanguage).mockResolvedValue({
    languageId: null,
    contentLang: undefined,
  });
});

describe("CustomerGroupRegistrationPage", () => {
  it("reads the group and the countries in the page language", async () => {
    const html = await render("de-DE", "language-de");

    expect(readCustomerGroupRegistration).toHaveBeenCalledExactlyOnceWith(
      "group-b2b",
      "language-de",
    );
    expect(loadCountryOptions).toHaveBeenCalledExactlyOnceWith(
      "de-DE",
      "CustomerGroupRegistration",
    );
    expect(html).toContain(">Merchant registration</h1>");
    expect(html).toContain("<strong>merchant</strong>");
    expect(html).toContain('data-testid="registration-form"');
    expect(html).toContain('data-testid="country-select"');
  });

  it("requests the group in the registration form", async () => {
    await render();

    expect(vi.mocked(RegistrationForm).mock.calls[0]?.[0]).toEqual({
      countries: [germany],
      countriesUnavailable: false,
      companyOnly: false,
      requestedGroupId: "group-b2b",
    });
  });

  it("renders the not-found page for a group without an active registration", async () => {
    vi.mocked(readCustomerGroupRegistration).mockRejectedValue(
      apiClientError([{ code: "CUSTOMER_GROUP_REGISTRATION_NOT_FOUND" }], 404),
    );

    await expect(
      CustomerGroupRegistrationPage({
        customerGroupId: "group-b2b",
        locale: "en-GB",
        languageId: null,
      }),
    ).rejects.toMatchObject({ digest: expect.stringContaining("404") });
  });

  it("lets any other failure reach the error boundary", async () => {
    const failure = apiClientError([{ code: "FRAMEWORK__ERROR" }], 500);
    vi.mocked(readCustomerGroupRegistration).mockRejectedValue(failure);

    await expect(
      CustomerGroupRegistrationPage({
        customerGroupId: "group-b2b",
        locale: "en-GB",
        languageId: null,
      }),
    ).rejects.toBe(failure);
  });

  it("sanitizes the introduction HTML from the Administration", async () => {
    answer({
      ...merchants,
      introduction:
        '<p>Welcome</p><script>alert("script")</script><img src="x.png" onerror="alert(\'img\')"><a href="javascript:alert(\'link\')">Terms</a>',
    });

    const html = await render();

    expect(html).toContain("<p>Welcome</p>");
    expect(html).toContain("Terms");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("javascript:");
  });

  it("renders no introduction block without an introduction", async () => {
    answer({ ...merchants, introduction: null });

    const html = await render();

    expect(html).not.toContain("customer-group-registration-introduction");
    expect(html).toContain(">Merchant registration</h1>");
  });

  it("offers the account type select for a group that accepts private customers", async () => {
    const html = await render();

    expect(html).toContain('data-testid="registration-account-type-select"');
  });

  it("asks only for a company account when the group is company-only", async () => {
    answer({ ...merchants, companyOnly: true });

    const html = await render();

    expect(html).not.toContain("registration-account-type-select");
    expect(html).toContain('data-testid="registration-company-input"');
    expect(vi.mocked(RegistrationForm).mock.calls[0]?.[0]).toMatchObject({
      companyOnly: true,
      requestedGroupId: "group-b2b",
    });
  });

  it("declares the content language on the Shopware texts only", async () => {
    vi.mocked(resolveContentLanguage).mockResolvedValue({
      languageId: null,
      contentLang: "en-US",
    });

    const html = await render("pl-PL");

    expect(resolveContentLanguage).toHaveBeenCalledExactlyOnceWith("pl-PL");
    expect(html).toMatch(/<h1 lang="en-US"[^>]*>Merchant registration<\/h1>/);
    expect(html).toMatch(
      /<div lang="en-US" data-testid="customer-group-registration-introduction"/,
    );
    expect(html).not.toMatch(/<form[^>]* lang=/);
  });

  it("keeps the registration form when the countries cannot be read", async () => {
    vi.mocked(loadCountryOptions).mockResolvedValue({
      countries: [],
      countriesUnavailable: true,
    });

    await render();

    expect(vi.mocked(RegistrationForm).mock.calls[0]?.[0]).toMatchObject({
      countries: [],
      countriesUnavailable: true,
    });
  });
});
