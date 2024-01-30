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
