import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import { FormPrivacyCheckbox, FormShell, FormTextField } from "./formParts";
import { IS_TRUE_MESSAGE, REQUIRED_MESSAGE } from "./formValidation";

const field = { ref: () => {}, onBlur: () => {}, required: true };

describe("FormTextField", () => {
  const props = {
    ...field,
    className: "col-span-4",
    id: "f-first-name",
    name: "first-name",
    autoComplete: "given-name",
    label: "First name",
    placeholder: "Enter first name...",
    value: "",
    onChange: () => {},
  };

  it("links an invalid control to its error message", async () => {
    const html = await renderToHtml(
      <FormTextField {...props} error={REQUIRED_MESSAGE} />,
    );

    expect(html).toContain('<label for="f-first-name">First name *</label>');
    expect(html).toContain('name="first-name"');
    expect(html).toContain('autoComplete="given-name"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-required="true"');
    expect(html).toContain('aria-describedby="f-first-name-error"');
    expect(html).toContain(`<span id="f-first-name-error"`);
    expect(html).toContain(`>${REQUIRED_MESSAGE}</span>`);
    expect(html).toContain("focus:ring-2 focus:ring-brand-primary");
  });

  it("renders a valid control without a description and a textarea for rows", async () => {
    const html = await renderToHtml(
      <FormTextField {...props} error={undefined} rows={5} />,
    );

    expect(html).toContain("<textarea");
    expect(html).toContain('aria-invalid="false"');
    expect(html).not.toContain("aria-describedby");
    expect(html).not.toContain("-error");
  });
});

describe("FormPrivacyCheckbox", () => {
  it("states the error in text, not only in colour", async () => {
    const html = await renderToHtml(
      <FormPrivacyCheckbox
        {...field}
        id="f-privacy"
        legend="Privacy"
        label="I have read the data protection information."
        checked={false}
        onChange={() => {}}
        error={IS_TRUE_MESSAGE}
      />,
    );

    expect(html).toContain("<legend>Privacy *</legend>");
    expect(html).toContain('name="privacy"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="f-privacy-error"');
    expect(html).toContain(`>${IS_TRUE_MESSAGE}</span>`);
  });
});

describe("FormShell", () => {
  const shell = {
    title: "Contact",
    confirmation: "Thank you",
    submitLabel: "Submit",
    onSubmit: () => {},
  };

  it("keeps an empty status region next to the form and disables submit while loading", async () => {
    const html = await renderToHtml(
      <FormShell {...shell} loading sent={false}>
        <span>fields</span>
      </FormShell>,
    );

    expect(html).toContain('<div role="status"></div>');
    expect(html).toContain("<span>fields</span>");
    expect(html).toMatch(/<button[^>]*type="submit"[^>]*disabled=""/);
  });

  it("announces the confirmation in the status region once sent", async () => {
    const html = await renderToHtml(
      <FormShell {...shell} loading={false} sent>
        <span>fields</span>
      </FormShell>,
    );

    expect(html).toContain(
      '<div role="status"><p class="py-10 text-lg text-center">Thank you</p></div>',
    );
    expect(html).not.toContain("<span>fields</span>");
    expect(html).not.toContain('type="submit"');
  });
});
