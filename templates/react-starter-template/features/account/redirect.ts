export const DEFAULT_REDIRECT = "/";

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
  return target;
}
