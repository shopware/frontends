export const PAGE_SIZE_OPTIONS = [1, 15, 30, 45] as const;

/**
 * Parses a query string into a positive integer (>= 1), rejecting zero,
 * negative and fractional values. Returns `undefined` for anything that is not
 * a whole positive number, so callers can fall back with `??` instead of
 * forwarding an out-of-range page or limit into a request.
 */
export const toPositiveInteger = (
  value: string | undefined,
): number | undefined => {
  const parsed = toNumber(value);
  if (parsed === undefined) return undefined;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};
