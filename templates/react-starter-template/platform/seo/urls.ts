const TECHNICAL_PREFIXES: Record<string, string> = {
  "frontend.navigation.page": "/navigation/",
  "frontend.detail.page": "/detail/",
  "frontend.landing.page": "/landingPage/",
};

export function seoPathFrom(
  seoUrls: { seoPathInfo?: string }[] | null | undefined,
): string | null {
  const seoPathInfo = seoUrls?.find(
    (seoUrl) => typeof seoUrl.seoPathInfo === "string",
  )?.seoPathInfo;
  return typeof seoPathInfo === "string"
    ? `/${seoPathInfo.replace(/^\/+/, "")}`
    : null;
}

export function isTechnicalRouteName(routeName: string): boolean {
  return Object.hasOwn(TECHNICAL_PREFIXES, routeName);
}

export function technicalPath(routeName: string, id: string): string {
  return `${TECHNICAL_PREFIXES[routeName] ?? "/"}${id}`;
}

export function pageQuery(page: unknown): string {
  const value = Array.isArray(page) ? page[0] : page;
  if (typeof value !== "string" || !/^\d+$/.test(value)) return "";
  const number = Number(value);
  return number > 1 ? `?p=${number}` : "";
}

export function absoluteUrl(path: string, siteUrl: URL | null): string | null {
  return siteUrl ? new URL(path, siteUrl).toString() : null;
}
