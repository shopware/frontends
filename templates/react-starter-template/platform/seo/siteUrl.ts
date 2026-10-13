import "server-only";

export function parseSiteUrl(value: string | undefined): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return new URL(url.origin);
  } catch {
    return null;
  }
}

export function getSiteUrl(): URL | null {
  return parseSiteUrl(process.env.STOREFRONT_URL);
}
