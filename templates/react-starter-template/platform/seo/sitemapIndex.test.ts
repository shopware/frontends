import { describe, expect, it } from "vitest";

import {
  isServedDomain,
  isSitemapFilePath,
  selectSitemapFiles,
  sitemapFilePath,
  sitemapIndexXml,
} from "./sitemapIndex";

const SITE = new URL("https://shop.test");
const SALES_CHANNEL = "0123456789abcdef0123456789abcdef";
const LANGUAGE_EN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const LANGUAGE_DE = "dddddddddddddddddddddddddddddddd";
const DOMAIN_EN = "11111111111111111111111111111111";
const DOMAIN_DE = "22222222222222222222222222222222";
const DOMAIN_OTHER = "33333333333333333333333333333333";

function filePath(languageId: string, domainId: string, name = "shop-test-1") {
  return `salesChannel-${SALES_CHANNEL}-${languageId}/${SALES_CHANNEL}-${domainId}-sitemap-${name}.xml.gz`;
}

describe("isServedDomain", () => {
  it.each([
    "https://shop.test",
    "https://shop.test/",
    "https://shop.test/pl-PL",
    "https://shop.test/de-DE/",
  ])("serves %s", (url) => {
    expect(isServedDomain(url, SITE)).toBe(true);
  });

  it.each([
    "https://shop.test/en",
    "https://shop.test/en-GB",
    "https://shop.test/figma",
    "https://shop.test/pl-pl",
    "https://shop.test/pl-PL/extra",
    "https://shop.test/?x=1",
    "http://shop.test",
    "https://other.test",
    "https://shop.test:8443",
    "not a url",
    "",
  ])("does not serve %s", (url) => {
    expect(isServedDomain(url, SITE)).toBe(false);
  });
});

describe("sitemapFilePath", () => {
  it.each([
    [`https://shop.test/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN)}`],
    [`https://shop.test/de-DE/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN)}`],
    [
      `https://cdn.test/public/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN)}?1700000000`,
    ],
    [`/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN)}#x`],
    [
      `https://cdn.test/sitemap/shop/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN)}`,
    ],
  ])("keeps only the part after the last /sitemap/ of %s", (filename) => {
    expect(sitemapFilePath(filename)).toBe(filePath(LANGUAGE_EN, DOMAIN_EN));
  });

  it("gives nothing for a name without a sitemap directory", () => {
    expect(sitemapFilePath("https://shop.test/files/a.xml.gz")).toBeNull();
  });
});

describe("isSitemapFilePath", () => {
  it("accepts a file of a sales channel language with a domain id", () => {
    expect(isSitemapFilePath(filePath(LANGUAGE_EN, DOMAIN_EN))).toBe(true);
  });

  it.each([
    ["a parent segment", `../${filePath(LANGUAGE_EN, DOMAIN_EN)}`],
    ["a third segment", `a/${filePath(LANGUAGE_EN, DOMAIN_EN)}`],
    [
      "a dot segment as the file",
      `salesChannel-${SALES_CHANNEL}-${LANGUAGE_EN}/..`,
    ],
    ["an id that is not hex", filePath(LANGUAGE_EN, "x".repeat(32))],
    ["a missing .xml.gz", filePath(LANGUAGE_EN, DOMAIN_EN).slice(0, -3)],
    [
      "another sales channel in the file name",
      `salesChannel-${SALES_CHANNEL}-${LANGUAGE_EN}/${"f".repeat(32)}-${DOMAIN_EN}-sitemap-1.xml.gz`,
    ],
    [
      "a name without a domain id",
      `salesChannel-${SALES_CHANNEL}-${LANGUAGE_EN}/${SALES_CHANNEL}-sitemap-shop-test-1.xml.gz`,
    ],
    ["a slash in the name", filePath(LANGUAGE_EN, DOMAIN_EN, "a/b")],
    ["a backslash in the name", filePath(LANGUAGE_EN, DOMAIN_EN, "a\\b")],
    ["an encoded character", filePath(LANGUAGE_EN, DOMAIN_EN, "a%2Fb")],
  ])("rejects %s", (_, path) => {
    expect(isSitemapFilePath(path)).toBe(false);
  });
});

describe("selectSitemapFiles", () => {
  const served = new Set([DOMAIN_EN, DOMAIN_DE]);

  it("lists the files of served domains in the read language under /sitemap/", () => {
    expect(
      selectSitemapFiles(
        [
          {
            filename: `https://shop.test/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN)}`,
            created: "2026-10-01T10:00:00.000+02:00",
          },
          {
            filename: `https://shop.test/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN, "shop-test-2")}`,
            created: "never",
          },
        ],
        served,
        LANGUAGE_EN,
      ),
    ).toEqual([
      {
        path: `/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN)}`,
        languageId: LANGUAGE_EN,
        lastmod: "2026-10-01T08:00:00.000Z",
      },
      {
        path: `/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN, "shop-test-2")}`,
        languageId: LANGUAGE_EN,
        lastmod: null,
      },
    ]);
  });

  it("skips files of other domains, other languages and old names", () => {
    expect(
      selectSitemapFiles(
        [
          { filename: `/sitemap/${filePath(LANGUAGE_EN, DOMAIN_OTHER)}` },
          { filename: `/sitemap/${filePath(LANGUAGE_DE, DOMAIN_DE)}` },
          {
            filename: `/sitemap/salesChannel-${SALES_CHANNEL}-${LANGUAGE_EN}/${SALES_CHANNEL}-sitemap-shop-test-1.xml.gz`,
          },
          { filename: "https://shop.test/robots.txt" },
        ],
        served,
        LANGUAGE_EN,
      ),
    ).toEqual([]);
  });
});

describe("sitemapIndexXml", () => {
  it("writes a sitemap index of absolute storefront URLs", () => {
    expect(
      sitemapIndexXml(
        [
          {
            path: "/sitemap/a/b.xml.gz",
            languageId: LANGUAGE_EN,
            lastmod: "2026-10-01T08:00:00.000Z",
          },
          {
            path: "/sitemap/a/c.xml.gz",
            languageId: LANGUAGE_EN,
            lastmod: null,
          },
        ],
        SITE,
      ),
    ).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        "<sitemap><loc>https://shop.test/sitemap/a/b.xml.gz</loc><lastmod>2026-10-01T08:00:00.000Z</lastmod></sitemap>",
        "<sitemap><loc>https://shop.test/sitemap/a/c.xml.gz</loc></sitemap>",
        "</sitemapindex>",
        "",
      ].join("\n"),
    );
  });

  it("escapes the text of every element", () => {
    const xml = sitemapIndexXml(
      [
        {
          path: "/sitemap/a/b.xml.gz?x=1&y='2'",
          languageId: LANGUAGE_EN,
          lastmod: "<now>",
        },
      ],
      SITE,
    );

    expect(xml).toContain(
      "<loc>https://shop.test/sitemap/a/b.xml.gz?x=1&amp;y=%272%27</loc>",
    );
    expect(xml).toContain("<lastmod>&lt;now&gt;</lastmod>");
  });
});
