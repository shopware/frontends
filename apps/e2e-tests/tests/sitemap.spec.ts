import { gunzipSync } from "node:zlib";

import { expect, test } from "../fixtures";

test.describe("Sitemap", { tag: "@frontends" }, () => {
  test("sitemap.xml lists files on this host and they resolve", async ({
    request,
  }) => {
    const index = await request.get("/sitemap.xml");

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

    const file = await request.get(locations[0]);
    expect(file.status()).toBe(200);

    const bytes = await file.body();
    const xml = locations[0].endsWith(".gz")
      ? gunzipSync(bytes).toString("utf8")
      : bytes.toString("utf8");
    expect(xml).toContain("<urlset");
  });
});
