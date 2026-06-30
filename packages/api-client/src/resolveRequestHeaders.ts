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
 * the runtime must set itself.
 *
 * The default `Content-Type: application/json` seeded for every client is wrong
 * for bodies the runtime types on its own. The header is removed when:
 * - the body is runtime-managed (`FormData`, `Blob`/`File`, `URLSearchParams`,
 *   binary, stream) and the `Content-Type` is the seeded `application/json`, or
 *   a manual `multipart/form-data` (a `FormData` always needs a freshly
 *   generated boundary, so any manual one is replaced)
 * - the `Content-Type` is a `multipart/form-data` without a usable `boundary`,
 *   which is incomplete and unusable as-is
 *
 * Any other `Content-Type` is preserved: a per-request header, a non-JSON
 * client-level default (e.g. `application/octet-stream` applied via
 * `defaultHeaders`), a typeless `Blob`'s MIME type, or a pre-encoded multipart
 * body that already carries its own `boundary`.
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

  const normalized = contentType.toLowerCase();
  const isMultipart = normalized.includes("multipart/form-data");
  // A boundary needs a non-empty value; `boundary=` (or `boundary=;`) is malformed.
  const hasBoundary = /boundary=[^\s;]/.test(normalized);
  const runtimeManaged = isRuntimeManagedBody(body);
  // The only Content-Type the client injects on its own is `application/json`.
  // Anything else - per-request or a client-level default - was set on purpose.
  const isSeededDefault =
    !callerContentType && normalized === "application/json";

  const shouldDrop =
    // a multipart/form-data without a usable boundary is incomplete
    (isMultipart && !hasBoundary) ||
    // a runtime-managed body types itself: drop the seeded application/json and
    // any manual multipart (its boundary is stale), but keep an explicit
    // non-JSON type (e.g. a Blob's image/png or an octet-stream default)
    (runtimeManaged && (isMultipart || isSeededDefault));

  if (shouldDrop) return withoutContentType(mergedHeaders);

  // Nothing to drop: leave the merged headers untouched unless the caller's
  // Content-Type collided with the default under a different casing, leaving
  // two Content-Type keys. In that case keep a single, canonical one.
  if (contentTypeKeyCount(mergedHeaders) < 2) return mergedHeaders;
  return { ...withoutContentType(mergedHeaders), "Content-Type": contentType };
}
