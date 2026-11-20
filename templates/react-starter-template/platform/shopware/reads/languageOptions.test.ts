import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import {
  contentLanguageFor,
  findLanguageId,
  toLanguageOptions,
} from "./languageOptions";

function language(id: string, code?: string): Schemas["Language"] {
  return {
    id,
    name: id,
    translationCode: code ? { code } : undefined,
  } as unknown as Schemas["Language"];
}

describe("toLanguageOptions", () => {
  it("keeps the id and the translation code", () => {
    expect(
      toLanguageOptions([language("language-en", "en-US"), language("bare")]),
    ).toEqual([
      { id: "language-en", code: "en-US" },
      { id: "bare", code: null },
    ]);
  });
});

describe("findLanguageId", () => {
  const languages = [
    { id: "language-en", code: "en-GB" },
    { id: "language-de", code: "de-DE" },
    { id: "language-bare", code: null },
  ];

  it("finds the language whose translation code equals the locale", () => {
    expect(findLanguageId(languages, "de-DE")).toBe("language-de");
    expect(findLanguageId(languages, "en-GB")).toBe("language-en");
  });

  it("returns null when no translation code equals the locale", () => {
    expect(findLanguageId(languages, "pl-PL")).toBeNull();
    expect(findLanguageId(languages, "de-de")).toBeNull();
    expect(
      findLanguageId([{ id: "language-us", code: "en-US" }], "en-GB"),
    ).toBeNull();
    expect(findLanguageId([], "en-GB")).toBeNull();
  });
});

describe("contentLanguageFor", () => {
  const languages = [
    { id: "language-us", code: "en-US" },
    { id: "language-de", code: "de-DE" },
    { id: "language-bare", code: null },
  ];

  it("names a content language whose primary subtag differs from the locale", () => {
    expect(contentLanguageFor("pl-PL", languages, "language-us")).toBe("en-US");
    expect(contentLanguageFor("de-DE", languages, "language-us")).toBe("en-US");
    expect(contentLanguageFor("en-GB", languages, "language-de")).toBe("de-DE");
  });

  it("names nothing when the primary subtag is the locale's", () => {
    expect(
      contentLanguageFor("en-GB", languages, "language-us"),
    ).toBeUndefined();
    expect(
      contentLanguageFor("de-DE", languages, "language-de"),
    ).toBeUndefined();
  });

  it("names nothing for an unknown language or one without a code", () => {
    expect(
      contentLanguageFor("pl-PL", languages, "language-x"),
    ).toBeUndefined();
    expect(
      contentLanguageFor("pl-PL", languages, "language-bare"),
    ).toBeUndefined();
    expect(contentLanguageFor("pl-PL", languages, null)).toBeUndefined();
    expect(contentLanguageFor("pl-PL", languages, undefined)).toBeUndefined();
  });
});
