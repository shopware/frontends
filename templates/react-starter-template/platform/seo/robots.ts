import type { MetadataRoute } from "next";

export const PRIVATE_PAGE_ROBOTS = { index: false, follow: true } as const;

export const ROBOTS_ALLOW = ["/", "/*?p=", "/*referringSalesChannel="] as const;

export const ROBOTS_DISALLOW = ["/*?", "/api/"] as const;

export function buildRobots(siteUrl: URL | null): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [...ROBOTS_ALLOW],
      disallow: [...ROBOTS_DISALLOW],
    },
    ...(siteUrl
      ? { sitemap: new URL("/sitemap.xml", siteUrl).toString() }
      : {}),
  };
}
