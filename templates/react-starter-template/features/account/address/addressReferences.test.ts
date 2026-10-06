import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { germany, poland } from "@/components/form/countries.fixture";
import { readCountries } from "@/platform/shopware/reads/countries";
import { readSalutations } from "@/platform/shopware/reads/salutations";

import { loadAddressReferences } from "./addressReferences";

vi.mock("server-only", () => ({}));

vi.mock("@/platform/shopware/reads/countries", () => ({
  readCountries: vi.fn(),
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
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadAddressReferences", () => {
  it("merges the countries and the salutations", async () => {
    vi.mocked(readCountries).mockResolvedValue(countries);
    vi.mocked(readSalutations).mockResolvedValue(salutations);

    await expect(loadAddressReferences()).resolves.toEqual({
      countries,
      countriesUnavailable: false,
      salutations,
      salutationsUnavailable: false,
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("keeps the salutations when the countries cannot be read", async () => {
    const failure = new Error("Store API down");
    vi.mocked(readCountries).mockRejectedValue(failure);
    vi.mocked(readSalutations).mockResolvedValue(salutations);

    await expect(loadAddressReferences()).resolves.toEqual({
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

    await expect(loadAddressReferences()).resolves.toEqual({
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

    await expect(loadAddressReferences()).resolves.toEqual({
      countries: [],
      countriesUnavailable: true,
      salutations: [],
      salutationsUnavailable: true,
    });
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});
