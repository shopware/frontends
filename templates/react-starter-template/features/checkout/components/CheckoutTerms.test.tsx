import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import type { LegalLinks } from "../checkoutSettings";
import { emptyCheckoutTerms } from "../checkoutTerms";
import type {
  CheckoutTermsErrors,
  CheckoutTermsRequirements,
} from "../checkoutTerms";
import { CheckoutTerms } from "./CheckoutTerms";

const NO_LINKS: LegalLinks = { terms: null, revocation: null };

const NOTHING_ELSE: CheckoutTermsRequirements = {
  revocation: false,
  dataProtection: false,
};

function render({
  errors = {},
  requirements = NOTHING_ELSE,
  legalLinks = NO_LINKS,
}: {
  errors?: CheckoutTermsErrors;
  requirements?: CheckoutTermsRequirements;
  legalLinks?: LegalLinks;
} = {}) {
  return (
    <CheckoutTerms
      values={emptyCheckoutTerms}
      errors={errors}
      requirements={requirements}
      legalLinks={legalLinks}
      onChange={() => {}}
    />
  );
}

function checkbox(html: string, testId: string): string {
  const match = html.match(
    new RegExp(`<input[^>]*data-testid="${testId}"[^>]*>`),
  );
  expect(match, testId).not.toBeNull();
  return match?.[0] ?? "";
}

describe("CheckoutTerms", () => {
  it("renders the required terms checkbox in a labelled group with the Vue test ids", async () => {
    const html = await renderToHtml(render());

    expect(html).toMatch(
      /^<fieldset data-testid="checkout-terms-box" class="[^"]*"><legend[^>]*>Terms and conditions<\/legend>/,
    );
    expect(html).toContain('<div data-testid="checkout-t&amp;c-tos">');
    const tos = checkbox(html, "checkout-t&amp;c-checkbox-tos");
    expect(tos).toContain('type="checkbox"');
    expect(tos).toContain('id="tos"');
    expect(tos).toContain('required=""');
    expect(tos).not.toContain("aria-invalid");
    expect(html).toMatch(
      /<label for="tos"[^>]*>I have read and accepted the general terms and conditions\.<span aria-hidden="true"[^>]*>\*<\/span><\/label>/,
    );
    expect(html).not.toContain("<a ");
    expect(html).not.toContain("checkout-t&amp;c-revocation");
    expect(html).not.toContain("checkout-t&amp;c-data-protection");
    expect(html).not.toContain("Please note our");
  });

  it("ties a visible error to its checkbox", async () => {
    const html = await renderToHtml(
      render({ errors: { tos: "Please accept the terms." } }),
    );

    const tos = checkbox(html, "checkout-t&amp;c-checkbox-tos");
    expect(tos).toContain('aria-invalid="true"');
    expect(tos).toContain('aria-describedby="tos-error"');
    expect(html).toMatch(
      /<p id="tos-error" class="[^"]*text-states-error[^"]*">Please accept the terms\.<\/p>/,
    );
  });

  it("links the terms page in a new tab without prefetching it", async () => {
    const html = await renderToHtml(
      render({ legalLinks: { terms: "/navigation/terms", revocation: null } }),
    );

    expect(html).toMatch(
      /I have read and accepted the <a [^>]*href="\/navigation\/terms"[^>]*>general terms and conditions<span class="sr-only"> <!-- -->\(opens in a new tab\)<\/span><\/a>\./,
    );
    const link = html.match(/<a [^>]*>/)?.[0] ?? "";
    expect(link).toContain('target="_blank"');
    expect(link).toContain('rel="noopener"');
    expect(checkbox(html, "checkout-t&amp;c-checkbox-tos")).toContain(
      'aria-label="I have read and accepted the general terms and conditions."',
    );
  });

  it("names the terms checkbox with the plain sentence when there is no link", async () => {
    const html = await renderToHtml(render());

    expect(checkbox(html, "checkout-t&amp;c-checkbox-tos")).toContain(
      'aria-label="I have read and accepted the general terms and conditions."',
    );
  });

  it("links an external terms page with noreferrer", async () => {
    const html = await renderToHtml(
      render({
        legalLinks: { terms: "https://legal.example/agb", revocation: null },
      }),
    );

    const link = html.match(/<a [^>]*>/)?.[0] ?? "";
    expect(link).toContain('href="https://legal.example/agb"');
    expect(link).toContain('target="_blank"');
    expect(link).toContain('rel="noopener noreferrer"');
  });

  it("shows the cancellation policy notice only with its link", async () => {
    const html = await renderToHtml(
      render({ legalLinks: { terms: null, revocation: "/navigation/cancel" } }),
    );

    expect(html).toMatch(
      /<p class="[^"]*">Please note our <a [^>]*href="\/navigation\/cancel"[^>]*>cancellation policy<span class="sr-only">/,
    );
  });

  it("asks for the revocation waiver and the data protection when required", async () => {
    const html = await renderToHtml(
      render({
        requirements: { revocation: true, dataProtection: true },
        errors: { dataProtection: "Please confirm." },
      }),
    );

    expect(html).toContain('<div data-testid="checkout-t&amp;c-revocation">');
    expect(checkbox(html, "checkout-t&amp;c-checkbox-revocation")).toContain(
      'id="revocation"',
    );
    expect(html).toContain(
      "I want immediate access to the digital content and I acknowledge that thereby I waive my right to cancel.",
    );
    const dataProtection = checkbox(
      html,
      "checkout-t&amp;c-checkbox-data-protection",
    );
    expect(dataProtection).toContain('id="data-protection"');
    expect(dataProtection).toContain('required=""');
    expect(dataProtection).toContain(
      'aria-describedby="data-protection-error"',
    );
    expect(html).toMatch(
      /<label for="data-protection"[^>]*>I have read the data protection information\./,
    );
  });
});

describe("CheckoutTerms in other locales", () => {
  it("renders the German labels around the link", async () => {
    const html = await renderToHtml(
      withI18n(
        render({
          legalLinks: { terms: "/navigation/agb", revocation: null },
          requirements: { revocation: false, dataProtection: true },
        }),
        "de-DE",
      ),
    );

    expect(html).toContain(">Allgemeine Geschäftsbedingungen</legend>");
    expect(html).toMatch(
      /Ich habe die <a [^>]*href="\/de-DE\/navigation\/agb"[^>]*>Allgemeinen Geschäftsbedingungen<span class="sr-only"> <!-- -->\(öffnet in einem neuen Tab\)<\/span><\/a> gelesen und akzeptiert\./,
    );
    expect(html).toContain("Ich habe die Datenschutzinformationen gelesen.");
    expect(checkbox(html, "checkout-t&amp;c-checkbox-tos")).toContain(
      'aria-label="Ich habe die Allgemeinen Geschäftsbedingungen gelesen und akzeptiert."',
    );
  });
});
