import { describe, expect, it } from "vitest";
import { getLanguageName } from "./getLanguageName";
import language from "./mocks/language";

describe("getLanguageName", () => {
  it("should return language name", () => {
    const languageName = language.translationCode?.translated?.name;
    expect(getLanguageName(language)).toBe(languageName);
  });
});
