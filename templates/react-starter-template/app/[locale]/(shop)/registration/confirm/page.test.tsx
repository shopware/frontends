import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import RegistrationConfirmPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

function params(locale: string) {
  return Promise.resolve({ locale });
}

describe("RegistrationConfirmPage", () => {
  it("names the page and keeps the link out of search indexes", async () => {
    expect(await generateMetadata({ params: params("en-GB") })).toEqual({
      title: "Account confirmation",
      robots: { index: false, follow: false },
    });
    expect((await generateMetadata({ params: params("de-DE") })).title).toBe(
      "Kontobestätigung",
    );
  });

  it("renders the heading and the pending status in the static HTML", async () => {
    const html = await renderToHtml(<RegistrationConfirmPage />);

    expect(html).toContain('data-testid="registration-confirm-page"');
    expect(html).toMatch(/<h1[^>]*>Account confirmation<\/h1>/);
    expect(html).toMatch(
      /<output[^>]*data-state="pending"[^>]*>[\s\S]*Verifying your account\.\.\.[\s\S]*<\/output>/,
    );
    expect(html).not.toContain("email-link-retry-button");
  });

  it("speaks Polish", async () => {
    const html = await renderToHtml(
      withI18n(<RegistrationConfirmPage />, "pl-PL"),
    );

    expect(html).toMatch(/<h1[^>]*>Potwierdzenie konta<\/h1>/);
    expect(html).toContain("Weryfikowanie Twojego konta...");
  });
});
