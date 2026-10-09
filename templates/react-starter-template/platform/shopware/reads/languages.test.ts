import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createShopwareClient } from "../client";

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock("../client", () => ({
  createShopwareClient: vi.fn(),
}));

const invoke = vi.fn();

beforeEach(() => {
  vi.resetModules();
  invoke.mockReset();
  vi.mocked(createShopwareClient).mockReturnValue({
    invoke,
  } as unknown as ReturnType<typeof createShopwareClient>);
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function load() {
  return import("./languages");
}

const elements = [
  { id: "language-us", translationCode: { code: "en-US" } },
  { id: "language-de", translationCode: { code: "de-DE" } },
];

describe("readLanguages", () => {
  it("reads GET /language anonymously and keeps the ids and codes", async () => {
    invoke.mockResolvedValue({ data: { elements } });
    const { readLanguages } = await load();

    await expect(readLanguages()).resolves.toEqual([
      { id: "language-us", code: "en-US" },
      { id: "language-de", code: "de-DE" },
    ]);
    expect(createShopwareClient).toHaveBeenCalledWith();
    expect(invoke).toHaveBeenCalledWith("readLanguagesGet get /language");
  });
});

describe("resolveLanguageId", () => {
  it("returns the id of the language whose code equals the locale", async () => {
    invoke.mockResolvedValue({ data: { elements } });
    const { resolveLanguageId } = await load();

    await expect(resolveLanguageId("de-DE")).resolves.toBe("language-de");
  });

  it("returns null when no language matches, like the single English (US) demo language", async () => {
    invoke.mockResolvedValue({ data: { elements: [elements[0]] } });
    const { resolveLanguageId } = await load();

    await expect(resolveLanguageId("en-GB")).resolves.toBeNull();
    await expect(resolveLanguageId("pl-PL")).resolves.toBeNull();
  });

  it("returns null when the read fails and logs that only once", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = new Error("Store API down");
    invoke.mockRejectedValue(failure);
    const { resolveLanguageId } = await load();

    await expect(resolveLanguageId("de-DE")).resolves.toBeNull();
    await expect(resolveLanguageId("pl-PL")).resolves.toBeNull();

    expect(error).toHaveBeenCalledExactlyOnceWith(
      "[Shopware] reading the languages failed, so the default language is used",
      failure,
    );
  });
});

function answer(languages: unknown[], defaultLanguageId: string) {
  invoke.mockImplementation(async (operation: string) => {
    if (operation === "readLanguagesGet get /language") {
      return { data: { elements: languages } };
    }
    if (operation === "readContext get /context") {
      return { data: { context: { languageIdChain: [defaultLanguageId] } } };
    }
    throw new Error(`Unexpected operation ${operation}`);
  });
}

describe("resolveContentLanguage", () => {
  it("declares no content language when the locale has its own language", async () => {
    answer(elements, "language-us");
    const { resolveContentLanguage } = await load();

    await expect(resolveContentLanguage("de-DE")).resolves.toEqual({
      languageId: "language-de",
      contentLang: undefined,
    });
    expect(invoke).not.toHaveBeenCalledWith("readContext get /context");
  });

  it("declares the default language when it differs from the locale, like English (US) under pl-PL", async () => {
    answer([elements[0]], "language-us");
    const { resolveContentLanguage } = await load();

    await expect(resolveContentLanguage("pl-PL")).resolves.toEqual({
      languageId: null,
      contentLang: "en-US",
    });
    expect(createShopwareClient).toHaveBeenCalledWith({ languageId: null });
  });

  it("declares nothing when the default language shares the locale's primary subtag", async () => {
    answer([elements[0]], "language-us");
    const { resolveContentLanguage } = await load();

    await expect(resolveContentLanguage("en-GB")).resolves.toEqual({
      languageId: null,
      contentLang: undefined,
    });
  });

  it("declares nothing and logs once when the default language cannot be read", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = new Error("Store API down");
    invoke.mockImplementation(async (operation: string) => {
      if (operation === "readLanguagesGet get /language") {
        return { data: { elements: [elements[0]] } };
      }
      throw failure;
    });
    const { resolveContentLanguage } = await load();

    await expect(resolveContentLanguage("pl-PL")).resolves.toEqual({
      languageId: null,
      contentLang: undefined,
    });
    await resolveContentLanguage("de-DE");

    expect(error).toHaveBeenCalledExactlyOnceWith(
      "[Shopware] reading the default language failed, so no content language is declared",
      failure,
    );
  });
});
