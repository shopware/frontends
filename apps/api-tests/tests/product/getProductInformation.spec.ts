import { test, expect } from "@playwright/test";

let productUuid = "";
let search = "";

// function to calculate the size of a JSON object
function bytesToSize(bytes: number): string {
  const units = ["byte", "kilobyte", "megabyte", "terabyte", "petabyte"];
  const unit = Math.floor(Math.log(bytes) / Math.log(1024));
  return new Intl.NumberFormat("en", {
    style: "unit",
    unit: units[unit],
  }).format(bytes / 1024 ** unit);
}

test("get product list (default, without any params)", async ({ request }) => {
  const productList = await request.post(`/store-api/product`);

  const productListJson = await productList.json();
  productUuid = productListJson.elements[0].id; // here we set the uuid for later use

  expect(productList.ok()).toBeTruthy();
});

test("get product detail", async ({ request }) => {
  const productDetail = await request.post(`/store-api/product/${productUuid}`);

  const productDetailJson = await productDetail.json();
  const productName = productDetailJson.product.name;
  const productNameWords = productName.split(" ");
  search = productNameWords[0]; // here we set the search term for later use

  expect(productDetail.ok()).toBeTruthy();
});

test("get product list for 100 products", async ({ request }) => {
  const productList = await request.post(`/store-api/product`, {
    data: {
      page: 1,
      limit: 100,
      associations: {
        manufacturer: {},
      },
      fields: ["ean"],
    },
  });

  const productListJson = await productList.json();
  const productListSize = bytesToSize(JSON.stringify(productListJson).length);
  console.log(`The productListJson is approximately ${productListSize}.`);

  expect(productList.ok()).toBeTruthy();
});
