import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import type { CmsActions } from "@shopware/cms-base-layer-react/client";
import { describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import { NewsletterBox, validateEmail } from "./NewsletterBox";

const actions: Partial<CmsActions> = {
  subscribeNewsletter: vi.fn(async () => ({ ok: false })),
  notify: vi.fn(),
};

function render(className?: string) {
  return renderToHtml(
    <CmsActionsProvider actions={actions}>
      <NewsletterBox className={className} />
    </CmsActionsProvider>,
  );
}

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

describe("validateEmail", () => {
  it("requires a non-blank value", () => {
    expect(validateEmail("")).toBe("Value is required");
    expect(validateEmail("   ")).toBe("Value is required");
  });

  it("rejects values that are not an address", () => {
    expect(validateEmail("foo")).toBe("Value is not a valid email address");
    expect(validateEmail("a@b")).toBe("Value is not a valid email address");
    expect(validateEmail("a @b.co")).toBe("Value is not a valid email address");
  });

  it("accepts a trimmed address", () => {
    expect(validateEmail(" a@b.co ")).toBeNull();
    expect(validateEmail("jane.doe+shop@example.co.uk")).toBeNull();
  });
});

describe("NewsletterBox", () => {
  it("renders the title, description and privacy sentence", async () => {
    const html = await render();

    expect(html).toContain(">Subscribe</p>");
    expect(html).toContain(
      ">Receive the latest updates about offers and community updates.</p>",
    );
    expect(html).toContain(
      ">By submitting you automatically agree to our privacy policy.</p>",
    );
  });

  it("wires the visually hidden label to the email input", async () => {
    const html = await render();
    const label = tag(html, /<label [^>]*>/);
    const input = tag(html, /<input [^>]*>/);

    expect(label).toContain('for="newsletter-email"');
    expect(label).toContain("sr-only");
    expect(html).toContain(">Email address</label>");
    expect(input).toContain('id="newsletter-email"');
    expect(input).toContain('name="email"');
    expect(input).toContain('type="email"');
    expect(input).toContain("required");
    expect(input.toLowerCase()).toContain('autocomplete="email"');
    expect(input).toContain('placeholder="Enter Email Address"');
  });

  it("renders a submit button with the Vue copy inside a non-validating form", async () => {
    const html = await render();
    const form = tag(html, /<form [^>]*>/);
    const button = tag(html, /<button [^>]*>/);

    expect(form.toLowerCase()).toContain("novalidate");
    expect(button).toContain('type="submit"');
    expect(button).not.toContain("disabled");
    expect(html).toContain(">Submit</span>");
  });

  it("shows no error before the field is touched", async () => {
    const html = await render();
    const input = tag(html, /<input [^>]*>/);

    expect(html).not.toContain("newsletter-email-error");
    expect(html).not.toContain('role="alert"');
    expect(input).not.toContain('aria-invalid="');
    expect(input).not.toContain("aria-describedby");
  });

  it("passes the className to the root element", async () => {
    const html = await render("col-span-1 sm:col-span-2");

    expect(html.startsWith('<div class="col-span-1 sm:col-span-2">')).toBe(
      true,
    );
  });
});
