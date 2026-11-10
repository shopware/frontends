import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

import type {
  APIRequestContext,
  APIResponse,
  BrowserContext,
} from "@playwright/test";

import { expect, test } from "../fixtures";

const CONTINUE = "/checkout/continue/";
const UCP_LINK = '</.well-known/ucp>; rel="service-meta"';
const SAME_ORIGIN = { "sec-fetch-site": "same-origin" };
// A valid shape the backend has never seen, so it answers with an empty cart.
const UNKNOWN_TOKEN = "e2eHandoffUnknownToken0000000001";

/**
 * The route turns a throttled Store API answer into a 502. The shared demo
 * backend rate-limits, so wait it out like the sitemap spec does.
 */
async function postWhenNotThrottled(
  request: APIRequestContext,
  url: string,
  headers: Record<string, string>,
) {
  let response: APIResponse | undefined;
  await expect(async () => {
    response = await request.post(url, { headers, maxRedirects: 0 });
    expect(
      [429, 502].includes(response.status()),
      `${url} answered ${response.status()}`,
    ).toBe(false);
  }).toPass({ intervals: [5_000, 10_000, 20_000], timeout: 45_000 });
  return response as APIResponse;
}

/**
 * Playwright and the URL parser normalise "%2e%2e" to ".." before sending.
 * Only a raw request shows what the server does with such a path.
 */
function rawGet(baseURL: string, rawPath: string) {
  const base = new URL(baseURL);
  const request = base.protocol === "https:" ? httpsRequest : httpRequest;
  return new Promise<{ status: number; contentType: string }>(
    (resolve, reject) => {
      request(
        { host: base.hostname, port: base.port, path: rawPath, method: "GET" },
        (response) => {
          response.resume();
          response.on("end", () =>
            resolve({
              status: response.statusCode ?? 0,
              contentType: String(response.headers["content-type"] ?? ""),
            }),
          );
        },
      )
        .on("error", reject)
        .end();
    },
  );
}

async function sessionToken(context: BrowserContext) {
  const cookies = await context.cookies();
  return cookies.find((cookie) => cookie.name === "sw-context-token")?.value;
}

test.describe("Agent checkout handoff", { tag: "@frontends" }, () => {
  let enabled = false;

  test.beforeAll(async ({ request }) => {
    // The Link header is the public sign that the handoff is on.
    const home = await request.get("/");
    enabled = (home.headers().link ?? "").includes(UCP_LINK);
  });

  test("the continue page and route exist only while the handoff is on", async ({
    request,
  }) => {
    const page = await request.get(`${CONTINUE}${UNKNOWN_TOKEN}`, {
      maxRedirects: 0,
    });
    expect(page.status()).toBe(enabled ? 200 : 404);
    if (enabled) {
      // The page is client-rendered, so the server sets these.
      expect(page.headers()["referrer-policy"]).toBe("no-referrer");
      expect(page.headers()["x-robots-tag"]).toBe("noindex, nofollow");
      expect(page.headers()["cache-control"]).toContain("no-store");
    }

    const localized = await request.get(`/de-DE${CONTINUE}${UNKNOWN_TOKEN}`, {
      maxRedirects: 0,
    });
    expect(localized.status()).toBe(enabled ? 200 : 404);
    if (enabled) {
      expect(localized.headers()["referrer-policy"]).toBe("no-referrer");
    }

    const adopt = await request.post(`${CONTINUE}not-a-token`, {
      headers: SAME_ORIGIN,
      maxRedirects: 0,
    });
    expect(adopt.status()).toBe(enabled ? 303 : 404);
  });

  test("a traversal path under /ucp/ is not proxied", async ({ baseURL }) => {
    const response = await rawGet(
      baseURL as string,
      "/ucp/%2e%2e/api/_info/version",
    );
    expect(response.status).toBe(404);
    expect(response.contentType).toContain("text/html");
  });

  test("a cross-site post cannot adopt a token", async ({ request }) => {
    test.skip(!enabled, "the handoff is off on this host");
    const response = await request.post(`${CONTINUE}${UNKNOWN_TOKEN}`, {
      headers: { "sec-fetch-site": "cross-site" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(403);
    expect(response.headers()["set-cookie"] ?? "").not.toContain(
      "sw-context-token",
    );
  });

  test("a malformed token is never adopted", async ({ request }) => {
    test.skip(!enabled, "the handoff is off on this host");
    const response = await request.post(`${CONTINUE}not-a-token`, {
      headers: SAME_ORIGIN,
      maxRedirects: 0,
    });
    expect(response.status()).toBe(303);
    expect(response.headers().location).toBe("/checkout/cart?handoff=invalid");
    expect(response.headers()["set-cookie"] ?? "").not.toContain(
      "sw-context-token",
    );
  });

  test("an unknown token is not adopted", async ({ request }) => {
    test.skip(!enabled, "the handoff is off on this host");
    const response = await postWhenNotThrottled(
      request,
      `${CONTINUE}${UNKNOWN_TOKEN}`,
      SAME_ORIGIN,
    );
    expect(response.status()).toBe(303);
    expect(response.headers().location).toBe(
      "/checkout/cart?handoff=unavailable",
    );
    expect(response.headers()["set-cookie"] ?? "").not.toContain(
      "sw-context-token",
    );
  });

  test("keeping the cart leaves the session as it was", async ({ page }) => {
    test.skip(!enabled, "the handoff is off on this host");
    await page.goto("/");
    const before = await sessionToken(page.context());
    expect(before).toBeTruthy();

    await page.goto(`${CONTINUE}${UNKNOWN_TOKEN}`);
    await expect(
      page.getByRole("button", { name: "Continue with this cart" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Keep my cart" }).click();
    await expect(page).toHaveURL(/\/checkout\/cart$/);
    expect(await sessionToken(page.context())).toBe(before);
  });

  test("a dead link leaves the session as it was", async ({ page }) => {
    test.skip(!enabled, "the handoff is off on this host");
    await page.goto("/");
    const before = await sessionToken(page.context());
    expect(before).toBeTruthy();

    await page.goto(`${CONTINUE}${UNKNOWN_TOKEN}`);
    await page.getByRole("button", { name: "Continue with this cart" }).click();
    await expect(
      page.getByText(
        "The checkout from your AI assistant is no longer available",
        {
          exact: false,
        },
      ),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/checkout\/cart$/);
    expect(await sessionToken(page.context())).toBe(before);
  });

  test("the cart explains a rejected link and cleans the URL", async ({
    page,
  }) => {
    test.skip(!enabled, "the handoff is off on this host");
    await page.goto("/checkout/cart?handoff=invalid");
    await expect(
      page.getByText("This checkout link is not valid."),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/checkout\/cart$/);
  });
});
