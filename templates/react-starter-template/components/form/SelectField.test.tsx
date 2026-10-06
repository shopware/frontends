import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { SelectField } from "./SelectField";

const options = [
  { label: "Private", value: "private" },
  { label: "Company", value: "business" },
];

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

function optionTags(html: string): string[] {
  return html.match(/<option[^>]*>[^<]*<\/option>/g) ?? [];
}

describe("SelectField", () => {
  it("links the label to the select and renders every option", async () => {
    const html = await renderToHtml(
      <SelectField id="accountType" label="Account type" options={options} />,
    );

    expect(tag(html, /<label[^>]*>/)).toContain('for="accountType"');
    expect(html).toContain(">Account type</label>");
    expect(tag(html, /<select[^>]*>/)).toContain('id="accountType"');
    expect(optionTags(html)).toEqual([
      '<option value="private">Private</option>',
      '<option value="business">Company</option>',
    ]);
  });

  it("renders the placeholder as the first option with an empty value", async () => {
    const html = await renderToHtml(
      <SelectField
        id="state"
        label="State"
        placeholder="Choose state"
        options={options}
      />,
    );

    expect(optionTags(html)[0]).toBe('<option value="">Choose state</option>');
    expect(optionTags(html)).toHaveLength(3);
  });

  it("replaces the options with a disabled loading entry while loading", async () => {
    const html = await renderToHtml(
      <SelectField
        id="state"
        label="State"
        placeholder="Choose state"
        options={options}
        loading
      />,
    );
    const rendered = optionTags(html);

    expect(rendered).toHaveLength(2);
    expect(rendered[1]).toMatch(
      /^<option (value="" disabled=""|disabled="" value="")>Loading\.\.\.<\/option>$/,
    );
    expect(html).not.toContain(">Private<");
  });

  it("translates the loading entry under the pl-PL provider", async () => {
    const html = await renderToHtml(
      withI18n(
        <SelectField
          id="state"
          label="Województwo"
          options={options}
          loading
        />,
        "pl-PL",
      ),
    );

    expect(optionTags(html)[0]).toMatch(/>Ładowanie\.\.\.<\/option>$/);
  });

  it("passes native attributes through to the select", async () => {
    const html = await renderToHtml(
      <SelectField
        id="state"
        label="State"
        options={options}
        data-testid="checkout-pi-state-input"
        autoComplete="off"
        name="countryStateId"
        value="business"
        onChange={() => {}}
      />,
    );
    const select = tag(html, /<select[^>]*>/);

    expect(select).toContain('data-testid="checkout-pi-state-input"');
    expect(select).toMatch(/autocomplete="off"/i);
    expect(select).toContain('name="countryStateId"');
    expect(select).toContain("appearance-none");
    expect(html).toContain(
      '<option value="business" selected="">Company</option>',
    );
  });

  it("leaves the aria wiring off while there is no error", async () => {
    const html = await renderToHtml(
      <SelectField id="state" label="State" options={options} />,
    );
    const select = tag(html, /<select[^>]*>/);

    expect(select).not.toContain('aria-invalid="');
    expect(select).not.toContain("aria-describedby");
    expect(html).not.toContain("state-error");
  });

  it("marks the select invalid and describes it with the error paragraph", async () => {
    const html = await renderToHtml(
      <SelectField
        id="state"
        label="State"
        options={options}
        error="The value is required"
      />,
    );
    const select = tag(html, /<select[^>]*>/);

    expect(select).toContain('aria-invalid="true"');
    expect(select).toContain('aria-describedby="state-error"');
    expect(tag(html, /<p[^>]*id="state-error"[^>]*>/)).toContain(
      "text-states-error",
    );
    expect(html).toContain(">The value is required</p>");
  });

  it("renders the chevron as a decorative overlay", async () => {
    const html = await renderToHtml(
      <SelectField id="state" label="State" options={options} />,
    );
    const svg = tag(html, /<svg[^>]*>/);

    expect(svg).toContain('aria-hidden="true"');
    expect(svg).toContain("pointer-events-none");
  });

  it("marks a required select and its label", async () => {
    const html = await renderToHtml(
      <SelectField id="state" label="State" options={options} required />,
    );

    expect(tag(html, /<select[^>]*>/)).toMatch(/\srequired(=""|\s|>)/);
    expect(html).toContain(
      '>State<span aria-hidden="true" class="ml-0.5 text-states-error">*</span></label>',
    );
  });

  it("renders a plain label for an optional select", async () => {
    const html = await renderToHtml(
      <SelectField id="accountType" label="Account type" options={options} />,
    );

    expect(tag(html, /<select[^>]*>/)).not.toMatch(/\srequired(=""|\s|>)/);
    expect(html).toContain(">Account type</label>");
  });

  it("declares the options language on the data options only", async () => {
    const html = await renderToHtml(
      <SelectField
        id="salutation"
        label="Salutation"
        placeholder="Choose salutation"
        optionsLang="en-US"
        options={[{ label: "Mr.", value: "mr" }]}
      />,
    );

    expect(optionTags(html)).toEqual([
      '<option value="">Choose salutation</option>',
      '<option value="mr" lang="en-US">Mr.</option>',
    ]);
  });
});
