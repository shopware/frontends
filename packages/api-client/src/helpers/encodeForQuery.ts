import { gzipSync, strToU8 } from "fflate";

/**
 * 🔹 Compress object -> base64url for query string
 *
 * This is a helper to support https://github.com/shopware/shopware/issues/12388 for _criteria query field in store-api GET requests
 *
 */
export function encodeForQuery(obj: unknown): string {
  const json = JSON.stringify(obj);
  const compressed = gzipSync(strToU8(json));

  // Convert to base64url
  let base64 = btoa(String.fromCharCode.apply(null, Array.from(compressed)));
  base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return base64;
}
