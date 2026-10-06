import { beforeEach, describe, expect, it, vi } from "vitest";

import { germany } from "@/components/form/countries.fixture";
import { loadAddressReferences } from "@/features/account/address/addressReferences";
import { renderToHtml } from "@/test/render";

import NewAddressPage, { metadata } from "./page";

const server = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));

vi.mock("next/server", () => ({ connection: server.connection }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/features/account/address/addressReferences", () => ({
  loadAddressReferences: vi.fn(),
}));

beforeEach(() => {
  server.connection.mockClear();
  vi.mocked(loadAddressReferences).mockReset();
  vi.mocked(loadAddressReferences).mockResolvedValue({
    countries: [germany],
    countriesUnavailable: false,
    salutations: [{ label: "Mr.", value: "salutation-mr" }],
    salutationsUnavailable: false,
  });
});

describe("NewAddressPage", () => {
  it("is titled like the Vue new address header", () => {
    expect(metadata.title).toBe("New address");
  });

  it("renders the headers and the address form with the loaded references", async () => {
    const html = await renderToHtml(<NewAddressPage />);

    expect(server.connection).toHaveBeenCalledTimes(1);
    expect(loadAddressReferences).toHaveBeenCalledTimes(1);
    expect(html).toContain("New address</h1>");
    expect(html).toContain("Add a new address to your account.");
    expect(html).toContain("Personal data</h2>");
    expect(html).toContain('<option value="salutation-mr">Mr.</option>');
    expect(html).toContain('data-testid="country-select"');
  });
});
