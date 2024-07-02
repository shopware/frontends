import { test, expect } from "@playwright/test";
import { z } from "zod";
// import { api } from "../../schema/6.5.3.0-zod";
import productSchema from "../../schema/product_schema";

let productUuid = "0c0995b393d74e91bdf00ffdf9bfb2a0";
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

test("get product detail", async ({ request }) => {
  const productDetail = await request.post(`/store-api/product/${productUuid}`);
  expect(productDetail.ok()).toBeTruthy();
  expect(productDetail).toMatchSchema(productSchema);
});
