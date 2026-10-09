import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { germany, poland } from "@/components/form/countries.fixture";

import { loadCountryOptions } from "./loadCountryOptions";
import { readCountries } from "./reads/countries";
import { resolveLanguageId } from "./reads/languages";

vi.mock("server-only", () => ({}));

vi.mock("./reads/countries", () => ({
  readCountries: vi.fn(),
}));

vi.mock("./reads/languages", () => ({
  resolveLanguageId: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(readCountries).mockReset();
  vi.mocked(resolveLanguageId).mockReset();
  vi.mocked(resolveLanguageId).mockResolvedValue(null);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadCountryOptions", () => {
  it("reads the countries in the default language for a locale without its own", async () => {
    vi.mocked(readCountries).mockResolvedValue([germany, poland]);

    await expect(loadCountryOptions("pl-PL", "Checkout")).resolves.toEqual({
      countries: [germany, poland],
      countriesUnavailable: false,
    });
    expect(resolveLanguageId).toHaveBeenCalledExactlyOnceWith("pl-PL");
    expect(readCountries).toHaveBeenCalledExactlyOnceWith(null);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("reads the countries in the Shopware language of the locale", async () => {
    vi.mocked(resolveLanguageId).mockResolvedValue("language-de");
    vi.mocked(readCountries).mockResolvedValue([germany]);

    await loadCountryOptions("de-DE", "Registration");

    expect(resolveLanguageId).toHaveBeenCalledExactlyOnceWith("de-DE");
    expect(readCountries).toHaveBeenCalledExactlyOnceWith("language-de");
  });

  it("logs with the label and marks the countries unavailable when they cannot be read", async () => {
    const failure = new Error("Store API down");
    vi.mocked(readCountries).mockRejectedValue(failure);

    await expect(loadCountryOptions("de-DE", "Registration")).resolves.toEqual({
      countries: [],
      countriesUnavailable: true,
    });
    expect(console.error).toHaveBeenCalledExactlyOnceWith(
      "[Registration] reading countries failed",
      failure,
    );
  });
});
