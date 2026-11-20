import { inspect } from "node:util";

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import * as routeModule from "./route";
import { POST } from "./route";

vi.mock("server-only", () => ({}));

const ENDPOINT = "https://shopware.internal/store-api/";
const STORE_API_URL = `${ENDPOINT}account/login/imitate-customer`;
const NOW = Date.UTC(2026, 9, 13, 8, 0, 0);
const YEAR_LATER = new Date(NOW + 365 * 864e5).toUTCString();
const IMITATION_TOKEN = "imitation-jwt-secret";
const CONTEXT_TOKEN = "imitated-context-token";

const credentials = {
  token: IMITATION_TOKEN,
  customerId: "0190f0c1d2e3f4a5b6c7d8e9f0a1b2c3",
  userId: "0190a1b2c3d4e5f6a7b8c9d0e1f2a3b4",
};

type FetchMock = Mock<typeof fetch>;

let fetchMock: FetchMock;

function storeApiAnswer(
  body: unknown = { redirectUrl: null },
  {
    status = 200,
    headers = { "sw-context-token": CONTEXT_TOKEN },
  }: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function formRequest(
  fields: Record<string, string> = credentials,
  {
    url = "https://shop.test/account/login/imitate-customer",
    headers = {},
  }: { url?: string; headers?: Record<string, string> } = {},
): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    body: new URLSearchParams(fields),
    headers,
  });
}

function post(request: NextRequest, locale = "en-GB") {
  return POST(request, { params: Promise.resolve({ locale }) });
}

function sentRequest(): { url: string; init: RequestInit } {
  const call = fetchMock.mock.calls[0];
  if (!call) throw new Error("the Store API was not called");
  const [input, init = {}] = call;
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  return { url, init };
}

function sentHeaders(): Headers {
  return new Headers(sentRequest().init.headers);
}

function expectNoSession(response: Response) {
  expect(response.headers.get("set-cookie")).toBeNull();
}

beforeEach(() => {
  vi.useFakeTimers({ now: NOW, toFake: ["Date"] });
  vi.stubEnv("SHOPWARE_ENDPOINT", ENDPOINT);
  vi.stubEnv("SHOPWARE_PUBLIC_ENDPOINT", "");
  vi.stubEnv("SHOPWARE_ACCESS_TOKEN", "SWSCOWN");
  vi.stubEnv("SHOPWARE_DEV_STOREFRONT_URL", "");
  fetchMock = vi.fn<typeof fetch>(async () => storeApiAnswer());
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /account/login/imitate-customer", () => {
  it("answers only POST, so the admin token never ends up in a URL", () => {
    expect(Object.keys(routeModule)).toEqual(["POST"]);
  });

  it("logs the visitor in as the customer and sends them to the account with a 303", async () => {
    const response = await post(formRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/account");
    expect(response.headers.get("Cache-Control")).toBe("no-store");

    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`sw-context-token=${CONTEXT_TOKEN}`);
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toMatch(/SameSite=lax/i);
    expect(setCookie).toContain("Secure");
    expect(setCookie).toContain(`Expires=${YEAR_LATER}`);
    expect(setCookie).not.toMatch(/HttpOnly/i);
    expect(response.cookies.get("sw-context-token")).toMatchObject({
      value: CONTEXT_TOKEN,
      path: "/",
      sameSite: "lax",
      secure: true,
    });
  });

  it("posts the three form fields as JSON with the access key and no context token", async () => {
    await post(
      formRequest(credentials, {
        headers: { cookie: "sw-context-token=visitor-guest-token" },
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const { url, init } = sentRequest();
    expect(url).toBe(STORE_API_URL);
    expect(init.method?.toUpperCase()).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual(credentials);
    const headers = sentHeaders();
    expect(headers.get("sw-access-key")).toBe("SWSCOWN");
    expect(headers.has("sw-context-token")).toBe(false);
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain(
      "visitor-guest-token",
    );
  });

  it("keeps the locale of the URL in the account redirect", async () => {
    const response = await post(
      formRequest(credentials, {
        url: "https://shop.test/pl-PL/account/login/imitate-customer",
      }),
      "pl-PL",
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/pl-PL/account");
    expect(response.headers.get("set-cookie")).toContain(
      `sw-context-token=${CONTEXT_TOKEN}`,
    );
  });

  it("does not mark the cookie secure on a plain http storefront", async () => {
    const response = await post(
      formRequest(credentials, {
        url: "http://localhost:3000/account/login/imitate-customer",
      }),
    );

    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`sw-context-token=${CONTEXT_TOKEN}`);
    expect(setCookie).not.toContain("Secure");
  });

  it("marks the cookie secure behind a TLS-terminating proxy", async () => {
    const response = await post(
      formRequest(credentials, {
        url: "http://localhost:3000/account/login/imitate-customer",
        headers: { "x-forwarded-proto": "https, http" },
      }),
    );

    expect(response.headers.get("set-cookie")).toContain("Secure");
  });

  it.each([
    ["the token", { customerId: credentials.customerId, userId: "u" }],
    ["the customer id", { token: IMITATION_TOKEN, userId: "u" }],
    ["the user id", { token: IMITATION_TOKEN, customerId: "c" }],
    ["a value", { ...credentials, userId: "  " }],
  ])(
    "sends the visitor home without calling the Store API when %s is missing",
    async (_missing, fields) => {
      const response = await post(formRequest(fields));

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toBe("/");
      expect(response.headers.get("Cache-Control")).toBe("no-store");
      expect(fetchMock).not.toHaveBeenCalled();
      expectNoSession(response);
    },
  );

  it("sends the visitor to the home page of the locale when a field is missing", async () => {
    const response = await post(
      formRequest(
        { token: IMITATION_TOKEN },
        { url: "https://shop.test/pl-PL/account/login/imitate-customer" },
      ),
      "pl-PL",
    );

    expect(response.headers.get("Location")).toBe("/pl-PL");
    expectNoSession(response);
  });

  it("refuses a JSON body, which the Administration form never sends", async () => {
    const response = await post(
      new NextRequest("https://shop.test/account/login/imitate-customer", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(response.headers.get("Location")).toBe("/");
    expect(fetchMock).not.toHaveBeenCalled();
    expectNoSession(response);
  });

  it("refuses a file upload in place of a field", async () => {
    const form = new FormData();
    form.set("token", new File([IMITATION_TOKEN], "token.txt"));
    form.set("customerId", credentials.customerId);
    form.set("userId", credentials.userId);

    const response = await post(
      new NextRequest("https://shop.test/account/login/imitate-customer", {
        method: "POST",
        body: form,
      }),
    );

    expect(response.headers.get("Location")).toBe("/");
    expect(fetchMock).not.toHaveBeenCalled();
    expectNoSession(response);
  });

  it("sends the visitor home when the Store API refuses the token and never logs it", async () => {
    fetchMock.mockResolvedValue(
      storeApiAnswer(
        {
          errors: [
            {
              status: "400",
              code: "CHECKOUT__IMITATE_CUSTOMER_INVALID_TOKEN",
              title: "Bad Request",
              detail: `The token "${IMITATION_TOKEN}" is invalid.`,
              meta: { parameters: { token: IMITATION_TOKEN } },
            },
          ],
        },
        { status: 400, headers: { "sw-context-token": "guest-token" } },
      ),
    );

    const response = await post(formRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/");
    expectNoSession(response);
    expect(console.error).toHaveBeenCalledExactlyOnceWith(
      "[Imitation] the Store API refused the customer imitation",
      { status: 400, codes: ["CHECKOUT__IMITATE_CUSTOMER_INVALID_TOKEN"] },
    );
    const logged = vi
      .mocked(console.error)
      .mock.calls.map((args) =>
        inspect(args, { depth: null, showHidden: true }),
      )
      .join("\n");
    expect(logged).not.toContain(IMITATION_TOKEN);
  });

  it("sends the visitor home when the Store API cannot be reached", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const response = await post(formRequest());

    expect(response.headers.get("Location")).toBe("/");
    expectNoSession(response);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("sends the visitor home when the answer carries no context token", async () => {
    fetchMock.mockResolvedValue(
      storeApiAnswer({ redirectUrl: null }, { headers: {} }),
    );

    const response = await post(formRequest());

    expect(response.headers.get("Location")).toBe("/");
    expectNoSession(response);
  });

  it("ignores a context token from a publicly cached answer", async () => {
    fetchMock.mockResolvedValue(
      storeApiAnswer(
        { redirectUrl: null },
        {
          headers: {
            "sw-context-token": CONTEXT_TOKEN,
            "Cache-Control": "public, max-age=3600",
          },
        },
      ),
    );

    const response = await post(formRequest());

    expect(response.headers.get("Location")).toBe("/");
    expectNoSession(response);
  });

  it("ignores the redirectUrl of the Store API answer", async () => {
    fetchMock.mockResolvedValue(
      storeApiAnswer({ redirectUrl: "https://evil.example/phish" }),
    );

    const response = await post(formRequest());

    expect(response.headers.get("Location")).toBe("/account");
  });

  it("falls back to the default locale for an unknown locale param", async () => {
    const success = await post(formRequest(), "xx-XX");
    expect(success.headers.get("Location")).toBe("/account");

    const failure = await post(
      formRequest({ token: IMITATION_TOKEN }),
      "xx-XX",
    );
    expect(failure.headers.get("Location")).toBe("/");
  });
});
