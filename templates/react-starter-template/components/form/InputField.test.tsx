import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { InputField } from "./InputField";

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

describe("InputField", () => {
  it("links the label to the input through the id", async () => {
    const html = await renderToHtml(
      <InputField id="email" label="Email address" />,
    );

    expect(tag(html, /<label[^>]*>/)).toContain('for="email"');
    expect(html).toContain(">Email address</label>");
    expect(tag(html, /<input[^>]*>/)).toContain('id="email"');
  });

  it("passes native attributes through to the input", async () => {
    const html = await renderToHtml(
      <InputField
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        data-testid="registration-email-input"
        name="email"
        value="jane@example.com"
        readOnly
      />,
    );
    const input = tag(html, /<input[^>]*>/);

    expect(input).toContain('type="email"');
    expect(input).toMatch(/autocomplete="email"/i);
    expect(input).toContain('data-testid="registration-email-input"');
    expect(input).toContain('name="email"');
    expect(input).toContain('value="jane@example.com"');
    expect(input).toContain("px-3");
  });

  it("leaves the aria wiring off while there is no error", async () => {
    const html = await renderToHtml(
      <InputField id="email" label="Email address" />,
    );
    const input = tag(html, /<input[^>]*>/);

    expect(input).not.toContain('aria-invalid="');
    expect(input).not.toContain("aria-describedby");
    expect(html).not.toContain("email-error");
  });

  it("marks the input invalid and describes it with the error paragraph", async () => {
    const html = await renderToHtml(
      <InputField id="email" label="Email address" error="Value is required" />,
    );
    const input = tag(html, /<input[^>]*>/);

    expect(input).toContain('aria-invalid="true"');
    expect(input).toContain('aria-describedby="email-error"');
    expect(tag(html, /<p[^>]*id="email-error"[^>]*>/)).toContain(
      "text-states-error",
    );
    expect(html).toContain(">Value is required</p>");
  });

  it("describes the input with a hint", async () => {
    const html = await renderToHtml(
      <InputField
        id="password"
        label="Password"
        hint="At least 8 characters"
      />,
    );
    const input = tag(html, /<input[^>]*>/);

    expect(input).toContain('aria-describedby="password-hint"');
    expect(input).not.toContain('aria-invalid="');
    expect(tag(html, /<p[^>]*id="password-hint"[^>]*>/)).toContain(
      "text-surface-on-surface-variant",
    );
    expect(html).toContain(">At least 8 characters</p>");
  });

  it("describes the input with the hint and the error together", async () => {
    const html = await renderToHtml(
      <InputField
        id="password"
        label="Password"
        hint="At least 8 characters"
        error="This minimum length should be at least 8"
      />,
    );

    expect(tag(html, /<input[^>]*>/)).toContain(
      'aria-describedby="password-hint password-error"',
    );
    expect(html).toContain(">At least 8 characters</p>");
    expect(html).toContain(">This minimum length should be at least 8</p>");
  });

  it("marks a required input and adds a decorative asterisk to its label", async () => {
    const html = await renderToHtml(
      <InputField id="email" label="Email address" required />,
    );

    expect(tag(html, /<input[^>]*>/)).toMatch(/\srequired(=""|\s|>)/);
    expect(html).toContain(
      '>Email address<span aria-hidden="true" class="ml-0.5 text-states-error">*</span></label>',
    );
  });

  it("renders a plain label for an optional input", async () => {
    const html = await renderToHtml(<InputField id="vatId" label="VAT ID" />);

    expect(tag(html, /<input[^>]*>/)).not.toMatch(/\srequired(=""|\s|>)/);
    expect(html).toContain(">VAT ID</label>");
  });

  it("puts the className on the wrapper, not the input", async () => {
    const html = await renderToHtml(
      <InputField
        id="firstName"
        label="First name"
        className="md:col-span-4"
      />,
    );

    expect(tag(html, /<div[^>]*>/)).toContain('class="md:col-span-4"');
    expect(tag(html, /<input[^>]*>/)).not.toContain("md:col-span-4");
  });
});
