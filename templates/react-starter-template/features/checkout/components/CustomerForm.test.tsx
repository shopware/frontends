import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { countries } from "../checkout.fixture";
import { emptyCheckoutValues } from "../checkoutSchema";
import { CustomerAddress } from "./CustomerAddress";
import { CustomerBaseInfo } from "./CustomerBaseInfo";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

function inputWithTestId(html: string, testId: string): string {
  const match = html.match(
    new RegExp(`<(input|select)[^>]*data-testid="${testId}"[^>]*>`),
  );
  expect(match, testId).not.toBeNull();
  return match?.[0] ?? "";
}

function requiredLabel(id: string, text: string): string {
  return `<label for="${id}" class="mb-1 block text-sm text-surface-on-surface">${text}<span aria-hidden="true" class="ml-0.5 text-states-error">*</span></label>`;
}

describe("CustomerBaseInfo", () => {
  it("renders the email field and the create account toggle for a guest", async () => {
    const html = await renderToHtml(
      <CustomerBaseInfo
        email=""
        password=""
        createAccount={false}
        errors={{}}
        onFieldChange={() => {}}
        onFieldBlur={() => {}}
        onCreateAccountChange={() => {}}
      />,
    );

    const email = inputWithTestId(html, "checkout-pi-email-input");
    expect(email).toContain('type="email"');
    expect(email).toContain('autoComplete="email"');
    expect(email).toContain('placeholder="Enter email address"');
    expect(html).toContain(requiredLabel("email", "Email address"));
    expect(html).toMatch(
      /<button type="button"[^>]*data-testid="checkout-create-account-toggle"[^>]*>.*Create customer account/,
    );
    expect(html).not.toContain("checkout-pi-password-input");
  });

  it("swaps the toggle for the password field and the guest link", async () => {
    const html = await renderToHtml(
      <CustomerBaseInfo
        email="jane@example.com"
        password=""
        createAccount
        errors={{ password: "Value is required" }}
        onFieldChange={() => {}}
        onFieldBlur={() => {}}
        onCreateAccountChange={() => {}}
      />,
    );

    const password = inputWithTestId(html, "checkout-pi-password-input");
    expect(password).toContain('type="password"');
    expect(password).toContain('autoComplete="new-password"');
    expect(password).toContain('aria-invalid="true"');
    expect(password).toContain('aria-describedby="password-error"');
    expect(html).toContain('id="password-error"');
    expect(html).toContain(">Continue as guest</button>");
    expect(html).not.toContain("checkout-create-account-toggle");
  });
});

describe("CustomerAddress", () => {
  it("renders every address field with the Vue test ids and autocomplete hints", async () => {
    const html = await renderToHtml(
      <CustomerAddress
        values={emptyCheckoutValues}
        errors={{}}
        countries={countries}
        onFieldChange={() => {}}
        onFieldBlur={() => {}}
        onCountryChange={() => {}}
      />,
    );

    const fields: [string, string, string, string][] = [
      [
        "checkout-pi-first-name-input",
        "first-name",
        "given-name",
        "First name",
      ],
      ["checkout-pi-last-name-input", "last-name", "family-name", "Last name"],
      [
        "checkout-pi-street-address-input",
        "street",
        "street-address",
        "Street address",
      ],
      ["checkout-pi-zip-code-input", "zipcode", "postal-code", "Zip Code"],
      ["checkout-pi-city-input", "city", "address-level2", "City"],
    ];
    for (const [testId, id, autoComplete, label] of fields) {
      const input = inputWithTestId(html, testId);
      expect(input).toContain(`id="${id}"`);
      expect(input).toContain(`autoComplete="${autoComplete}"`);
      expect(html).toContain(requiredLabel(id, label));
    }
    expect(inputWithTestId(html, "country-select")).toContain(
      'role="combobox"',
    );
    expect(html).not.toContain("checkout-pi-state-input");
  });

  it("asks for the state of a country that has states", async () => {
    const html = await renderToHtml(
      <CustomerAddress
        values={{ ...emptyCheckoutValues, countryId: "country-de" }}
        errors={{ countryStateId: "The value is required" }}
        countries={countries}
        onFieldChange={() => {}}
        onFieldBlur={() => {}}
        onCountryChange={() => {}}
      />,
    );

    const state = inputWithTestId(html, "checkout-pi-state-input");
    expect(state).toContain('id="state"');
    expect(state).toContain('aria-invalid="true"');
    expect(html).toContain(
      '<option value="" selected="">Choose state</option>',
    );
    expect(html).toContain('<option value="state-by">Bavaria</option>');
  });

  it("offers a retry when the countries could not be read", async () => {
    const html = await renderToHtml(
      <CustomerAddress
        values={emptyCheckoutValues}
        errors={{}}
        countries={[]}
        countriesUnavailable
        onFieldChange={() => {}}
        onFieldBlur={() => {}}
        onCountryChange={() => {}}
      />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Countries could not be loaded");
    expect(html).toContain(">Try again</span></button>");
  });
});

describe("customer form in other locales", () => {
  it("labels the base info fields in Polish", async () => {
    const html = await renderToHtml(
      withI18n(
        <CustomerBaseInfo
          email=""
          password=""
          createAccount={false}
          errors={{}}
          onFieldChange={() => {}}
          onFieldBlur={() => {}}
          onCreateAccountChange={() => {}}
        />,
        "pl-PL",
      ),
    );

    expect(html).toContain(requiredLabel("email", "Adres e-mail"));
    expect(inputWithTestId(html, "checkout-pi-email-input")).toContain(
      'placeholder="Wprowadź adres e-mail"',
    );
    expect(html).toContain("Utwórz konto klienta");
  });

  it("labels the address fields in German", async () => {
    const html = await renderToHtml(
      withI18n(
        <CustomerAddress
          values={{ ...emptyCheckoutValues, countryId: "country-de" }}
          errors={{}}
          countries={countries}
          countriesUnavailable
          onFieldChange={() => {}}
          onFieldBlur={() => {}}
          onCountryChange={() => {}}
        />,
        "de-DE",
      ),
    );

    expect(html).toContain(requiredLabel("first-name", "Vorname"));
    expect(html).toContain(requiredLabel("zipcode", "Postleitzahl"));
    expect(inputWithTestId(html, "checkout-pi-city-input")).toContain(
      'placeholder="Stadt eingeben"',
    );
    expect(html).toContain(">Erneut versuchen</span></button>");
  });
});
