import { beforeEach, describe, expect, it, vi } from "vitest";

import { germany } from "@/components/form/countries.fixture";
import { loadAddressReferences } from "@/features/account/address/addressReferences";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import NewAddressPage, { generateMetadata } from "./page";

const server = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));

vi.mock("server-only", () => ({}));

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
  it("is titled like the Vue new address header in the page locale", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "en-GB" }) }),
    ).toEqual({ title: "New address" });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "de-DE" }) }),
    ).toEqual({ title: "Neue Adresse" });
  });

  it("renders the headers and the address form with the loaded references", async () => {
    const html = await renderToHtml(
      <NewAddressPage params={Promise.resolve({ locale: "en-GB" })} />,
    );

    expect(server.connection).toHaveBeenCalledTimes(1);
    expect(loadAddressReferences).toHaveBeenCalledExactlyOnceWith("en-GB");
    expect(html).toContain("New address</h1>");
    expect(html).toContain("Add a new address to your account.");
    expect(html).toContain("Personal data</h2>");
    expect(html).toContain('<option value="salutation-mr">Mr.</option>');
    expect(html).toContain('data-testid="country-select"');
  });

  it("renders the Polish copy and loads the references for pl-PL", async () => {
    const html = await renderToHtml(
      withI18n(
        <NewAddressPage params={Promise.resolve({ locale: "pl-PL" })} />,
        "pl-PL",
      ),
    );

    expect(loadAddressReferences).toHaveBeenCalledExactlyOnceWith("pl-PL");
    expect(html).toContain("Nowy adres</h1>");
    expect(html).toContain("Dodaj nowy adres do swojego konta.");
    expect(html).toContain("Dane osobowe</h2>");
    expect(html).toContain("Zapisz adres");
    expect(html).toContain('href="/pl-PL/account/address"');
  });
});
