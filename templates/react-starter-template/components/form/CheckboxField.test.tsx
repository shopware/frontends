import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { CheckboxField } from "./CheckboxField";
import type { CheckboxFieldProps } from "./CheckboxField";

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

function render(props: Partial<CheckboxFieldProps> = {}) {
  return renderToHtml(
    <CheckboxField
      id="privacy"
      label="I have read the data protection information."
      checked={false}
      onChange={() => {}}
      {...props}
    />,
  );
}

describe("CheckboxField", () => {
  it("wraps the checkbox and its text in a label for the checkbox", async () => {
    const html = await render({ "data-testid": "privacy-checkbox" });

    expect(tag(html, /<label[^>]*>/)).toContain('for="privacy"');
    const input = tag(html, /<input[^>]*>/);
    expect(input).toContain('id="privacy"');
    expect(input).toContain('type="checkbox"');
    expect(input).toContain('data-testid="privacy-checkbox"');
    expect(input).not.toMatch(/\schecked(=""|\s|>)/);
    expect(html).toMatch(
      /<label[^>]*><input[^>]*\/?><span[^>]*>I have read the data protection information\.<\/span><\/label>/,
    );
  });

  it("marks a required checkbox with the native flag and a hidden asterisk", async () => {
    const html = await render({ required: true, checked: true });

    const input = tag(html, /<input[^>]*>/);
    expect(input).toMatch(/\srequired(=""|\s|>)/);
    expect(input).toMatch(/\schecked(=""|\s|>)/);
    expect(html).toContain(
      'information.<span aria-hidden="true" class="ml-0.5 text-states-error">*</span></span>',
    );
  });

  it("describes an invalid checkbox with its error", async () => {
    const html = await render({ error: "Please confirm." });

    const input = tag(html, /<input[^>]*>/);
    expect(input).toContain('aria-invalid="true"');
    expect(input).toContain('aria-describedby="privacy-error"');
    expect(html).toContain(
      '<p id="privacy-error" class="mt-1 block text-xs text-states-error">Please confirm.</p>',
    );
  });

  it("leaves the aria wiring off without an error", async () => {
    const html = await render();

    expect(html).not.toContain("aria-invalid");
    expect(html).not.toContain("aria-describedby");
    expect(html).not.toContain("privacy-error");
  });
});
