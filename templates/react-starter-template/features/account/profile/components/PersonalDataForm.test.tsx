import { beforeEach, describe, expect, it, vi } from "vitest";

import { fakeCustomer } from "@/features/account/customer/fakeCustomer.fixture";
import { renderToHtml } from "@/test/render";

import {
  businessCustomer,
  profileCustomer,
  salutationOptions,
} from "../profile.fixture";
import { LoginData } from "./LoginData";
import { PersonalDataForm } from "./PersonalDataForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

beforeEach(() => {
  fakeCustomer.reset();
});

describe("PersonalDataForm on the server", () => {
  it("renders the busy skeleton until the customer is read", async () => {
    const html = await renderToHtml(
      <PersonalDataForm salutations={salutationOptions} />,
    );

    expect(html).toContain('data-testid="account-personal-data-loading"');
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("account-personal-data-form");
  });

  it("labels every field and keeps the Vue test ids", async () => {
    fakeCustomer.set({ status: "ready", customer: profileCustomer() });

    const html = await renderToHtml(
      <PersonalDataForm salutations={salutationOptions} />,
    );

    expect(html).toContain('<label for="salutation"');
    expect(html).toContain(">Salutation</label>");
    expect(html).toContain('<option value="">Choose salutation...</option>');
    expect(html).toContain('<label for="accountType"');
    expect(html).toContain('<label for="firstName"');
    expect(html).toContain('<label for="lastName"');
    expect(html).toContain(
      'data-testid="account-personal-data-firstname-input"',
    );
    expect(html).toContain(
      'data-testid="account-personal-data-lastname-input"',
    );
    expect(html).toContain('data-testid="account-personal-data-submit-button"');
    expect(html).toContain('autoComplete="given-name"');
    expect(html).toContain('value="Jane"');
    expect(html).toContain("<span>Change data</span></button>");
    expect(html).not.toContain('id="company"');
    expect(html).not.toContain('aria-invalid="true"');
  });

  it("renders the company and VAT fields for a business customer", async () => {
    fakeCustomer.set({ status: "ready", customer: businessCustomer() });

    const html = await renderToHtml(
      <PersonalDataForm salutations={salutationOptions} />,
    );

    expect(html).toContain('<label for="company"');
    expect(html).toContain(">VAT Registration Number");
    expect(html).toContain('value="Shopware AG"');
    expect(html).toContain('value="DE123456789"');
  });

  it("announces a customer that could not be read", async () => {
    fakeCustomer.set({ status: "error", customer: null });

    const html = await renderToHtml(
      <PersonalDataForm salutations={salutationOptions} />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Try again");
  });
});

describe("LoginData on the server", () => {
  it("shows the email and links to the email and password pages", async () => {
    fakeCustomer.set({ status: "ready", customer: profileCustomer() });

    const html = await renderToHtml(<LoginData />);

    expect(html).toContain("jane@example.com");
    expect(html).toContain('href="/account/profile/change-email"');
    expect(html).toContain("Change email address");
    expect(html).toContain('href="/account/profile/change-password"');
    expect(html).toContain("Change password");
    expect(html.match(/aria-hidden="true"/g)).toHaveLength(2);
  });

  it("renders the links without an email while the customer loads", async () => {
    const html = await renderToHtml(<LoginData />);

    expect(html).toContain(
      '<div class="grow" data-testid="account-login-data-email"></div>',
    );
    expect(html).toContain('href="/account/profile/change-email"');
  });
});
