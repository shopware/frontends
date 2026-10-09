import { describe, expect, it } from "vitest";

import { getFrontendRouteName } from "./getFrontendRouteName";

describe("getFrontendRouteName", () => {
  it("maps headless product route to the storefront detail page", () => {
    expect(getFrontendRouteName("store-api.product.detail")).toBe(
      "frontend.detail.page",
    );
  });

  it("maps headless category route to the storefront navigation page", () => {
    expect(getFrontendRouteName("store-api.category.detail")).toBe(
      "frontend.navigation.page",
    );
  });

  it("maps headless landing page route to the storefront landing page", () => {
    expect(getFrontendRouteName("store-api.landing-page.detail")).toBe(
      "frontend.landing.page",
    );
  });

  it("keeps storefront route names unchanged", () => {
    expect(getFrontendRouteName("frontend.detail.page")).toBe(
      "frontend.detail.page",
    );
  });

  it("keeps unknown route names unchanged", () => {
    expect(getFrontendRouteName("frontend.custom.page")).toBe(
      "frontend.custom.page",
    );
  });

  it("passes undefined through", () => {
    expect(getFrontendRouteName(undefined)).toBeUndefined();
  });
});
