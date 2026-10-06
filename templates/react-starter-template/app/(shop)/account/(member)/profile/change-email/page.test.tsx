import { describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import ChangeEmailPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

describe("ChangeEmailPage", () => {
  it("is titled like the Vue change email page", () => {
    expect(metadata.title).toBe("Change Email Address");
  });

  it("renders the back link, the headers and the email form", async () => {
    const html = await renderToHtml(<ChangeEmailPage />);

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
});
