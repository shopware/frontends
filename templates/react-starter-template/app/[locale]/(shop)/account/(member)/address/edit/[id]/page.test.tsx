import { beforeEach, describe, expect, it, vi } from "vitest";

import { germany } from "@/components/form/countries.fixture";
import { loadAddressReferences } from "@/features/account/address/addressReferences";
import type { AddressReferences } from "@/features/account/address/addressReferences";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import EditAddressPage, { generateMetadata } from "./page";

const server = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));

const content = vi.hoisted(() => ({
  props: [] as Record<string, unknown>[],
}));

vi.mock("server-only", () => ({}));

vi.mock("next/server", () => ({ connection: server.connection }));

vi.mock("@/features/account/address/addressReferences", () => ({
  loadAddressReferences: vi.fn(),
}));

vi.mock("@/features/account/address/components/EditAddressContent", () => ({
  EditAddressContent: (props: Record<string, unknown>) => {
    content.props.push(props);
    return <p data-testid="edit-address-content" />;
  },
}));

const references: AddressReferences = {
  countries: [germany],
  countriesUnavailable: false,
  salutations: [{ label: "Mr.", value: "salutation-mr" }],
  salutationsUnavailable: true,
};

beforeEach(() => {
  server.connection.mockClear();
  content.props = [];
  vi.mocked(loadAddressReferences).mockReset();
  vi.mocked(loadAddressReferences).mockResolvedValue(references);
});

describe("EditAddressPage", () => {
  it("is titled like the Vue edit address header in the page locale", async () => {
    expect(
      await generateMetadata({
        params: Promise.resolve({ locale: "en-GB", id: "address-1" }),
      }),
    ).toEqual({ title: "Edit address" });
    expect(
      await generateMetadata({
        params: Promise.resolve({ locale: "pl-PL", id: "address-1" }),
      }),
    ).toEqual({ title: "Edytuj adres" });
  });

  it("renders the headers and hands the route params and the references to the form", async () => {
    const params = Promise.resolve({ locale: "de-DE", id: "address-1" });

    const html = await renderToHtml(<EditAddressPage params={params} />);

    expect(server.connection).toHaveBeenCalledTimes(1);
    expect(loadAddressReferences).toHaveBeenCalledExactlyOnceWith("de-DE");
    expect(html).toContain("Edit address</h1>");
    expect(html).toContain("Edit your address.");
    expect(html).toContain("Personal data</h2>");
    expect(html).toContain('data-testid="edit-address-content"');
    expect(content.props).toHaveLength(1);
    expect(content.props[0]).toEqual({ params, ...references });
    expect(content.props[0]?.params).toBe(params);
  });

  it("renders the headers in the provider locale", async () => {
    const params = Promise.resolve({ locale: "de-DE", id: "address-1" });

    const html = await renderToHtml(
      withI18n(<EditAddressPage params={params} />, "de-DE"),
    );

    expect(html).toContain("Adresse bearbeiten</h1>");
    expect(html).toContain('data-testid="edit-address-content"');
  });
});
