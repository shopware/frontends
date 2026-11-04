import type { ClientHeaders } from "../defaultHeaders";

/**
 * Request headers as `invoke` takes them. Some are booleans, like
 * `sw-include-seo-urls`.
 */
export type RequestHeaders = Partial<Record<string, string | boolean>>;

/**
 * Merge request headers over the client defaults. Header names are matched
 * case-insensitively and returned lowercase. Values are returned as strings. A
 * request header set to `""` removes the header in every casing.
 */
export function mergeRequestHeaders(
  callerHeaders: RequestHeaders | undefined,
  defaultHeaders: ClientHeaders | undefined,
): ClientHeaders {
  const headers: ClientHeaders = {};
  for (const [key, value] of Object.entries(defaultHeaders ?? {})) {
    if (value) headers[key.toLowerCase()] = value;
  }
  const dropped: string[] = [];
  for (const [key, value] of Object.entries(callerHeaders ?? {})) {
    if (value === "") dropped.push(key.toLowerCase());
    else if (value != null) headers[key.toLowerCase()] = String(value);
  }
  for (const name of dropped) delete headers[name];
  return headers;
}
