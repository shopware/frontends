import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { countries, germany, poland } from "./countries.fixture";
import { CountrySelect, filterCountries } from "./CountrySelect";

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

function render(props: Partial<Parameters<typeof CountrySelect>[0]> = {}) {
  return renderToHtml(
    <CountrySelect
      label="Country"
      placeholder="Choose country..."
      countries={countries}
      value=""
      onChange={() => {}}
      {...props}
    />,
  );
}

describe("filterCountries", () => {
  it("returns the whole list for a blank term", () => {
    expect(filterCountries(countries, "")).toBe(countries);
    expect(filterCountries(countries, "   ")).toBe(countries);
  });

  it("matches a case-insensitive substring of the name and keeps the order", () => {
    expect(
      filterCountries(countries, "AN").map((country) => country.name),
    ).toEqual(["Germany", "Poland", "France"]);
    expect(filterCountries(countries, " ger ")).toEqual([germany]);
  });

  it("matches the ISO code", () => {
    expect(
      filterCountries(countries, "gb").map((country) => country.name),
    ).toEqual(["United Kingdom"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterCountries(countries, "zzz")).toEqual([]);
  });
});

describe("CountrySelect", () => {
  it("renders a closed combobox with its label, test ids and toggle", async () => {
    const html = await render();
    const input = tag(html, /<input[^>]*role="combobox"[^>]*>/);

    expect(tag(html, /<label[^>]*>/)).toContain('for="country"');
    expect(html).toContain(">Country</label>");
    expect(input).toContain('id="country"');
    expect(input).toContain('data-testid="country-select"');
    expect(input).toContain('aria-expanded="false"');
    expect(input).toContain('aria-autocomplete="list"');
    expect(input).toMatch(/autocomplete="country-name"/i);
    expect(input).toContain('placeholder="Choose country..."');
    expect(input).not.toContain("aria-controls");
    expect(input).not.toContain("aria-activedescendant");
    expect(html).not.toContain('role="listbox"');

    const toggle = tag(
      html,
      /<button[^>]*data-testid="country-select-toggle"[^>]*>/,
    );
    expect(toggle).toContain('aria-label="Toggle country list"');
    expect(toggle).toContain('tabindex="-1"');
    expect(toggle).toContain('aria-expanded="false"');
    expect(html).not.toContain("country-select-clear");
  });

  it("preconnects to the flag CDN", async () => {
    const html = await render();

    expect(html).toMatch(
      /<link[^>]*rel="preconnect"[^>]*href="https:\/\/flagcdn\.com"/,
    );
  });

  it("shows the selected country with its flag and a clear button", async () => {
    const html = await render({ value: poland.id });
    const input = tag(html, /<input[^>]*role="combobox"[^>]*>/);

    expect(input).toContain('value="Poland"');
    expect(tag(html, /<img[^>]*>/)).toContain(
      'src="https://flagcdn.com/pl.svg"',
    );
    expect(tag(html, /<img[^>]*>/)).toContain('alt=""');
    expect(
      tag(html, /<button[^>]*data-testid="country-select-clear"[^>]*>/),
    ).toContain('aria-label="Clear country selection"');
    expect(html).not.toContain("country-select-toggle");
  });

  it("marks the input invalid and describes it with the error paragraph", async () => {
    const html = await render({ error: "Value is required" });
    const input = tag(html, /<input[^>]*role="combobox"[^>]*>/);

    expect(input).toContain('aria-invalid="true"');
    expect(input).toContain('aria-describedby="country-error"');
    expect(tag(html, /<p[^>]*id="country-error"[^>]*>/)).toContain(
      "text-states-error",
    );
    expect(html).toContain(">Value is required</p>");
  });

  it("derives the ids and test ids from the props", async () => {
    const html = await render({
      id: "billingCountry",
      testId: "billing-country-select",
      error: "Value is required",
    });
    const input = tag(html, /<input[^>]*role="combobox"[^>]*>/);

    expect(input).toContain('id="billingCountry"');
    expect(input).toContain('data-testid="billing-country-select"');
    expect(input).toContain('aria-describedby="billingCountry-error"');
    expect(tag(html, /<label[^>]*>/)).toContain('for="billingCountry"');
    expect(html).toContain('data-testid="billing-country-select-toggle"');
  });

  it("renders a disabled read-only input with the only country", async () => {
    const html = await render({ countries: [germany] });
    const input = tag(html, /<input[^>]*>/);

    expect(input).toContain('data-testid="country-select"');
    expect(input).toContain('value="Germany"');
    expect(input).toContain("disabled");
    expect(input).not.toContain('role="combobox"');
    expect(tag(html, /<img[^>]*>/)).toContain(
      'src="https://flagcdn.com/de.svg"',
    );
    expect(html).not.toContain("country-select-toggle");
    expect(html).not.toContain("country-select-clear");
  });

  it("disables the combobox and the toggle when disabled", async () => {
    const html = await render({ disabled: true, value: poland.id });
    const input = tag(html, /<input[^>]*role="combobox"[^>]*>/);

    expect(input).toContain("disabled");
    expect(
      tag(html, /<button[^>]*data-testid="country-select-toggle"[^>]*>/),
    ).toContain("disabled");
    expect(html).not.toContain("country-select-clear");
  });

  it("marks the combobox required only when asked", async () => {
    const optional = tag(await render(), /<input[^>]*role="combobox"[^>]*>/);
    expect(optional).not.toMatch(/\srequired(=""|\s|>)/);

    const required = tag(
      await render({ required: true }),
      /<input[^>]*role="combobox"[^>]*>/,
    );
    expect(required).toMatch(/\srequired(=""|\s|>)/);

    const single = tag(
      await render({ required: true, countries: [germany] }),
      /<input[^>]*>/,
    );
    expect(single).not.toMatch(/\srequired(=""|\s|>)/);
  });

  it("announces a failed country read in place of the validation error", async () => {
    const html = await render({
      countries: [],
      loadError: true,
      error: "Value is required",
    });
    const input = tag(html, /<input[^>]*role="combobox"[^>]*>/);
    const message = tag(html, /<p[^>]*id="country-error"[^>]*>/);

    expect(input).toContain('aria-invalid="true"');
    expect(input).toContain('aria-describedby="country-error"');
    expect(message).toContain('role="alert"');
    expect(message).toContain("text-states-error");
    expect(html).toContain(">Countries could not be loaded</p>");
    expect(html).not.toContain("Value is required");
    expect(html).not.toContain('role="listbox"');
  });

  it("keeps validation errors out of the alert role", async () => {
    const html = await render({ error: "Value is required" });

    expect(tag(html, /<p[^>]*id="country-error"[^>]*>/)).not.toContain("role=");
  });
});
