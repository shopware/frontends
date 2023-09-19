import { test, expect } from "@playwright/test";

test("fetch a wishlist ", async ({ request }) => {
  const wishlsit = await request.post(`/store-api/customer/wishlist`, {
    data: {
      page: 0,
      limit: 0,
      filter: [
        {
          type: "string",
          field: "string",
          value: "string",
        },
      ],
    },
  });

  expect(wishlsit.ok()).toBeTruthy();
});
