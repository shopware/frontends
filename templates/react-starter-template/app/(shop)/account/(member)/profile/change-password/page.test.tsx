import { describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import ChangePasswordPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

describe("ChangePasswordPage", () => {
  it("is titled like the Vue change password page", () => {
    expect(metadata.title).toBe("Change password");
  });

  it("renders the back link, the headers and the password form", async () => {
    const html = await renderToHtml(<ChangePasswordPage />);

    expect(html).toContain('href="/account/profile"');
    expect(html).toContain("Change password</h1>");
    expect(html).toContain("Enter new password</h2>");
    expect(html).toContain('data-testid="account-change-password-form"');
    expect(html).toContain('id="newPassword"');
    expect(html).toContain('id="newPasswordConfirm"');
    expect(html).toContain('id="currentPassword"');
    expect(html.match(/type="password"/g)).toHaveLength(3);
  });
});
