import type { ClientHeaders } from "../defaultHeaders";

/**
 * Merge request headers over the client defaults. Header names are matched
 * case-insensitively and returned lowercase. A request header set to `""`
 * removes the header in every casing.
 */
export function mergeRequestHeaders(
  callerHeaders: ClientHeaders | undefined,
  defaultHeaders: ClientHeaders | undefined,
): ClientHeaders {
  const headers: ClientHeaders = {};
  for (const [key, value] of Object.entries(defaultHeaders ?? {})) {
    if (value) headers[key.toLowerCase()] = value;
  }
  const dropped: string[] = [];
  for (const [key, value] of Object.entries(callerHeaders ?? {})) {
    if (value === "") dropped.push(key.toLowerCase());
    else if (value != null) headers[key.toLowerCase()] = value;
  }
  for (const name of dropped) delete headers[name];
  return headers;
}
