import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { germany, poland } from "@/components/form/countries.fixture";
import { readCountries } from "@/platform/shopware/reads/countries";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { readSalutations } from "@/platform/shopware/reads/salutations";

import { loadAddressReferences } from "./addressReferences";

vi.mock("server-only", () => ({}));

vi.mock("@/platform/shopware/reads/countries", () => ({
  readCountries: vi.fn(),
}));

vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveLanguageId: vi.fn(),
}));

vi.mock("@/platform/shopware/reads/salutations", () => ({
  readSalutations: vi.fn(),
}));

const countries = [germany, poland];
const salutations = [
  { label: "Mr.", value: "salutation-mr" },
  { label: "Mrs.", value: "salutation-mrs" },
];

beforeEach(() => {
  vi.mocked(readCountries).mockReset();
  vi.mocked(readSalutations).mockReset();
  vi.mocked(resolveLanguageId).mockReset();
  vi.mocked(resolveLanguageId).mockResolvedValue(null);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadAddressReferences", () => {
  it("merges the countries and the salutations", async () => {
    vi.mocked(readCountries).mockResolvedValue(countries);
    vi.mocked(readSalutations).mockResolvedValue(salutations);

    await expect(loadAddressReferences("en-GB")).resolves.toEqual({
      countries,
      countriesUnavailable: false,
      salutations,
      salutationsUnavailable: false,
    });
    expect(console.error).not.toHaveBeenCalled();
    expect(readCountries).toHaveBeenCalledWith(null);
    expect(readSalutations).toHaveBeenCalledWith(null);
  });

  it("reads both in the Shopware language of the locale", async () => {
    vi.mocked(resolveLanguageId).mockResolvedValue("language-pl");
    vi.mocked(readCountries).mockResolvedValue(countries);
    vi.mocked(readSalutations).mockResolvedValue(salutations);

    await loadAddressReferences("pl-PL");

    expect(resolveLanguageId).toHaveBeenCalledExactlyOnceWith("pl-PL");
    expect(readCountries).toHaveBeenCalledWith("language-pl");
    expect(readSalutations).toHaveBeenCalledWith("language-pl");
  });

  it("keeps the salutations when the countries cannot be read", async () => {
    const failure = new Error("Store API down");
    vi.mocked(readCountries).mockRejectedValue(failure);
    vi.mocked(readSalutations).mockResolvedValue(salutations);

    await expect(loadAddressReferences("en-GB")).resolves.toEqual({
      countries: [],
      countriesUnavailable: true,
      salutations,
      salutationsUnavailable: false,
    });
    expect(console.error).toHaveBeenCalledExactlyOnceWith(
      "[Address] reading countries failed",
      failure,
    );
  });

  it("keeps the countries when the salutations cannot be read", async () => {
    const failure = new Error("Store API down");
    vi.mocked(readCountries).mockResolvedValue(countries);
    vi.mocked(readSalutations).mockRejectedValue(failure);

    await expect(loadAddressReferences("en-GB")).resolves.toEqual({
      countries,
      countriesUnavailable: false,
      salutations: [],
      salutationsUnavailable: true,
    });
    expect(console.error).toHaveBeenCalledExactlyOnceWith(
      "[Address] reading salutations failed",
      failure,
    );
  });

  it("marks both unavailable when neither can be read", async () => {
    vi.mocked(readCountries).mockRejectedValue(new Error("down"));
    vi.mocked(readSalutations).mockRejectedValue(new Error("down"));

    await expect(loadAddressReferences("en-GB")).resolves.toEqual({
      countries: [],
      countriesUnavailable: true,
      salutations: [],
      salutationsUnavailable: true,
    });
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});
