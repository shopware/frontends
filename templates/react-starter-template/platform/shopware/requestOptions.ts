import "server-only";
import {
  isBrowserForbiddenHeader,
  isReservedApiHeader,
  isValidHeaderName,
  isValidHeaderValue,
} from "./publicConfig";
import type { ApiHeaders } from "./publicConfig";

export const DEFAULT_API_TIMEOUT_MS = 10_000;

export type ApiRequestOptions = Readonly<{
  timeout: number | undefined;
  headers: ApiHeaders;
}>;

export type HeaderPolicy = (name: string) => string | null;

type Warn = (message: string) => void;

const API_TIMEOUT_VARIABLE = "SHOPWARE_API_TIMEOUT";
const API_HEADERS_VARIABLE = "SHOPWARE_API_HEADERS";
const PUBLIC_API_HEADERS_VARIABLE = "SHOPWARE_PUBLIC_API_HEADERS";
const WHOLE_MILLISECONDS = /^\d+$/;
const NO_HEADERS: ApiHeaders = Object.freeze({});

const RESERVED_REASON =
  "the Store API client or the HTTP connection sets it itself";
const BROWSER_FORBIDDEN_REASON = "browsers refuse to send it";

export const serverHeaderPolicy: HeaderPolicy = (name) =>
  isReservedApiHeader(name) ? RESERVED_REASON : null;

export const publicHeaderPolicy: HeaderPolicy = (name) => {
  if (isReservedApiHeader(name)) return RESERVED_REASON;
  return isBrowserForbiddenHeader(name) ? BROWSER_FORBIDDEN_REASON : null;
};

export function parseApiTimeout(
  raw: string | undefined,
  warn: Warn,
): number | undefined {
  const value = raw?.trim() ?? "";
  if (value === "") return DEFAULT_API_TIMEOUT_MS;
  if (!WHOLE_MILLISECONDS.test(value)) {
    warn(
      `[Shopware] Ignoring ${API_TIMEOUT_VARIABLE}: expected whole milliseconds, 0 turns the timeout off. Using ${DEFAULT_API_TIMEOUT_MS}.`,
    );
    return DEFAULT_API_TIMEOUT_MS;
  }
  const timeout = Number(value);
  return timeout === 0 ? undefined : timeout;
}

function isHeaderObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export function parseApiHeaders(
  raw: string | undefined,
  variable: string,
  policy: HeaderPolicy,
  warn: Warn,
): ApiHeaders {
  const value = raw?.trim() ?? "";
  if (value === "") return NO_HEADERS;
  const parsed = parseJson(value);
  if (!isHeaderObject(parsed)) {
    warn(
      `[Shopware] Ignoring ${variable}: expected a JSON object that maps header names to string values.`,
    );
    return NO_HEADERS;
  }
  const headers = new Map<string, string>();
  for (const [rawName, headerValue] of Object.entries(parsed)) {
    const name = rawName.trim().toLowerCase();
    if (!isValidHeaderName(name)) {
      warn(
        `[Shopware] Ignoring a header in ${variable}: its name is not a valid HTTP header name.`,
      );
      continue;
    }
    const reason = policy(name);
    if (reason) {
      warn(
        `[Shopware] Ignoring the "${name}" header in ${variable}: ${reason}.`,
      );
      continue;
    }
    if (typeof headerValue !== "string" || headerValue.trim() === "") {
      warn(
        `[Shopware] Ignoring the "${name}" header in ${variable}: expected a non-empty string value.`,
      );
      continue;
    }
    if (!isValidHeaderValue(headerValue)) {
      warn(
        `[Shopware] Ignoring the "${name}" header in ${variable}: its value holds a line break, a control character or a character outside Latin-1.`,
      );
      continue;
    }
    if (headers.has(name)) {
      warn(
        `[Shopware] ${variable} sets the "${name}" header more than once (names are case-insensitive). Using the last one.`,
      );
    }
    headers.set(name, headerValue);
  }
  return headers.size === 0
    ? NO_HEADERS
    : Object.freeze(Object.fromEntries(headers));
}

const warnedMessages = new Set<string>();

function warnOnce(message: string): void {
  if (warnedMessages.has(message)) return;
  warnedMessages.add(message);
  console.warn(message);
}

function memoizeLatest<ARGS extends readonly unknown[], RESULT>(
  compute: (...args: ARGS) => RESULT,
): (...args: ARGS) => RESULT {
  let latest: { args: ARGS; result: RESULT } | undefined;
  return (...args) => {
    if (latest?.args.every((arg, index) => Object.is(arg, args[index]))) {
      return latest.result;
    }
    const result = compute(...args);
    latest = { args, result };
    return result;
  };
}

const readTimeout = memoizeLatest((raw: string | undefined) =>
  parseApiTimeout(raw, warnOnce),
);

const readPrivateHeaders = memoizeLatest((raw: string | undefined) =>
  parseApiHeaders(raw, API_HEADERS_VARIABLE, serverHeaderPolicy, warnOnce),
);

const readPublicHeaders = memoizeLatest((raw: string | undefined) =>
  parseApiHeaders(
    raw,
    PUBLIC_API_HEADERS_VARIABLE,
    publicHeaderPolicy,
    warnOnce,
  ),
);

const combineServerOptions = memoizeLatest(
  (
    timeout: number | undefined,
    publicHeaders: ApiHeaders,
    privateHeaders: ApiHeaders,
  ): ApiRequestOptions =>
    Object.freeze({
      timeout,
      headers: Object.freeze({ ...publicHeaders, ...privateHeaders }),
    }),
);

export function getPublicApiHeaders(): ApiHeaders {
  return readPublicHeaders(process.env.SHOPWARE_PUBLIC_API_HEADERS);
}

export function getServerApiRequestOptions(): ApiRequestOptions {
  return combineServerOptions(
    readTimeout(process.env.SHOPWARE_API_TIMEOUT),
    getPublicApiHeaders(),
    readPrivateHeaders(process.env.SHOPWARE_API_HEADERS),
  );
}
