import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import type { CmsActions } from "@shopware/cms-base-layer-react/client";
import { describe, expect, it, vi } from "vitest";

import { testTranslator, withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { NewsletterBox, validateEmail } from "./NewsletterBox";

const actions: Partial<CmsActions> = {
  subscribeNewsletter: vi.fn(async () => ({ ok: false })),
  notify: vi.fn(),
};

const t = testTranslator();

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
    expect(validateEmail("", t)).toBe("Value is required");
    expect(validateEmail("   ", t)).toBe("Value is required");
  });

  it("rejects values that are not an address", () => {
    expect(validateEmail("foo", t)).toBe("Value is not a valid email address");
    expect(validateEmail("a@b", t)).toBe("Value is not a valid email address");
    expect(validateEmail("a @b.co", t)).toBe(
      "Value is not a valid email address",
    );
  });

  it("returns the message in the translator's language", () => {
    const pl = testTranslator("pl-PL");

    expect(validateEmail("", pl)).toBe("Wartość jest wymagana");
    expect(validateEmail("foo", pl)).toBe(
      "Wartość nie jest prawidłowym adresem e-mail",
    );
  });

  it("accepts a trimmed address", () => {
    expect(validateEmail(" a@b.co ", t)).toBeNull();
    expect(validateEmail("jane.doe+shop@example.co.uk", t)).toBeNull();
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
    expect(button).not.toMatch(/ disabled(="")?[ >]/);
    expect(button).toContain("bg-shell-ink");
    expect(button).toContain("text-shell-on-ink");
    expect(button).toContain("rounded-full");
    expect(html).toContain(">Submit</button>");
  });

  it("keeps the title a paragraph and puts the copy before the form", async () => {
    const html = await render();

    expect(html).not.toMatch(/<h[1-6][ >]/);
    expect(html).toContain(
      '<p class="text-2xl font-semibold tracking-tight text-shell-ink md:text-3xl">Subscribe</p>',
    );
    expect(html.indexOf(">Subscribe</p>")).toBeLessThan(html.indexOf("<form"));
  });

  it("gives the input a visible border and an ink focus ring on the sand band", async () => {
    const html = await render();
    const input = tag(html, /<input [^>]*>/);

    expect(input).toContain("border-shell-ink/60");
    expect(input).toContain("bg-surface-surface");
    expect(input).toContain("focus-visible:ring-shell-ink");
    expect(input).toContain("aria-invalid:border-states-error");
  });

  it("shows no error before the field is touched", async () => {
    const html = await render();
    const input = tag(html, /<input [^>]*>/);

    expect(html).not.toContain("newsletter-email-error");
    expect(html).not.toContain('role="alert"');
    expect(input).not.toContain('aria-invalid="');
    expect(input).not.toContain("aria-describedby");
  });

  it("renders the German copy under the de-DE provider", async () => {
    const html = await renderToHtml(
      withI18n(
        <CmsActionsProvider actions={actions}>
          <NewsletterBox />
        </CmsActionsProvider>,
        "de-DE",
      ),
    );

    expect(html).toContain(">Abonnieren</p>");
    expect(html).toContain(">E-Mail-Adresse</label>");
    expect(html).toContain('placeholder="E-Mail-Adresse eingeben"');
    expect(html).toContain(">Absenden</button>");
    expect(html).not.toContain("Subscribe");
  });

  it("appends the className to the root layout classes", async () => {
    const html = await render("col-span-1 sm:col-span-2");

    expect(
      html.startsWith(
        '<div class="grid gap-6 md:grid-cols-2 md:items-center md:gap-12 col-span-1 sm:col-span-2">',
      ),
    ).toBe(true);
  });
});
