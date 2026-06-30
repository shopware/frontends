import { defu } from "defu";

import type { ClientHeaders } from "./defaultHeaders";

const CONTENT_TYPE = "content-type";

function findContentType(headers: ClientHeaders): string | undefined {
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === CONTENT_TYPE) return value;
  }
  return undefined;
}

function contentTypeKeyCount(headers: ClientHeaders): number {
  let count = 0;
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === CONTENT_TYPE) count++;
  }
  return count;
}

function withoutContentType(headers: ClientHeaders): ClientHeaders {
  return Object.fromEntries(
    Object.entries(headers).filter(
      ([key]) => key.toLowerCase() !== CONTENT_TYPE,
    ),
  );
}

/**
 * Bodies whose `Content-Type` must be set by the runtime (browser `fetch` /
 * `undici`), not by the client. `ofetch` does not serialize these and does not
 * add a `Content-Type`, so the client's default `application/json` would be
 * sent incorrectly:
 * - `FormData` needs `multipart/form-data` with a generated boundary
 * - `URLSearchParams` needs `application/x-www-form-urlencoded`
 * - `Blob`/`File` carries its own MIME type
 * - `ArrayBuffer`/typed arrays/streams are raw binary payloads
 */
function isRuntimeManagedBody(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  return (
    (typeof FormData !== "undefined" && body instanceof FormData) ||
    (typeof URLSearchParams !== "undefined" &&
      body instanceof URLSearchParams) ||
    (typeof Blob !== "undefined" && body instanceof Blob) ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    typeof (body as { pipe?: unknown }).pipe === "function" ||
    typeof (body as { pipeTo?: unknown }).pipeTo === "function"
  );
}

/**
 * Merge request headers with the client defaults, then drop a `Content-Type`
 * that the runtime must set itself.
 *
 * The default `Content-Type: application/json` seeded for every client is wrong
 * for binary, form, and streaming bodies, and a manually set
 * `multipart/form-data` has no boundary. In both cases the header is removed so
 * the runtime can generate the correct one. A `Content-Type` the caller set
 * explicitly is preserved (e.g. a typeless `Blob` or a raw stream that relies
 * on it), unless it is a boundary-less `multipart/form-data`, which is never
 * usable as-is.
 */
export function resolveRequestHeaders(
  callerHeaders: ClientHeaders | undefined,
  defaultHeaders: ClientHeaders,
  body: unknown,
): ClientHeaders {
  const mergedHeaders = defu(callerHeaders, defaultHeaders);

  // The caller's Content-Type wins over the default, regardless of header
  // casing (`defu` merges case-sensitively, so both could otherwise survive).
  const callerContentType = callerHeaders && findContentType(callerHeaders);
  const contentType = callerContentType || findContentType(mergedHeaders);
  if (!contentType) return mergedHeaders;

  const shouldDrop =
    contentType.includes("multipart/form-data") ||
    (isRuntimeManagedBody(body) && !callerContentType);

  if (shouldDrop) return withoutContentType(mergedHeaders);

  // Nothing to drop: leave the merged headers untouched unless the caller's
  // Content-Type collided with the default under a different casing, leaving
  // two Content-Type keys. In that case keep a single, canonical one.
  if (contentTypeKeyCount(mergedHeaders) < 2) return mergedHeaders;
  return { ...withoutContentType(mergedHeaders), "Content-Type": contentType };
}
