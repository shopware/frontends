import { hasUnsafePathChar } from "@/platform/routing/paths";

export const DEFAULT_REDIRECT = "/";

const PLACEHOLDER_ORIGIN = "http://placeholder.invalid";

export function resolveRedirectTarget(
  target: string | null | undefined,
  fallback: string = DEFAULT_REDIRECT,
): string {
  if (!target || hasUnsafePathChar(target)) return fallback;
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
  fallback: string = DEFAULT_REDIRECT,
): string {
  return resolveRedirectTarget(
    preferred ?? new URLSearchParams(search).get("redirect"),
    fallback,
  );
}
