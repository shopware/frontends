import { describe, expect, it } from "vitest";
import { getCmsEntityObject } from "./index";

type FunctionParams = Parameters<typeof getCmsEntityObject>;

describe("helpers - test getCmsEntityObject", () => {
  it("should return the correct entity object based on the resource type", () => {
    const response: FunctionParams[0] = {
      resourceType: "frontend.detail.page",
      product: {
        /* product object */
        apiAlias: "product",
      },
      category: {
        /* category object */
        apiAlias: "category",
      },
      landingPage: {
        /* landing page object */
        apiAlias: "landing_page",
      },
    };

    const result1 = getCmsEntityObject(response);
    expect(result1).toEqual(response.product);

    response.resourceType = "frontend.navigation.page";
    const result2 = getCmsEntityObject(response);
    expect(result2).toEqual(response.category);

    response.resourceType = "frontend.landing.page";
    const result3 = getCmsEntityObject(response);
    expect(result3).toEqual(response.landingPage);
  });
});
