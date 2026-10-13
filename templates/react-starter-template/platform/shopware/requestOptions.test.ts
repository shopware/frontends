import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_API_TIMEOUT_MS,
  parseApiHeaders,
  parseApiTimeout,
  publicHeaderPolicy,
  serverHeaderPolicy,
} from "./requestOptions";

vi.mock("server-only", () => ({}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

async function freshModule() {
  vi.resetModules();
  return import("./requestOptions");
}

function stubRequestEnv(env: Record<string, string>) {
  for (const name of [
    "SHOPWARE_API_TIMEOUT",
    "SHOPWARE_API_HEADERS",
    "SHOPWARE_PUBLIC_API_HEADERS",
  ]) {
    vi.stubEnv(name, env[name] ?? "");
  }
}

function silentWarn() {
  return vi.spyOn(console, "warn").mockImplementation(() => {});
}

function parseServerHeaders(raw: string) {
  const warn = vi.fn();
  const headers = parseApiHeaders(
    raw,
    "SHOPWARE_API_HEADERS",
    serverHeaderPolicy,
    warn,
  );
  return { headers, warn };
}

function warnings(warn: { mock: { calls: unknown[][] } }): string {
  return warn.mock.calls.map((call) => String(call[0])).join("\n");
}

describe("parseApiTimeout", () => {
  it.each([
    ["unset", undefined],
    ["empty", ""],
    ["blank", "   "],
  ])("uses the default of 10 seconds when %s", (_, raw) => {
    const warn = vi.fn();

    expect(parseApiTimeout(raw, warn)).toBe(10_000);
    expect(warn).not.toHaveBeenCalled();
  });

  it.each(["2500", " 2500 "])("reads %j as milliseconds", (raw) => {
    const warn = vi.fn();

    expect(parseApiTimeout(raw, warn)).toBe(2500);
    expect(warn).not.toHaveBeenCalled();
  });

  it.each(["0", "000"])("turns the timeout off for %j", (raw) => {
    const warn = vi.fn();

    expect(parseApiTimeout(raw, warn)).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
  });

  it.each(["-1", "abc", "10s", "1.5", "1e4", "0x10"])(
    "falls back to the default for %j and warns without printing it",
    (raw) => {
      const warn = vi.fn();

      expect(parseApiTimeout(raw, warn)).toBe(DEFAULT_API_TIMEOUT_MS);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warnings(warn)).toContain("SHOPWARE_API_TIMEOUT");
      expect(warnings(warn)).toContain("0 turns the timeout off");
      expect(warnings(warn)).not.toContain(raw);
    },
  );
});

describe("parseApiHeaders", () => {
  it.each([
    ["unset", undefined],
    ["empty", ""],
    ["blank", "  "],
  ])("returns no headers when %s", (_, raw) => {
    const warn = vi.fn();

    expect(
      parseApiHeaders(raw, "SHOPWARE_API_HEADERS", serverHeaderPolicy, warn),
    ).toEqual({});
    expect(warn).not.toHaveBeenCalled();
  });

  it("lowercases and trims header names and keeps the values as given", () => {
    const { headers, warn } = parseServerHeaders(
      '{" Authorization ":"Basic c2VjcmV0","X-Waf-Bypass":"On Edge"}',
    );

    expect(headers).toEqual({
      authorization: "Basic c2VjcmV0",
      "x-waf-bypass": "On Edge",
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it.each([
    ["invalid JSON", '{"authorization": "Basic c2VjcmV0"'],
    ["an array", '["Basic c2VjcmV0"]'],
    ["null", "null"],
    ["a string", '"Basic c2VjcmV0"'],
    ["a number", "42"],
  ])("ignores the whole variable for %s and never prints it", (_, raw) => {
    const { headers, warn } = parseServerHeaders(raw);

    expect(headers).toEqual({});
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warnings(warn)).toContain("Ignoring SHOPWARE_API_HEADERS");
    expect(warnings(warn)).not.toContain("c2VjcmV0");
    expect(warnings(warn)).not.toContain("42");
  });

  it.each([
    ["a number", 42],
    ["a boolean", true],
    ["null", null],
    ["an object", { value: "c2VjcmV0" }],
    ["an empty string", ""],
    ["a blank string", "   "],
  ])("drops a header whose value is %s", (_, value) => {
    const { headers, warn } = parseServerHeaders(
      JSON.stringify({ "x-dropped": value, "x-kept": "yes" }),
    );

    expect(headers).toEqual({ "x-kept": "yes" });
    expect(warnings(warn)).toContain('"x-dropped"');
    expect(warnings(warn)).not.toContain("c2VjcmV0");
  });

  it.each([
    ["a line break", "c2VjcmV0\r\nx-injected: 1"],
    ["a NUL character", "c2VjcmV0\u0000"],
    ["a control character", "c2VjcmV0\u0007"],
    ["a character outside Latin-1", "c2VjcmV0€"],
  ])(
    "drops a value with %s and names the header without its value",
    (_, value) => {
      const { headers, warn } = parseServerHeaders(
        JSON.stringify({ "x-secret": value }),
      );

      expect(headers).toEqual({});
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warnings(warn)).toContain('"x-secret"');
      expect(warnings(warn)).not.toContain("c2VjcmV0");
    },
  );

  it("keeps Latin-1 characters and tabs inside a value", () => {
    const { headers, warn } = parseServerHeaders(
      JSON.stringify({ "x-label": "café\tbar" }),
    );

    expect(headers).toEqual({ "x-label": "café\tbar" });
    expect(warn).not.toHaveBeenCalled();
  });

  it.each(["bad name", "x:colon", "x-üml"])(
    "drops the invalid header name %j without printing it",
    (name) => {
      const { headers, warn } = parseServerHeaders(
        JSON.stringify({ [name]: "c2VjcmV0", "x-kept": "yes" }),
      );

      expect(headers).toEqual({ "x-kept": "yes" });
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warnings(warn)).toContain("not a valid HTTP header name");
      expect(warnings(warn)).not.toContain("c2VjcmV0");
      expect(warnings(warn)).not.toContain(name);
    },
  );

  it.each([
    "sw-access-key",
    "SW-Context-Token",
    "sw-language-id",
    "sw-currency-id",
    "sw-version-id",
    "Accept",
    "content-type",
    "Content-Length",
    "transfer-encoding",
    "keep-alive",
    "upgrade",
    "connection",
    "expect",
    "te",
    "trailer",
    "host",
  ])("drops the reserved %s header and names it without its value", (name) => {
    const { headers, warn } = parseServerHeaders(
      JSON.stringify({ [name]: "c2VjcmV0", "x-kept": "yes" }),
    );

    expect(headers).toEqual({ "x-kept": "yes" });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warnings(warn)).toContain(`"${name.toLowerCase()}"`);
    expect(warnings(warn)).not.toContain("c2VjcmV0");
  });

  it("lets the last spelling of a name win and warns about the duplicate", () => {
    const { headers, warn } = parseServerHeaders(
      '{"X-Edge":"first","x-edge":"second"}',
    );

    expect(headers).toEqual({ "x-edge": "second" });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warnings(warn)).toContain('"x-edge"');
    expect(warnings(warn)).not.toContain("first");
  });

  it("returns a frozen object", () => {
    const { headers } = parseServerHeaders('{"x-edge":"yes"}');

    expect(Object.isFrozen(headers)).toBe(true);
  });

  it.each([
    "cookie",
    "Origin",
    "referer",
    "proxy-authorization",
    "sec-fetch-site",
    "accept-encoding",
  ])("drops %s from the public variable only", (name) => {
    const raw = JSON.stringify({ [name]: "c2VjcmV0", "x-kept": "yes" });
    const warn = vi.fn();

    expect(
      parseApiHeaders(
        raw,
        "SHOPWARE_PUBLIC_API_HEADERS",
        publicHeaderPolicy,
        warn,
      ),
    ).toEqual({ "x-kept": "yes" });
    expect(warnings(warn)).toContain("SHOPWARE_PUBLIC_API_HEADERS");
    expect(warnings(warn)).toContain("browsers refuse to send it");
    expect(warnings(warn)).not.toContain("c2VjcmV0");
    expect(parseServerHeaders(raw).headers).toEqual({
      [name.toLowerCase()]: "c2VjcmV0",
      "x-kept": "yes",
    });
  });

  it("drops reserved names from the public variable too", () => {
    const warn = vi.fn();

    expect(
      parseApiHeaders(
        '{"sw-context-token":"c2VjcmV0","host":"shop.test"}',
        "SHOPWARE_PUBLIC_API_HEADERS",
        publicHeaderPolicy,
        warn,
      ),
    ).toEqual({});
    expect(warn).toHaveBeenCalledTimes(2);
  });
});

describe("getServerApiRequestOptions", () => {
  it("uses a 10 second timeout and no headers without configuration", async () => {
    stubRequestEnv({});
    const warn = silentWarn();
    const { getServerApiRequestOptions } = await freshModule();

    expect(getServerApiRequestOptions()).toEqual({
      timeout: 10_000,
      headers: {},
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it("turns the timeout off with SHOPWARE_API_TIMEOUT=0", async () => {
    stubRequestEnv({ SHOPWARE_API_TIMEOUT: "0" });
    const { getServerApiRequestOptions } = await freshModule();

    expect(getServerApiRequestOptions().timeout).toBeUndefined();
  });

  it("merges the public headers under the server ones", async () => {
    stubRequestEnv({
      SHOPWARE_PUBLIC_API_HEADERS:
        '{"Authorization":"Basic cHVibGlj","x-edge":"public"}',
      SHOPWARE_API_HEADERS:
        '{"authorization":"Basic c2VjcmV0","x-internal":"yes"}',
    });
    const { getServerApiRequestOptions, getPublicApiHeaders } =
      await freshModule();

    expect(getServerApiRequestOptions().headers).toEqual({
      authorization: "Basic c2VjcmV0",
      "x-edge": "public",
      "x-internal": "yes",
    });
    expect(getPublicApiHeaders()).toEqual({
      authorization: "Basic cHVibGlj",
      "x-edge": "public",
    });
  });

  it("does not send the public variable's browser-forbidden headers from the server either", async () => {
    silentWarn();
    stubRequestEnv({
      SHOPWARE_PUBLIC_API_HEADERS: '{"cookie":"a=b","x-edge":"public"}',
    });
    const { getServerApiRequestOptions } = await freshModule();

    expect(getServerApiRequestOptions().headers).toEqual({
      "x-edge": "public",
    });
  });

  it("parses once per value and again after the variable changes", async () => {
    stubRequestEnv({ SHOPWARE_API_HEADERS: '{"x-edge":"one"}' });
    const { getServerApiRequestOptions } = await freshModule();

    const first = getServerApiRequestOptions();

    expect(getServerApiRequestOptions()).toBe(first);

    vi.stubEnv("SHOPWARE_API_HEADERS", '{"x-edge":"two"}');
    vi.stubEnv("SHOPWARE_API_TIMEOUT", "2500");
    const second = getServerApiRequestOptions();

    expect(second).not.toBe(first);
    expect(second).toEqual({ timeout: 2500, headers: { "x-edge": "two" } });
  });

  it("warns once per problem across requests and never prints the values", async () => {
    const warn = silentWarn();
    stubRequestEnv({
      SHOPWARE_API_TIMEOUT: "10s",
      SHOPWARE_API_HEADERS: '{"sw-access-key":"SWSCSECRET","x-edge":1}',
      SHOPWARE_PUBLIC_API_HEADERS: "not json",
    });
    const { getServerApiRequestOptions } = await freshModule();

    getServerApiRequestOptions();
    vi.stubEnv("SHOPWARE_API_HEADERS", '{"sw-access-key":"SWSCOTHER"}');
    getServerApiRequestOptions();
    getServerApiRequestOptions();

    const printed = warnings(warn);
    expect(warn).toHaveBeenCalledTimes(4);
    expect(printed).toContain("SHOPWARE_API_TIMEOUT");
    expect(printed).toContain('"sw-access-key" header in SHOPWARE_API_HEADERS');
    expect(printed).toContain('"x-edge" header in SHOPWARE_API_HEADERS');
    expect(printed).toContain("Ignoring SHOPWARE_PUBLIC_API_HEADERS");
    expect(printed).not.toContain("10s");
    expect(printed).not.toContain("SWSCSECRET");
    expect(printed).not.toContain("SWSCOTHER");
    expect(printed).not.toContain("not json");
  });
});
