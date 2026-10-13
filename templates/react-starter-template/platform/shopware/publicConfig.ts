import { z } from "zod";

export type ApiHeaders = Readonly<Record<string, string>>;

export type PublicShopwareConfig = {
  endpoint: string;
  accessToken: string;
  devStorefrontUrl: string | null;
  headers?: ApiHeaders;
};

const HEADER_NAME = /^[!#$%&'*+\-.^_`|~0-9a-z]+$/i;
const HEADER_VALUE = /^[\t\x20-\x7e\x80-\xff]+$/;

const RESERVED_API_HEADERS = new Set([
  "accept",
  "content-type",
  "content-length",
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "expect",
  "te",
  "trailer",
]);

const BROWSER_FORBIDDEN_HEADERS = new Set([
  "accept-charset",
  "accept-encoding",
  "access-control-request-headers",
  "access-control-request-method",
  "cookie",
  "cookie2",
  "date",
  "dnt",
  "origin",
  "referer",
  "set-cookie",
  "via",
]);

export function isValidHeaderName(name: string): boolean {
  return HEADER_NAME.test(name);
}

export function isValidHeaderValue(value: string): boolean {
  return HEADER_VALUE.test(value) && value.trim() !== "";
}

export function isReservedApiHeader(name: string): boolean {
  const lowerCased = name.toLowerCase();
  return lowerCased.startsWith("sw-") || RESERVED_API_HEADERS.has(lowerCased);
}

export function isBrowserForbiddenHeader(name: string): boolean {
  const lowerCased = name.toLowerCase();
  return (
    lowerCased.startsWith("proxy-") ||
    lowerCased.startsWith("sec-") ||
    BROWSER_FORBIDDEN_HEADERS.has(lowerCased)
  );
}

function toBrowserHeaders(headers: Record<string, string>): ApiHeaders {
  const kept = new Map<string, string>();
  for (const [rawName, value] of Object.entries(headers)) {
    const name = rawName.trim().toLowerCase();
    if (
      isValidHeaderName(name) &&
      isValidHeaderValue(value) &&
      !isReservedApiHeader(name) &&
      !isBrowserForbiddenHeader(name)
    ) {
      kept.set(name, value);
    }
  }
  return Object.fromEntries(kept);
}

const publicShopwareConfigSchema = z.object({
  endpoint: z.string().min(1),
  accessToken: z.string().min(1),
  devStorefrontUrl: z.string().min(1).nullable(),
  headers: z
    .record(z.string(), z.string())
    .transform(toBrowserHeaders)
    .optional(),
});

export function parsePublicShopwareConfig(
  value: unknown,
): PublicShopwareConfig {
  return publicShopwareConfigSchema.parse(value);
}
