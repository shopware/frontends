// flaky
await page.waitForLoadState("networkidle");
await page.getByTestId("product-box-product-name-link").first().click();

// reliable
const firstProduct = page.getByTestId("product-box-product-name-link").first();
await firstProduct.waitFor({ state: "visible" });
await firstProduct.click();
