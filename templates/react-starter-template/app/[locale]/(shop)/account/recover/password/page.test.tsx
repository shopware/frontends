import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import ResetPasswordPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

function params(locale: string) {
  return Promise.resolve({ locale });
}

describe("ResetPasswordPage", () => {
  it("keeps the link out of search indexes and referrers", async () => {
    expect(await generateMetadata({ params: params("en-GB") })).toEqual({
      title: "Set a new password",
      robots: { index: false, follow: false },
      referrer: "no-referrer",
    });
    expect((await generateMetadata({ params: params("de-DE") })).title).toBe(
      "Neues Passwort festlegen",
    );
  });

  it("renders the heading and the skeleton in the static HTML, never the form", async () => {
    const html = await renderToHtml(
      <ResetPasswordPage params={params("en-GB")} />,
    );

    expect(html).toMatch(/<h1[^>]*>Set a new password<\/h1>/);
    expect(html).toMatch(
      /<div[^>]*aria-busy="true"[^>]*data-testid="account-reset-password-skeleton"/,
    );
    expect(html).toContain('<output class="sr-only">Loading...</output>');
    expect(html).not.toContain("<form");
    expect(html).not.toContain('type="password"');
    expect(html).not.toContain("account-reset-password-link-error");
  });

  it("speaks Polish", async () => {
    const html = await renderToHtml(
      withI18n(<ResetPasswordPage params={params("pl-PL")} />, "pl-PL"),
    );

    expect(html).toMatch(/<h1[^>]*>Ustaw nowe hasło<\/h1>/);
    expect(html).toContain("Ładowanie...");
  });
});
