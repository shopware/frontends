import { test, expect } from "@playwright/test";

let categoryUuid = "";

test("fetch a list of categories", async ({ request }) => {
  const categoryList = await request.post(`/store-api/category`, {
    data: {
      page: 1,
      limit: 10,
      filter: [
        {
          type: "equals",
          field: "active",
          value: "true",
        },
      ],
    },
  });

  const categoryListJson = await categoryList.json();
  categoryUuid = categoryListJson.elements[0].id; // here we set the category uuid for later use

  expect(categoryList.ok()).toBeTruthy();
});

test("fetch a single (active) category", async ({ request }) => {
  const category = await request.post(`/store-api/category/${categoryUuid}`);

  expect(category.ok()).toBeTruthy();
});
