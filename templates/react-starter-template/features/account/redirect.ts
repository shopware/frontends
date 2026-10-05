export const DEFAULT_REDIRECT = "/";

const PLACEHOLDER_ORIGIN = "http://placeholder.invalid";

function hasUnsafeChar(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 0x1f || code === 0x7f || code === 0x5c) return true;
  }
  return false;
}

export function resolveRedirectTarget(
  target: string | null | undefined,
  fallback: string = DEFAULT_REDIRECT,
): string {
  if (!target || hasUnsafeChar(target)) return fallback;
  if (!target.startsWith("/") || target.startsWith("//")) return fallback;
  const url = new URL(target, PLACEHOLDER_ORIGIN);
  if (url.origin !== PLACEHOLDER_ORIGIN || url.pathname.startsWith("//")) {
    return fallback;
  }
  return url.pathname + url.search + url.hash;
}

export function resolveRedirectFromSearch(
  search: string,
  preferred: string | null = null,
): string {
  return resolveRedirectTarget(
    preferred ?? new URLSearchParams(search).get("redirect"),
  );
}
