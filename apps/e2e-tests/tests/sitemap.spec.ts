import { gunzipSync } from "node:zlib";

import type { APIRequestContext, APIResponse } from "@playwright/test";

import { expect, test } from "../fixtures";

/**
 * Both routes read the file list from the Store API, which the shared demo
 * backend rate-limits. The index passes its 429 on, and a throttled file
 * fetch becomes a 502. Wait it out, as the page objects do.
 */
async function getWhenNotThrottled(request: APIRequestContext, url: string) {
  let response: APIResponse | undefined;
  await expect(async () => {
    response = await request.get(url);
    expect(
      [429, 502].includes(response.status()),
      `${url} answered ${response.status()}`,
    ).toBe(false);
  }).toPass({ intervals: [5_000, 10_000, 20_000], timeout: 45_000 });
  return response as APIResponse;
}

test.describe("Sitemap", { tag: "@frontends" }, () => {
  test("sitemap.xml lists files on this host and they resolve", async ({
    request,
  }) => {
    const index = await getWhenNotThrottled(request, "/sitemap.xml");

    expect(index.status()).toBe(200);
    expect(index.headers()["content-type"]).toContain("xml");

    const body = await index.text();
    expect(body).toContain("<sitemapindex");

    const origin = new URL(index.url()).origin;
    const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1],
    );
    expect(locations.length).toBeGreaterThan(0);
    for (const location of locations) {
      expect(location.startsWith(`${origin}/sitemap/`)).toBe(true);
    }

    const file = await getWhenNotThrottled(request, locations[0]);
    expect(file.status()).toBe(200);

    const bytes = await file.body();
    const xml = locations[0].endsWith(".gz")
      ? gunzipSync(bytes).toString("utf8")
      : bytes.toString("utf8");
    expect(xml).toContain("<urlset");
  });

  test("sitemap proxy serves only listed files", async ({ request }) => {
    const response = await getWhenNotThrottled(
      request,
      "/sitemap/not-listed.xml.gz",
    );
    expect(response.status()).toBe(404);
  });
});
