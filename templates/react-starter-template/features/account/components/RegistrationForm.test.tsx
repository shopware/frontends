import { describe, expect, it, vi } from "vitest";

import type { RegistrationSettings } from "@/features/account/registrationSchema";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";
import { shopSettings } from "@/platform/shopware/shopSettings.fixture";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { RegistrationForm } from "./RegistrationForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const countries: CountryOption[] = [
  {
    id: "country-de",
    name: "Germany",
    iso: "DE",
    states: [
      { id: "state-by", name: "Bavaria" },
      { id: "state-be", name: "Berlin" },
    ],
  },
  { id: "country-pl", name: "Poland", iso: "PL", states: [] },
];

const REGISTRATION_TEST_IDS = [
  "registration-account-type-select",
  "registration-first-name-input",
  "registration-last-name-input",
  "registration-email-input",
  "registration-password-input",
  "registration-street-input",
  "registration-zipcode-input",
  "registration-city-input",
  "country-select",
  "registration-submit-button",
];

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

function elementWithTestId(html: string, testId: string): string {
  return tag(html, new RegExp(`<[a-z]+[^>]*data-testid="${testId}"[^>]*>`));
}

function requiredLabel(text: string): string {
  return `>${text}<span aria-hidden="true" class="ml-0.5 text-states-error">*</span></label>`;
}

const REQUIRED_ATTRIBUTE = /\srequired(=""|\s|>)/;

function settingsWith(
  overrides: Partial<RegistrationSettings> = {},
): RegistrationSettings {
  return shopSettings({ loginRegistration: overrides }).loginRegistration;
}

const everyField = settingsWith({
  passwordMinLength: 12,
  requireDataProtectionCheckbox: true,
  showSalutation: true,
  showTitleField: true,
  showBirthdayField: true,
  birthdayFieldRequired: true,
  requireEmailConfirmation: true,
  requirePasswordConfirmation: true,
  showAdditionalAddressField1: true,
  additionalAddressField1Required: true,
  showAdditionalAddressField2: true,
  additionalAddressField2Required: true,
  showPhoneNumberField: true,
  phoneNumberFieldRequired: true,
});

const SETTINGS_TEST_IDS = [
  "registration-salutation-select",
  "registration-title-input",
  "registration-birthday-day-select",
  "registration-birthday-month-select",
  "registration-birthday-year-select",
  "registration-email-confirmation-input",
  "registration-password-confirmation-input",
  "registration-additional-address-line1-input",
  "registration-additional-address-line2-input",
  "registration-phone-input",
  "registration-data-protection-checkbox",
];

const salutations = [
  { label: "Mr.", value: "salutation-mr" },
  { label: "Mrs.", value: "salutation-mrs" },
];
const DISABLED_ATTRIBUTE = /\sdisabled(=""|\s|>)/;

describe("RegistrationForm", () => {
  it("renders the heading, the labelled form and every Vue test id", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    expect(html).toContain('<h2 id="sign-up-heading"');
    expect(html).toContain(">Create an account</h2>");
    expect(html).toContain(">Register to get started</p>");
    expect(html).toContain(">Your address</h3>");

    const form = tag(html, /<form [^>]*>/);
    expect(form).toContain('data-testid="registration-form"');
    expect(form).toContain('aria-labelledby="sign-up-heading"');
    expect(form.toLowerCase()).toContain("novalidate");

    for (const testId of REGISTRATION_TEST_IDS) {
      expect(html).toContain(`data-testid="${testId}"`);
    }
  });

  it("labels every field with the Vue copy", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    expect(html).toContain('<label for="accountType"');
    expect(html).toContain(">Account type</label>");
    expect(html).toContain(">Private</option>");
    expect(html).toContain(">Company</option>");
    expect(html).toContain('<label for="firstName"');
    expect(html).toContain(requiredLabel("First name"));
    expect(html).toContain('<label for="lastName"');
    expect(html).toContain(requiredLabel("Last name"));
    expect(html).toContain('<label for="emailAddress"');
    expect(html).toContain(requiredLabel("Email address"));
    expect(html).toContain('<label for="password"');
    expect(html).toContain(requiredLabel("Password"));
    expect(html).toContain('<label for="street"');
    expect(html).toContain(requiredLabel("Street address"));
    expect(html).toContain('<label for="zipcode"');
    expect(html).toContain(requiredLabel("ZIP / Postal code"));
    expect(html).toContain('<label for="city"');
    expect(html).toContain(requiredLabel("City"));
    expect(html).toContain('<label for="country"');
    expect(html).toContain(requiredLabel("Country"));
    expect(html).toContain('placeholder="Choose country..."');
    expect(html).toContain(">Submit</span>");
  });

  it("wires autocomplete and input types like the Vue form", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    expect(
      elementWithTestId(html, "registration-first-name-input").toLowerCase(),
    ).toContain('autocomplete="given-name"');
    expect(
      elementWithTestId(html, "registration-last-name-input").toLowerCase(),
    ).toContain('autocomplete="family-name"');
    const email = elementWithTestId(html, "registration-email-input");
    expect(email).toContain('type="email"');
    expect(email.toLowerCase()).toContain('autocomplete="email"');
    const password = elementWithTestId(html, "registration-password-input");
    expect(password).toContain('type="password"');
    expect(password.toLowerCase()).toContain('autocomplete="new-password"');
    expect(
      elementWithTestId(html, "registration-street-input").toLowerCase(),
    ).toContain('autocomplete="street-address"');
    expect(
      elementWithTestId(html, "registration-zipcode-input").toLowerCase(),
    ).toContain('autocomplete="postal-code"');
    expect(
      elementWithTestId(html, "registration-city-input").toLowerCase(),
    ).toContain('autocomplete="address-level2"');

    const country = elementWithTestId(html, "country-select");
    expect(country).toContain('role="combobox"');
    expect(country).toContain('id="country"');
    expect(country.toLowerCase()).toContain('autocomplete="country-name"');
  });

  it("marks the required fields and states their rules", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    expect(html).toContain(
      ">Fields marked with asterisks (*) are required.</p>",
    );
    for (const testId of [
      "registration-first-name-input",
      "registration-last-name-input",
      "registration-email-input",
      "registration-password-input",
      "registration-street-input",
      "registration-zipcode-input",
      "registration-city-input",
      "country-select",
    ]) {
      expect(elementWithTestId(html, testId)).toMatch(REQUIRED_ATTRIBUTE);
    }
    expect(
      elementWithTestId(html, "registration-account-type-select"),
    ).not.toMatch(REQUIRED_ATTRIBUTE);

    expect(elementWithTestId(html, "registration-first-name-input")).toContain(
      'aria-describedby="firstName-hint"',
    );
    expect(elementWithTestId(html, "registration-last-name-input")).toContain(
      'aria-describedby="lastName-hint"',
    );
    expect(elementWithTestId(html, "registration-street-input")).toContain(
      'aria-describedby="street-hint"',
    );
    expect(elementWithTestId(html, "registration-password-input")).toContain(
      'aria-describedby="password-hint"',
    );
    expect(tag(html, /<p id="password-hint"[^>]*>[^<]*<\/p>/)).toContain(
      ">At least 8 characters</p>",
    );
    expect(tag(html, /<p id="firstName-hint"[^>]*>[^<]*<\/p>/)).toContain(
      ">At least 3 characters</p>",
    );
    expect(elementWithTestId(html, "registration-email-input")).not.toContain(
      "aria-describedby",
    );
  });

  it("hides the business fields and the state select for a private account", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    expect(html).not.toContain("registration-vatid-input");
    expect(html).not.toContain("registration-company-input");
    expect(html).not.toContain("checkout-pi-state-input");
    expect(
      elementWithTestId(html, "registration-account-type-select"),
    ).toContain("<select");
  });

  it("shows no errors before any interaction", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    expect(html).not.toContain("Value is required");
    expect(html).not.toContain('aria-invalid="true"');
    expect(html).not.toMatch(/id="[\w-]+-error"/);
    expect(html).not.toMatch(/aria-describedby="[^"]*-error/);
  });

  it("starts as a business account without the account type select when companyOnly", async () => {
    const html = await renderToHtml(
      <RegistrationForm countries={countries} companyOnly />,
    );

    expect(html).not.toContain("registration-account-type-select");
    expect(html).toContain('data-testid="registration-vatid-input"');
    expect(html).toContain('<label for="vatId"');
    expect(html).toContain(">VAT ID</label>");
    const company = elementWithTestId(html, "registration-company-input");
    expect(company.toLowerCase()).toContain('autocomplete="organization"');
    expect(company).toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain('<label for="company"');
    expect(html).toContain(requiredLabel("Company"));
    expect(elementWithTestId(html, "registration-vatid-input")).not.toMatch(
      REQUIRED_ATTRIBUTE,
    );
  });

  it("reports unavailable countries with a retry instead of an empty picker", async () => {
    const html = await renderToHtml(
      <RegistrationForm countries={[]} countriesUnavailable />,
    );

    const country = elementWithTestId(html, "country-select");
    expect(country).toContain('aria-invalid="true"');
    expect(country).toContain('aria-describedby="country-error"');
    expect(tag(html, /<p[^>]*id="country-error"[^>]*>/)).toContain(
      'role="alert"',
    );
    expect(html).toContain(">Countries could not be loaded</p>");
    expect(html).toContain(">Try again</span>");
    expect(html).not.toContain("No countries found");
  });

  it("offers no retry when the countries were read", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    expect(html).not.toContain("Try again");
    expect(html).not.toContain("Countries could not be loaded");
  });

  it("renders a polite status region and a submit button that is not busy", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    const status = tag(html, /<output [^>]*>/);
    expect(status).toContain('aria-live="polite"');
    expect(html).not.toContain("Thank you for signing up!");

    const submit = elementWithTestId(html, "registration-submit-button");
    expect(submit).toContain('type="submit"');
    expect(submit).toContain('aria-busy="false"');
    expect(submit).not.toMatch(DISABLED_ATTRIBUTE);
    expect(submit).not.toContain("aria-disabled=");
  });

  it("groups the address fields under the address heading", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    expect(html).toContain('<h3 id="address-heading"');
    const group = tag(html, /<fieldset [^>]*>/);
    expect(group).toContain('aria-labelledby="address-heading"');
  });
});

describe("RegistrationForm in Polish", () => {
  it("renders the Polish copy with the minimum length hints in the Polish plural forms", async () => {
    const html = await renderToHtml(
      withI18n(<RegistrationForm countries={countries} />, "pl-PL"),
    );

    expect(html).toContain(">Utwórz konto</h2>");
    expect(tag(html, /<p id="firstName-hint"[^>]*>[^<]*<\/p>/)).toContain(
      ">Co najmniej 3 znaki</p>",
    );
    expect(tag(html, /<p id="password-hint"[^>]*>[^<]*<\/p>/)).toContain(
      ">Co najmniej 8 znaków</p>",
    );
    expect(html).toContain(
      '<option value="business">Klient biznesowy</option>',
    );
  });

  it("renders the German minimum length hints", async () => {
    const html = await renderToHtml(
      withI18n(<RegistrationForm countries={countries} />, "de-DE"),
    );

    expect(tag(html, /<p id="password-hint"[^>]*>[^<]*<\/p>/)).toContain(
      ">Mindestens 8 Zeichen</p>",
    );
  });
});

describe("RegistrationForm with the shop settings", () => {
  it("renders no field the template default settings leave out", async () => {
    const html = await renderToHtml(<RegistrationForm countries={countries} />);

    for (const testId of SETTINGS_TEST_IDS) {
      expect(html).not.toContain(`data-testid="${testId}"`);
    }
    expect(html).not.toContain('<fieldset class="min-w-0');
  });

  it("renders every field the shop asks for with its label, rule and autocomplete", async () => {
    const html = await renderToHtml(
      <RegistrationForm
        countries={countries}
        settings={everyField}
        salutations={salutations}
        birthYearMax={2026}
      />,
    );

    for (const testId of SETTINGS_TEST_IDS) {
      expect(html).toContain(`data-testid="${testId}"`);
    }

    const salutation = elementWithTestId(
      html,
      "registration-salutation-select",
    );
    expect(salutation).toContain('id="salutation"');
    expect(salutation.toLowerCase()).toContain(
      'autocomplete="honorific-prefix"',
    );
    expect(salutation).not.toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain('<label for="salutation"');
    expect(html).toContain(">Salutation</label>");
    expect(html).toContain(">Choose salutation...</option>");
    expect(html).toContain('<option value="salutation-mrs">Mrs.</option>');

    const title = elementWithTestId(html, "registration-title-input");
    expect(title.toLowerCase()).toContain('autocomplete="honorific-prefix"');
    expect(title.toLowerCase()).toContain('maxlength="100"');
    expect(title).not.toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain(">Title</label>");

    expect(html).toContain(
      'Date of birth<span aria-hidden="true" class="ml-0.5 text-states-error">*</span></legend>',
    );
    for (const part of ["day", "month", "year"]) {
      expect(
        elementWithTestId(html, `registration-birthday-${part}-select`),
      ).toMatch(REQUIRED_ATTRIBUTE);
    }
    expect(html).toContain('<option value="2026">2026</option>');

    const emailConfirmation = elementWithTestId(
      html,
      "registration-email-confirmation-input",
    );
    expect(emailConfirmation).toContain('type="email"');
    expect(emailConfirmation.toLowerCase()).toContain('autocomplete="email"');
    expect(emailConfirmation).toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain(requiredLabel("Confirm e-mail"));

    const passwordConfirmation = elementWithTestId(
      html,
      "registration-password-confirmation-input",
    );
    expect(passwordConfirmation).toContain('type="password"');
    expect(passwordConfirmation.toLowerCase()).toContain(
      'autocomplete="new-password"',
    );
    expect(passwordConfirmation).toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain(requiredLabel("Password confirmation"));

    expect(
      elementWithTestId(html, "registration-street-input").toLowerCase(),
    ).toContain('autocomplete="address-line1"');
    const line1 = elementWithTestId(
      html,
      "registration-additional-address-line1-input",
    );
    expect(line1.toLowerCase()).toContain('autocomplete="address-line2"');
    expect(line1).toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain(requiredLabel("Additional address line 1"));
    const line2 = elementWithTestId(
      html,
      "registration-additional-address-line2-input",
    );
    expect(line2.toLowerCase()).toContain('autocomplete="address-line3"');
    expect(html).toContain(requiredLabel("Additional address line 2"));

    const phone = elementWithTestId(html, "registration-phone-input");
    expect(phone).toContain('type="tel"');
    expect(phone.toLowerCase()).toContain('autocomplete="tel"');
    expect(phone.toLowerCase()).toContain('maxlength="40"');
    expect(phone).toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain(requiredLabel("Phone number"));

    const privacy = elementWithTestId(
      html,
      "registration-data-protection-checkbox",
    );
    expect(privacy).toContain('type="checkbox"');
    expect(privacy).toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain(
      'I have read the data protection information.<span aria-hidden="true" class="ml-0.5 text-states-error">*</span>',
    );
  });

  it("puts the fields in the Storefront order", async () => {
    const html = await renderToHtml(
      <RegistrationForm
        countries={countries}
        settings={everyField}
        salutations={salutations}
      />,
    );
    const order = [
      "registration-account-type-select",
      "registration-salutation-select",
      "registration-title-input",
      "registration-first-name-input",
      "registration-last-name-input",
      "registration-birthday-day-select",
      "registration-email-input",
      "registration-email-confirmation-input",
      "registration-password-input",
      "registration-password-confirmation-input",
      "registration-street-input",
      "registration-additional-address-line1-input",
      "registration-additional-address-line2-input",
      "registration-zipcode-input",
      "country-select",
      "registration-phone-input",
      "registration-data-protection-checkbox",
      "registration-submit-button",
    ].map((testId) => html.indexOf(`data-testid="${testId}"`));

    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(order).not.toContain(-1);
  });

  it("states the configured password minimum and none for 0", async () => {
    const twelve = await renderToHtml(
      <RegistrationForm
        countries={countries}
        settings={settingsWith({ passwordMinLength: 12 })}
      />,
    );
    expect(tag(twelve, /<p id="password-hint"[^>]*>[^<]*<\/p>/)).toContain(
      ">At least 12 characters</p>",
    );

    const none = await renderToHtml(
      <RegistrationForm
        countries={countries}
        settings={settingsWith({ passwordMinLength: 0 })}
      />,
    );
    expect(none).not.toContain('id="password-hint"');
    expect(
      elementWithTestId(none, "registration-password-input"),
    ).not.toContain("aria-describedby");
  });

  it("hides the account type select when the shop does not offer it", async () => {
    const html = await renderToHtml(
      <RegistrationForm
        countries={countries}
        settings={settingsWith({ showAccountTypeSelection: false })}
      />,
    );

    expect(html).not.toContain("registration-account-type-select");
    expect(html).not.toContain("registration-company-input");
    expect(html).not.toContain("registration-vatid-input");
  });

  it("keeps the business fields of a company-only group without the account type select", async () => {
    const html = await renderToHtml(
      <RegistrationForm
        countries={countries}
        companyOnly
        settings={settingsWith({ showAccountTypeSelection: false })}
      />,
    );

    expect(html).not.toContain("registration-account-type-select");
    expect(html).toContain('data-testid="registration-company-input"');
    expect(html).toContain('data-testid="registration-vatid-input"');
  });

  it("disables the salutation with an error and a retry when the salutations could not be read", async () => {
    const html = await renderToHtml(
      <RegistrationForm
        countries={countries}
        settings={settingsWith({ showSalutation: true })}
        salutationsUnavailable
      />,
    );

    const salutation = elementWithTestId(
      html,
      "registration-salutation-select",
    );
    expect(salutation).toMatch(DISABLED_ATTRIBUTE);
    expect(salutation).toContain('aria-invalid="true"');
    expect(salutation).toContain('aria-describedby="salutation-error"');
    expect(html).toContain(
      ">Unfortunately, something went wrong. Please try again in a few moments. If the problem persists, you can return to the homepage or contact our support team for assistance.</p>",
    );
    expect(html).toContain(">Try again</span>");
  });

  it("renders the new labels in Polish and German", async () => {
    const polish = await renderToHtml(
      withI18n(
        <RegistrationForm countries={countries} settings={everyField} />,
        "pl-PL",
      ),
    );
    expect(polish).toContain(">Tytuł</label>");
    expect(polish).toContain(">Data urodzenia");
    expect(polish).toContain(requiredLabel("Potwierdzenie hasła"));
    expect(polish).toContain(requiredLabel("Dodatkowa linia adresu 1"));
    expect(tag(polish, /<p id="password-hint"[^>]*>[^<]*<\/p>/)).toContain(
      ">Co najmniej 12 znaków</p>",
    );

    const german = await renderToHtml(
      withI18n(
        <RegistrationForm countries={countries} settings={everyField} />,
        "de-DE",
      ),
    );
    expect(german).toContain(">Titel</label>");
    expect(german).toContain(requiredLabel("Passwort-Bestätigung"));
    expect(german).toContain(requiredLabel("Adresszusatz 2"));
    expect(german).toContain(
      "Ich habe die Datenschutzinformationen gelesen.<span",
    );
  });
});
