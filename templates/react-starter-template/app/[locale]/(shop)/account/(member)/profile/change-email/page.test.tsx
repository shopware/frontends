import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import ChangeEmailPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

describe("ChangeEmailPage", () => {
  it("is titled like the Vue change email page in the page locale", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "en-GB" }) }),
    ).toEqual({ title: "Change Email Address" });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "de-DE" }) }),
    ).toEqual({ title: "E-Mail-Adresse ändern" });
  });

  it("renders the back link, the headers and the email form", async () => {
    const html = await renderToHtml(
      <ChangeEmailPage params={Promise.resolve({ locale: "en-GB" })} />,
    );

    expect(html).toContain('href="/account/profile"');
    expect(html).toContain('<span aria-hidden="true">&lt;</span>Back');
    expect(html).toContain("Change Email Address</h1>");
    expect(html).toContain("Enter new Email Address</h2>");
    expect(html).toContain('data-testid="account-change-email-form"');
    expect(html).toContain('data-testid="account-personal-data-email-input"');
    expect(html).toContain('id="confirmEmail"');
    expect(html).toContain('autoComplete="current-password"');
    expect(html).not.toContain('aria-invalid="true"');
  });

  it("renders the Polish copy and a prefixed back link under pl-PL", async () => {
    const html = await renderToHtml(
      withI18n(
        <ChangeEmailPage params={Promise.resolve({ locale: "pl-PL" })} />,
        "pl-PL",
      ),
    );

    expect(html).toContain('href="/pl-PL/account/profile"');
    expect(html).toContain('<span aria-hidden="true">&lt;</span>Powrót');
    expect(html).toContain("Zmień adres e-mail</h1>");
  });
});
