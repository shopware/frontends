import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import ChangePasswordPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

describe("ChangePasswordPage", () => {
  it("is titled like the Vue change password page in the page locale", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "en-GB" }) }),
    ).toEqual({ title: "Change password" });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "de-DE" }) }),
    ).toEqual({ title: "Passwort ändern" });
  });

  it("renders the back link, the headers and the password form", async () => {
    const html = await renderToHtml(
      <ChangePasswordPage params={Promise.resolve({ locale: "en-GB" })} />,
    );

    expect(html).toContain('href="/account/profile"');
    expect(html).toContain("Change password</h1>");
    expect(html).toContain("Enter new password</h2>");
    expect(html).toContain('data-testid="account-change-password-form"');
    expect(html).toContain('id="newPassword"');
    expect(html).toContain('id="newPasswordConfirm"');
    expect(html).toContain('id="currentPassword"');
    expect(html.match(/type="password"/g)).toHaveLength(3);
  });

  it("renders the Polish copy and a prefixed back link under pl-PL", async () => {
    const html = await renderToHtml(
      withI18n(
        <ChangePasswordPage params={Promise.resolve({ locale: "pl-PL" })} />,
        "pl-PL",
      ),
    );

    expect(html).toContain('href="/pl-PL/account/profile"');
    expect(html).toContain('<span aria-hidden="true">&lt;</span>Powrót');
    expect(html).toContain("Zmień hasło</h1>");
  });
});
