import { describe, expect, it } from "vitest";

import {
  SEARCH_TERM_MAX_LENGTH,
  isSearchPagePath,
  isSearchable,
  normalizeSearchTerm,
  searchPath,
  searchTermFromLocation,
} from "./searchTerm";

describe("normalizeSearchTerm", () => {
  it.each([
    ["  linen   shirt \n", "linen shirt"],
    ["\tshirt", "shirt"],
    ["", ""],
    ["   ", ""],
  ])("normalizes %j to %j", (value, expected) => {
    expect(normalizeSearchTerm(value)).toBe(expected);
  });

  it("takes the first value of a repeated parameter", () => {
    expect(normalizeSearchTerm([" shirt ", "chair"])).toBe("shirt");
    expect(normalizeSearchTerm([])).toBe("");
  });

  it("reads a missing parameter as an empty term", () => {
    expect(normalizeSearchTerm(undefined)).toBe("");
    expect(normalizeSearchTerm(null)).toBe("");
  });

  it("cuts the term to the backend's maximum length without a trailing space", () => {
    expect(normalizeSearchTerm("a".repeat(400))).toHaveLength(
      SEARCH_TERM_MAX_LENGTH,
    );
    expect(normalizeSearchTerm(`${"a".repeat(299)} b`)).toBe("a".repeat(299));
  });

  it("does not split a character outside the basic plane", () => {
    const term = normalizeSearchTerm(`${"a".repeat(299)}😀😀`);

    expect(Array.from(term)).toHaveLength(SEARCH_TERM_MAX_LENGTH);
    expect(term.endsWith("😀")).toBe(true);
  });
});

describe("isSearchable", () => {
  it("needs three characters", () => {
    expect(isSearchable("")).toBe(false);
    expect(isSearchable("sh")).toBe(false);
    expect(isSearchable("shi")).toBe(true);
  });
});

describe("searchPath", () => {
  it("encodes the term into the search query", () => {
    expect(searchPath("shirt")).toBe("/search?search=shirt");
    expect(searchPath("a b&c")).toBe("/search?search=a%20b%26c");
    expect(searchPath("50% #1")).toBe("/search?search=50%25%20%231");
  });
});

describe("isSearchPagePath", () => {
  it.each([
    ["/search", true],
    ["/search/", true],
    ["/pl-PL/search", true],
    ["/de-DE/search/", true],
    ["/searching", false],
    ["/search/shirt", false],
    ["/Clothing/", false],
    ["/", false],
  ])("treats %s as the search page: %s", (pathname, expected) => {
    expect(isSearchPagePath(pathname)).toBe(expected);
  });
});

describe("searchTermFromLocation", () => {
  it.each([
    ["/search", "?search=%20linen%20%20shirt", "linen shirt"],
    ["/pl-PL/search/", "?p=2&search=Hemd&search=Stuhl", "Hemd"],
    ["/search", "", ""],
    ["/Clothing/", "?search=shirt", ""],
  ])("reads %s%s as %j", (pathname, search, expected) => {
    expect(searchTermFromLocation({ pathname, search })).toBe(expected);
  });
});
