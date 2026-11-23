import { resolveRobots } from "next/dist/build/webpack/loaders/metadata/resolve-route-data";
import { describe, expect, it } from "vitest";

import { buildRobots, ROBOTS_ALLOW, ROBOTS_DISALLOW } from "./robots";

function rules(siteUrl: URL | null) {
  const { rules } = buildRobots(siteUrl);
  return Array.isArray(rules) ? rules : [rules];
}

describe("buildRobots", () => {
  it("has one rule for every crawler with the allow and disallow lists", () => {
    expect(rules(null)).toEqual([
      {
        userAgent: "*",
        allow: [...ROBOTS_ALLOW],
        disallow: [...ROBOTS_DISALLOW],
      },
    ]);
  });

  it("keeps the Shopware defaults, lets listing pages through and keeps crawlers out of the API", () => {
    expect(ROBOTS_ALLOW).toEqual(["/", "/*?p=", "/*referringSalesChannel="]);
    expect(ROBOTS_DISALLOW).toEqual(["/*?", "/api/"]);
  });

  it("lists the sitemap of STOREFRONT_URL", () => {
    expect(buildRobots(new URL("https://shop.test")).sitemap).toBe(
      "https://shop.test/sitemap.xml",
    );
  });

  it("lists no sitemap without a site URL", () => {
    expect(buildRobots(null)).not.toHaveProperty("sitemap");
  });

  it.each(["/account", "/checkout", "/wishlist", "/search", "/registration"])(
    "never disallows %s, so crawlers can read its noindex",
    (path) => {
      const disallowed = rules(null).flatMap((rule) => rule.disallow ?? []);
      expect(disallowed.some((pattern) => path.startsWith(pattern))).toBe(
        false,
      );
    },
  );

  it("renders the robots.txt Next serves", () => {
    expect(resolveRobots(buildRobots(new URL("https://shop.test")))).toBe(
      [
        "User-Agent: *",
        "Allow: /",
        "Allow: /*?p=",
        "Allow: /*referringSalesChannel=",
        "Disallow: /*?",
        "Disallow: /api/",
        "",
        "Sitemap: https://shop.test/sitemap.xml",
        "",
      ].join("\n"),
    );
  });
});
