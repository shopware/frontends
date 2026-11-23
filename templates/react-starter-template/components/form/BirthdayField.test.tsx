import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { BirthdayField } from "./BirthdayField";
import type { BirthdayFieldProps } from "./BirthdayField";

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

function select(html: string, id: string): string {
  return tag(html, new RegExp(`<select[^>]*id="${id}"[^>]*>`));
}

function render(
  props: Partial<BirthdayFieldProps> = {},
  locale: "en-GB" | "pl-PL" | "de-DE" = "en-GB",
) {
  return renderToHtml(
    withI18n(
      <BirthdayField
        testIdPrefix="registration-birthday"
        birthYearMax={2026}
        value={{ day: "", month: "", year: "" }}
        onChange={() => {}}
        {...props}
      />,
      locale,
    ),
  );
}

describe("BirthdayField", () => {
  it("groups three labelled selects under the legend", async () => {
    const html = await render();

    expect(html).toMatch(/<fieldset[^>]*><legend[^>]*>Date of birth<\/legend>/);
    for (const [part, label] of [
      ["day", "Day"],
      ["month", "Month"],
      ["year", "Year"],
    ]) {
      expect(html).toContain(
        `<label for="birthday-${part}" class="sr-only">${label}</label>`,
      );
      const element = select(html, `birthday-${part}`);
      expect(element).toContain(
        `data-testid="registration-birthday-${part}-select"`,
      );
      expect(element.toLowerCase()).toContain(`autocomplete="bday-${part}"`);
      expect(element).not.toMatch(/\srequired(=""|\s|>)/);
      expect(element).not.toContain('aria-invalid="');
    }
    expect(html).toContain('<option value="" selected="">Day</option>');
    expect(html).toContain('<option value="" selected="">Month</option>');
    expect(html).toContain('<option value="" selected="">Year</option>');
    expect(html).toContain('<option value="12">December</option>');
    expect(html).toContain('<option value="2026">2026</option>');
    expect(html).toContain('<option value="1900">1900</option>');
    expect(html).not.toContain('value="2027"');
  });

  it("marks every select and the legend when the birthday is required", async () => {
    const html = await render({ required: true });

    expect(html).toContain(
      'Date of birth<span aria-hidden="true" class="ml-0.5 text-states-error">*</span></legend>',
    );
    for (const part of ["day", "month", "year"]) {
      expect(select(html, `birthday-${part}`)).toMatch(/\srequired(=""|\s|>)/);
    }
  });

  it("shows the first part error once and marks only the parts that carry one", async () => {
    const html = await render({
      errors: { month: "Value is required", year: "Value is required" },
    });

    expect(html.match(/Value is required/g)).toHaveLength(1);
    expect(tag(html, /<p id="birthday-error"[^>]*>[^<]*<\/p>/)).toContain(
      ">Value is required</p>",
    );
    expect(select(html, "birthday-day")).not.toContain('aria-invalid="');
    for (const part of ["month", "year"]) {
      const element = select(html, `birthday-${part}`);
      expect(element).toContain('aria-invalid="true"');
      expect(element).toContain('aria-describedby="birthday-error"');
    }
  });

  it("shows the error of the earliest part when the parts carry different ones", async () => {
    const html = await render({
      errors: {
        day: "Enter a valid date of birth.",
        year: "Value is required",
      },
    });

    expect(tag(html, /<p id="birthday-error"[^>]*>[^<]*<\/p>/)).toContain(
      ">Enter a valid date of birth.</p>",
    );
    expect(html).not.toContain("Value is required");
  });

  it("selects the given parts", async () => {
    const html = await render({
      value: { day: "29", month: "2", year: "2000" },
    });

    expect(html).toContain('<option value="29" selected="">29</option>');
    expect(html).toContain('<option value="2" selected="">February</option>');
    expect(html).toContain('<option value="2000" selected="">2000</option>');
  });

  it("names the parts and the months in Polish and German", async () => {
    const polish = await render({}, "pl-PL");
    expect(polish).toContain(">Data urodzenia</legend>");
    expect(polish).toContain('<option value="" selected="">Dzień</option>');
    expect(polish).toContain('<option value="1">styczeń</option>');

    const german = await render({}, "de-DE");
    expect(german).toContain(">Geburtsdatum</legend>");
    expect(german).toContain('<option value="" selected="">Monat</option>');
    expect(german).toContain('<option value="3">März</option>');
  });

  it("renders no test ids without a prefix", async () => {
    const html = await render({ testIdPrefix: undefined, id: "dob" });

    expect(html).not.toContain("data-testid");
    expect(html).toContain('id="dob-day"');
  });
});
