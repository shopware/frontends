import { beforeEach, describe, expect, it, vi } from "vitest";

import { fakeCustomer } from "@/features/account/customer/fakeCustomer.fixture";
import { profileCustomer } from "@/features/account/profile/profile.fixture";
import { loadProfileReferences } from "@/features/account/profile/profileReferences";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import ProfilePage, { generateMetadata } from "./page";

const server = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));

vi.mock("server-only", () => ({}));

vi.mock("next/server", () => ({ connection: server.connection }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/features/account/profile/profileReferences", () => ({
  loadProfileReferences: vi.fn(),
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

beforeEach(() => {
  server.connection.mockClear();
  fakeCustomer.reset();
  vi.mocked(loadProfileReferences).mockResolvedValue({
    salutations: [{ label: "Mr.", value: "salutation-mr" }],
    salutationsUnavailable: false,
  });
});

describe("ProfilePage", () => {
  it("is titled like the Vue profile page in the page locale", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "en-GB" }) }),
    ).toEqual({ title: "Your profile" });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "de-DE" }) }),
    ).toEqual({ title: "Ihr Profil" });
  });

  it("renders the headers, the personal data form with the salutations and the login data", async () => {
    fakeCustomer.set({ status: "ready", customer: profileCustomer() });

    const html = await renderToHtml(
      <ProfilePage params={Promise.resolve({ locale: "en-GB" })} />,
    );

    expect(server.connection).toHaveBeenCalledTimes(1);
    expect(loadProfileReferences).toHaveBeenCalledExactlyOnceWith("en-GB");
    expect(html).toContain("Your profile</h1>");
    expect(html).toContain("Check your personal data.");
    expect(html).toContain("Personal data</h2>");
    expect(html).toContain("Login data</h2>");
    expect(html).toContain(
      'data-testid="account-personal-data-firstname-input"',
    );
    expect(html).toContain(
      '<option value="salutation-mr" selected="">Mr.</option>',
    );
    expect(html).toContain('href="/account/profile/change-email"');
    expect(html).toContain('href="/account/profile/change-password"');
    expect(html).toContain("jane@example.com");
  });

  it("renders the Polish headers, links prefixed with the locale and the references for pl-PL", async () => {
    fakeCustomer.set({ status: "ready", customer: profileCustomer() });

    const html = await renderToHtml(
      withI18n(
        <ProfilePage params={Promise.resolve({ locale: "pl-PL" })} />,
        "pl-PL",
      ),
    );

    expect(loadProfileReferences).toHaveBeenCalledWith("pl-PL");
    expect(html).toContain("Twoje konto</h1>");
    expect(html).toContain("Sprawdź swoje dane osobowe.");
    expect(html).toContain("Dane logowania</h2>");
    expect(html).toContain('href="/pl-PL/account/profile/change-email"');
    expect(html).toContain('href="/pl-PL/account/profile/change-password"');
    expect(html).toContain("Zmień email");
  });
});
