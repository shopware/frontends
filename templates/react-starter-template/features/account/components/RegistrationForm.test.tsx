import { describe, expect, it, vi } from "vitest";

import type { CountryOption } from "@/platform/shopware/reads/countryOptions";
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
