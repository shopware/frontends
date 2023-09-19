import { test, expect } from "@playwright/test";

test("fetch or create cart ", async ({ request }) => {
  const wishlsit = await request.get(`/store-api/checkout/cart`, {
    data: {
      page: 0,
      limit: 0,
    },
  });

  expect(wishlsit.ok()).toBeTruthy();
});
