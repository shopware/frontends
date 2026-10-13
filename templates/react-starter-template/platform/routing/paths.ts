export const APP_ROUTE_SEGMENTS = ["account", "checkout", "wishlist"] as const;

export const MAX_SEO_PATH_LENGTH = 750;

export function hasUnsafePathChar(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 0x1f || code === 0x7f || code === 0x5c) return true;
  }
  return false;
}

export function isAppRoute(pathname: string): boolean {
  const segment = pathname.split("/")[1] ?? "";
  return (APP_ROUTE_SEGMENTS as readonly string[]).includes(segment);
}

export function decodePathname(pathname: string): string {
  return pathname
    .split("/")
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");
}

function trimSlashes(path: string): string {
  return path.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function seoPathCandidates(pathname: string): string[] {
  const spellings = [
    trimSlashes(decodePathname(pathname)),
    trimSlashes(pathname),
  ];
  return [
    ...new Set(spellings.flatMap((path) => (path ? [path, `${path}/`] : []))),
  ];
}

export function toSeoPath(seoPathInfo: string): string {
  return `/${seoPathInfo.replace(/^\/+/, "")}`;
}

export function sameSeoPath(seoPathInfo: string, pathname: string): boolean {
  return decodePathname(toSeoPath(seoPathInfo)) === decodePathname(pathname);
}
