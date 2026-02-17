import { describe, expect, it } from "vitest";
import { getBackgroundImageUrl } from "./getBackgroundImageUrl";
import {
  cmsSectionTestCaseFive,
  cmsSectionTestCaseFour,
  cmsSectionTestCaseOne,
  cmsSectionTestCaseSeven,
  cmsSectionTestCaseSix,
  cmsSectionTestCaseThree,
  cmsSectionTestCaseTwo,
  urlsTestCaseEight,
  urlsTestCaseFive,
  urlsTestCaseFour,
  urlsTestCaseOne,
  urlsTestCaseSeven,
  urlsTestCaseSix,
  urlsTestCaseThree,
  urlsTestCaseTwo,
} from "./mocks/backgroundImage";

describe("getBackgroundImageUrl, round up max height 1900", () => {
  const element = cmsSectionTestCaseOne;
  for (const [key, value] of Object.entries(urlsTestCaseOne)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, round up width 1000px", () => {
  const element = cmsSectionTestCaseTwo;
  for (const [key, value] of Object.entries(urlsTestCaseTwo)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, round up height 900px", () => {
  const element = cmsSectionTestCaseThree;
  for (const [key, value] of Object.entries(urlsTestCaseThree)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

/**
 * Should be uncommented when GenericRecord will be updated
 */
describe("getBackgroundImageUrl, with default value", () => {
  const element = cmsSectionTestCaseFour;
  for (const [key, value] of Object.entries(urlsTestCaseFour)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, round up width 2000", () => {
  const element = cmsSectionTestCaseFive;
  for (const [key, value] of Object.entries(urlsTestCaseFive)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, round up max width", () => {
  const element = cmsSectionTestCaseSix;
  for (const [key, value] of Object.entries(urlsTestCaseSix)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, regex does not match", () => {
  const element = cmsSectionTestCaseSeven;
  for (const [key, value] of Object.entries(urlsTestCaseSeven)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, url too long", () => {
  const element = cmsSectionTestCaseSeven;
  for (const [key] of Object.entries(urlsTestCaseEight)) {
    it("should return url with parameters", () => {
      expect(() => getBackgroundImageUrl(key, element)).toThrow();
    });
  }
});

describe("getBackgroundImageUrl, with format and quality options", () => {
  const element = cmsSectionTestCaseTwo;

  it("should append format and quality when both provided", () => {
    const result = getBackgroundImageUrl(
      "url(https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/image.jpg)",
      element,
      { format: "webp", quality: 85 },
    );
    expect(result).toBe(
      'url("https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/image.jpg?width=1000&fit=crop,smart&format=webp&quality=85")',
    );
  });

  it("should append only format when quality is not provided", () => {
    const result = getBackgroundImageUrl(
      "url(https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/image.jpg)",
      element,
      { format: "avif" },
    );
    expect(result).toBe(
      'url("https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/image.jpg?width=1000&fit=crop,smart&format=avif")',
    );
  });

  it("should not append format or quality when options are empty", () => {
    const result = getBackgroundImageUrl(
      "url(https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/image.jpg)",
      element,
      {},
    );
    expect(result).toBe(
      'url("https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/image.jpg?width=1000&fit=crop,smart")',
    );
  });
});
