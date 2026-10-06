import { beforeEach, describe, expect, it, vi } from "vitest";

import { fakeCustomer } from "@/features/account/customer/fakeCustomer.fixture";
import { profileCustomer } from "@/features/account/profile/profile.fixture";
import { loadProfileReferences } from "@/features/account/profile/profileReferences";
import { renderToHtml } from "@/test/render";

import ProfilePage, { metadata } from "./page";

const server = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));

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
  it("is titled like the Vue profile page", () => {
    expect(metadata.title).toBe("Your profile");
  });

  it("renders the headers, the personal data form with the salutations and the login data", async () => {
    fakeCustomer.set({ status: "ready", customer: profileCustomer() });

    const html = await renderToHtml(<ProfilePage />);

    expect(server.connection).toHaveBeenCalledTimes(1);
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
});
