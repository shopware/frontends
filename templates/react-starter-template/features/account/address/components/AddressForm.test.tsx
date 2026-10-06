import { describe, expect, it, vi } from "vitest";

import { germany, countries } from "@/components/form/countries.fixture";
import { renderToHtml } from "@/test/render";

import { customerAddress, salutations } from "../address.fixture";
import { addressValuesFrom } from "../addressSchema";
import { AddressForm } from "./AddressForm";
import type { AddressFormProps } from "./AddressForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

async function noopSubmit() {}

function renderForm(props: Partial<AddressFormProps> = {}) {
  return renderToHtml(
    <AddressForm
      countries={countries}
      salutations={salutations}
      onSubmit={noopSubmit}
      {...props}
    />,
  );
}

function tags(html: string, name: string, ...needles: string[]): string[] {
  return (html.match(new RegExp(`<${name}\\b[^>]*>`, "g")) ?? []).filter(
    (tag) => needles.every((needle) => tag.includes(needle)),
  );
}

function requiredLabel(id: string, text: string): string {
  return `<label for="${id}" class="mb-1 block text-sm text-surface-on-surface">${text}<span aria-hidden="true" class="ml-0.5 text-states-error">*</span></label>`;
}

describe("AddressForm", () => {
  it("renders the Form.vue fields with their ids and required marks", async () => {
    const html = await renderForm();

    expect(tags(html, "form", "noValidate")).toHaveLength(1);
    expect(html).toContain(requiredLabel("salutation", "Salutation"));
    expect(html).toContain(requiredLabel("first-name", "First name"));
    expect(html).toContain(requiredLabel("last-name", "Last name"));
    expect(html).toContain(requiredLabel("street", "Street address"));
    expect(html).toContain(requiredLabel("zipcode", "ZIP / Postal code"));
    expect(html).toContain(requiredLabel("city", "City"));
    expect(html).toContain(requiredLabel("country", "Country"));
    expect(html).toContain('placeholder="Enter first name..."');
    expect(html).toContain('placeholder="Enter zip code..."');
    expect(html).toContain('data-testid="country-select"');
    expect(html).toContain("Fields marked with asterisks (*) are required.");
  });

  it("lists the salutations after the placeholder", async () => {
    const html = await renderForm();

    expect(html).toMatch(
      /<select id="salutation"[^>]*>.*<option value="" selected="">Choose salutation...<\/option><option value="salutation-mr">Mr.<\/option><option value="salutation-mrs">Mrs.<\/option>/,
    );
  });

  it("shows the state select only for a country with states", async () => {
    expect(await renderForm()).not.toContain("checkout-pi-state-input");

    const html = await renderForm({
      initialValues: addressValuesFrom(customerAddress()),
    });

    expect(
      tags(
        html,
        "select",
        'id="state"',
        'data-testid="checkout-pi-state-input"',
      ),
    ).toHaveLength(1);
    expect(html).toContain(requiredLabel("state", "State"));
    expect(html).toContain(
      `<option value="${germany.states[1]?.id}" selected="">Berlin</option>`,
    );
  });

  it("prefills the stored values", async () => {
    const html = await renderForm({
      initialValues: addressValuesFrom(customerAddress()),
    });

    expect(html).toMatch(/<input id="first-name"[^>]*value="Jane"/);
    expect(html).toMatch(/<input id="street"[^>]*value="Main Street 1"/);
    expect(html).toMatch(/data-testid="country-select"[^>]*/);
    expect(html).toContain('value="Germany"');
    expect(html).toContain(
      '<option value="salutation-mr" selected="">Mr.</option>',
    );
  });

  it("links Cancel back to the address list and labels the submit button", async () => {
    const html = await renderForm();

    expect(html).toMatch(
      /<button\b[^>]*type="submit"[^>]*><span>Save address<\/span><\/button>/,
    );
    expect(html).toMatch(/<a\b[^>]*href="\/account\/address"[^>]*>Cancel<\/a>/);
  });

  it("marks the reference data errors and offers a retry", async () => {
    const html = await renderForm({
      countries: [],
      salutations: [],
      countriesUnavailable: true,
      salutationsUnavailable: true,
    });

    expect(html).toContain('id="salutation-error"');
    expect(html).toContain("An error occurred. Please try again.");
    expect(html).toContain("Countries could not be loaded");
    expect(html).toContain(">Try again<");
  });

  it("marks a busy form's submit button", async () => {
    const html = await renderForm({ busy: true });

    expect(
      tags(
        html,
        "button",
        'type="submit"',
        'aria-busy="true"',
        'aria-disabled="true"',
      ),
    ).toHaveLength(1);
  });
});
