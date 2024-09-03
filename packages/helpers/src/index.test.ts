import { describe, expect, it } from "vitest";
import * as helpers from "./index";

describe("helpers - test global API", () => {
  it("global API should match snapshot", () => {
    expect(helpers).toMatchInlineSnapshot(`
      {
        "buildUrlPrefix": [Function],
        "canUseQuoteActions": [Function],
        "downloadFile": [Function],
        "getBackgroundImageUrl": [Function],
        "getBiggestThumbnailUrl": [Function],
        "getCategoryBreadcrumbs": [Function],
        "getCategoryImageUrl": [Function],
        "getCategoryRoute": [Function],
        "getCategoryUrl": [Function],
        "getCmsEntityObject": [Function],
        "getCmsLayoutConfiguration": [Function],
        "getCmsTranslate": [Function],
        "getFormattedPrice": [Function],
        "getLanguageName": [Function],
        "getListingFilters": [Function],
        "getMainImageUrl": [Function],
        "getMedia": [Function],
        "getProductCalculatedListingPrice": [Function],
        "getProductFreeShipping": [Function],
        "getProductFromPrice": [Function],
        "getProductName": [Function],
        "getProductRatingAverage": [Function],
        "getProductReviews": [Function],
        "getProductRoute": [Function],
        "getProductTierPrices": [Function],
        "getProductUrl": [Function],
        "getShippingMethodDeliveryTime": [Function],
        "getSmallestThumbnailUrl": [Function],
        "getSrcSetForMedia": [Function],
        "getTranslatedProperty": [Function],
        "helpersCssClasses": [
          "max-md:hidden",
          "md:max-lg:hidden",
          "lg:hidden",
        ],
        "isCategory": [Function],
        "isLandingPage": [Function],
        "isMaintenanceMode": [Function],
        "isProduct": [Function],
        "relativeUrlSlash": [Function],
        "urlIsAbsolute": [Function],
      }
    `);
  });
});
