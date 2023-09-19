import { test, expect } from "@playwright/test";

test("Get information about current customer", async ({ request }) => {
  const customer = await request.post(`/store-api/account/customer`);

  expect(customer.ok()).toBeTruthy();
});
