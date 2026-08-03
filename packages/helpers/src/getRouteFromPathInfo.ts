const TECHNICAL_ROUTE_MAP = {
  "/navigation/": "frontend.navigation.page",
  "/detail/": "frontend.detail.page",
  "/landingPage/": "frontend.landing.page",
} as const;

export type RouteNameFromPathInfo =
  (typeof TECHNICAL_ROUTE_MAP)[keyof typeof TECHNICAL_ROUTE_MAP];

export type RouteInfoFromPathInfo = {
  routeName: RouteNameFromPathInfo;
  foreignKey: string;
};

export function normalizePath(path: string): string {
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

export function isTechnicalPath(path: string): boolean {
  const normalizedPath = normalizePath(path);
  return Object.keys(TECHNICAL_ROUTE_MAP).some((prefix) =>
    normalizedPath.startsWith(prefix),
  );
}

/**
 * Check whether an absolute or relative URL points to a technical Shopware
 * route. Query parameters and fragments are ignored.
 */
export function isTechnicalUrl(
  url: string,
  baseUrl = "http://localhost",
): boolean {
  try {
    return isTechnicalPath(new URL(url, baseUrl).pathname);
  } catch {
    return false;
  }
}

export function getRouteFromPathInfo(
  path: string,
): RouteInfoFromPathInfo | null {
  const normalizedPath = normalizePath(path);

  for (const [prefix, routeName] of Object.entries(TECHNICAL_ROUTE_MAP)) {
    if (!normalizedPath.startsWith(prefix)) continue;

    const foreignKey = normalizedPath.slice(prefix.length);
    if (!foreignKey || foreignKey.includes("/")) return null;

    return {
      routeName,
      foreignKey,
    };
  }

  return null;
}

/**
 * Get the canonical path for a mapped technical Shopware URL.
 *
 * Returns `null` for SEO URLs, synthetic technical fallbacks without an SEO
 * mapping, and invalid mappings that would redirect to another technical URL.
 */
export function getCanonicalPathForTechnicalPath(
  path: string,
  seoUrl?: object | null,
): string | null {
  if (
    !isTechnicalPath(path) ||
    !seoUrl ||
    !("seoPathInfo" in seoUrl) ||
    typeof seoUrl.seoPathInfo !== "string"
  ) {
    return null;
  }

  const seoPathInfo = seoUrl.seoPathInfo.replace(/^\/+/, "");
  const canonicalPath = seoPathInfo ? normalizePath(`/${seoPathInfo}`) : "/";
  if (isTechnicalPath(canonicalPath)) return null;

  return canonicalPath;
}
