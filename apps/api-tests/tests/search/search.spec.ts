import { test, expect } from "@playwright/test";

let search = "test";

test("search for products", async ({ request }) => {
  const productSearch = await request.post(`/store-api/search`, {
    data: {
      search: search,
      page: 1,
      limit: 10,
      associations: { manufacturer: {} },
    },
  });

  expect(productSearch.ok()).toBeTruthy();
});
