import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import NewsletterSubscribePage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

function params(locale: string) {
  return Promise.resolve({ locale });
}

describe("NewsletterSubscribePage", () => {
  it("names the page and keeps the link out of search indexes", async () => {
    expect(await generateMetadata({ params: params("en-GB") })).toEqual({
      title: "Newsletter subscription",
      robots: { index: false, follow: false },
    });
    expect((await generateMetadata({ params: params("pl-PL") })).title).toBe(
      "Subskrypcja newslettera",
    );
  });

  it("renders the heading and the pending status in the static HTML", async () => {
    const html = await renderToHtml(<NewsletterSubscribePage />);

    expect(html).toContain('data-testid="newsletter-confirm-page"');
    expect(html).toMatch(/<h1[^>]*>Newsletter subscription<\/h1>/);
    expect(html).toMatch(
      /<output[^>]*data-state="pending"[^>]*>[\s\S]*Confirming your newsletter subscription\.\.\.[\s\S]*<\/output>/,
    );
    expect(html).not.toContain("email-link-home-link");
  });

  it("speaks German", async () => {
    const html = await renderToHtml(
      withI18n(<NewsletterSubscribePage />, "de-DE"),
    );

    expect(html).toMatch(/<h1[^>]*>Newsletter-Anmeldung<\/h1>/);
  });
});
