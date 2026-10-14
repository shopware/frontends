import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import RecoverPasswordPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

function params(locale: string) {
  return Promise.resolve({ locale });
}

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

describe("RecoverPasswordPage", () => {
  it("is titled in the page locale and stays out of search indexes", async () => {
    expect(await generateMetadata({ params: params("en-GB") })).toEqual({
      title: "Password recovery",
      robots: { index: false, follow: true },
    });
    expect((await generateMetadata({ params: params("pl-PL") })).title).toBe(
      "Odzyskiwanie hasła",
    );
  });

  it("renders the heading and the request form in the static HTML", async () => {
    const html = await renderToHtml(
      <RecoverPasswordPage params={params("en-GB")} />,
    );

    expect(html).toMatch(/<h1[^>]*>Password recovery<\/h1>/);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain(
      ">We will send you an email with a link to reset your password.</p>",
    );
    expect(html).toContain(
      ">Fields marked with asterisks (*) are required.</p>",
    );
    const form = tag(html, /<form [^>]*>/);
    expect(form).toContain('data-testid="account-recover-password-form"');
    expect(form.toLowerCase()).toContain("novalidate");
    const email = tag(
      html,
      /<input[^>]*data-testid="account-recover-password-email-input"[^>]*>/,
    );
    expect(email).toContain('id="recover-password-email"');
    expect(email).toContain('type="email"');
    expect(email.toLowerCase()).toContain('autocomplete="email"');
    expect(email).toMatch(/\srequired(=""|\s|>)/);
    expect(html).toContain('<label for="recover-password-email"');
    expect(
      tag(
        html,
        /<button[^>]*data-testid="account-recover-password-submit-button"[^>]*>/,
      ),
    ).toContain('type="submit"');
    expect(html).toContain(">Request email</span>");
    expect(
      tag(
        html,
        /<a[^>]*data-testid="account-recover-password-back-link"[^>]*>/,
      ),
    ).toContain('href="/account/login"');
    expect(html).toContain(">Back to sign in</a>");
    expect(html).not.toContain('role="alert"');
    expect(html).not.toContain("account-recover-password-success");
  });

  it("speaks Polish and links to the prefixed login page", async () => {
    const html = await renderToHtml(
      withI18n(<RecoverPasswordPage params={params("pl-PL")} />, "pl-PL"),
    );

    expect(html).toMatch(/<h1[^>]*>Odzyskiwanie hasła<\/h1>/);
    expect(html).toContain(">Wyślij e-mail</span>");
    expect(
      tag(
        html,
        /<a[^>]*data-testid="account-recover-password-back-link"[^>]*>/,
      ),
    ).toContain('href="/pl-PL/account/login"');
    expect(html).toContain(">Wróć do logowania</a>");
  });
});
