import { describe, expect, it } from "vitest";
import { getBackgroundImageUrl } from "./getBackgroundImageUrl";
import {
  cmsSectionTestCaseOne,
  urlsTestCaseOne,
  cmsSectionTestCaseTwo,
  urlsTestCaseTwo,
  cmsSectionTestCaseThree,
  urlsTestCaseThree,
  cmsSectionTestCaseFour,
  urlsTestCaseFour,
  cmsSectionTestCaseFive,
  urlsTestCaseFive,
  cmsSectionTestCaseSix,
  urlsTestCaseSix,
  cmsSectionTestCaseSeven,
  urlsTestCaseSeven,
} from "./mocks/backgroundImage";
import { CmsSection } from "@shopware-pwa/types";

describe("getBackgroundImageUrl, round up max height 1900", () => {
  const element = cmsSectionTestCaseOne as CmsSection;
  for (const [key, value] of Object.entries(urlsTestCaseOne)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, round up width 1000px", () => {
  const element = cmsSectionTestCaseTwo as CmsSection;
  for (const [key, value] of Object.entries(urlsTestCaseTwo)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, round up height 900px", () => {
  const element = cmsSectionTestCaseThree as CmsSection;
  for (const [key, value] of Object.entries(urlsTestCaseThree)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, with default value", () => {
  const element = cmsSectionTestCaseFour as CmsSection;
  for (const [key, value] of Object.entries(urlsTestCaseFour)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, round up width 2000", () => {
  const element = cmsSectionTestCaseFive as CmsSection;
  for (const [key, value] of Object.entries(urlsTestCaseFive)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, round up max width", () => {
  const element = cmsSectionTestCaseSix as CmsSection;
  for (const [key, value] of Object.entries(urlsTestCaseSix)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});

describe("getBackgroundImageUrl, regex does not match", () => {
  const element = cmsSectionTestCaseSeven as CmsSection;
  for (const [key, value] of Object.entries(urlsTestCaseSeven)) {
    it("should return url with parameters", () => {
      expect(getBackgroundImageUrl(key, element)).toBe(value);
    });
  }
});
