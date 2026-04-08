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
