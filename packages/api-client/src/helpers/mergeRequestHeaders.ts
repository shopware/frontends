import type { ClientHeaders } from "../defaultHeaders";

/**
 * Merge request headers over the client defaults. Header names are matched
 * case-insensitively and returned lowercase. A header set to `""` is removed.
 */
export function mergeRequestHeaders(
  callerHeaders: ClientHeaders | undefined,
  defaultHeaders: ClientHeaders,
): ClientHeaders {
  const headers: ClientHeaders = {};
  for (const [key, value] of [
    ...Object.entries(defaultHeaders),
    ...Object.entries(callerHeaders ?? {}),
  ]) {
    if (value === "") delete headers[key.toLowerCase()];
    else if (value != null) headers[key.toLowerCase()] = value;
  }
  return headers;
}
