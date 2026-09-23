import { expect, test } from "../fixtures";

test.describe("Sitemap", { tag: "@frontends" }, () => {
  test("sitemap.xml is a sitemap index", async ({ request }) => {
    const response = await request.get("/sitemap.xml");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    expect(await response.text()).toContain("<sitemapindex");
  });
});
