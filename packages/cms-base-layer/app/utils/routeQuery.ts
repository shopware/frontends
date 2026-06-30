import type { LocationQuery } from "vue-router";

/**
 * Collapses a route-query param to a single string.
 *
 * Router query values are `string | null`, an array when a param is repeated
 * (e.g. `?p=1&p=2`), or `undefined` when absent. Returns the first usable
 * string, or `undefined` for missing/empty/null values.
 */
export const firstQueryValue = (
  value: LocationQuery[string] | undefined,
): string | undefined => {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ?? undefined;
};

/**
 * Parses a query string (typically from {@link firstQueryValue}) into a finite
 * number, or `undefined` when missing/empty/non-numeric. Lets callers fall back
 * with `??` instead of forwarding `NaN` into a request.
 */
export const toNumber = (value: string | undefined): number | undefined => {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};
