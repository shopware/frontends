import { describe, expect, it } from "vitest";
import { getLanguageName } from "./getLanguageName";
import language from "./mocks/language";

describe("getLanguageName", () => {
  it("should return language name", () => {
    const languageName = language.translationCode?.translated.name;
    expect(getLanguageName(language)).toBe(languageName);
  });
});

describe("getLanguageName with wrong object", () => {
  it("should return an empty string", () => {
    const languageMock = language;
    // @ts-expect-error - translationCode should be object
    languageMock.translationCode = null;

    expect(getLanguageName(languageMock)).toBe("");
  });
});
