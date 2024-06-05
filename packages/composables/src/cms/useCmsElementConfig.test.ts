import { describe, expect, it } from "vitest";
import type {
  CmsElementBuyBox,
  CmsElementForm,
  CmsElementImage,
} from "../types";
import { useCmsElementConfig } from "./useCmsElementConfig";

describe("useCmsElementConfig", () => {
  describe("methods", () => {
    describe("getConfigValue", () => {
      it("should return config value", () => {
        const cmsElement: CmsElementBuyBox = {
          type: "buy-box",
          slot: "buyBox",
          config: {
            alignment: {
              source: "static",
              value: "flex-start",
            },
            product: {
              source: "static",
              value: "123",
            },
          },
          customFields: [],
          data: {
            apiAlias: "cms_product_description_reviews",
            productId: "123",
            configuratorSettings: null,
            ratingSuccess: false,
            reviews: {
              entity: "product_review",
              total: 0,
              aggregations: [],
              page: 1,
              limit: 10,
              elements: [],
              apiAlias: "product_review",
            },
          },
          _uniqueIdentifier: "cms_product_description_reviews",
          locked: false,
          versionId: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
          extensions: [{}],
          id: "123",
          translated: {},
          translations: {},
          block: null,
          blockId: "123",
          fieldConfig: [],
          apiAlias: "cms_slot",
        } as unknown as CmsElementBuyBox;

        const { getConfigValue } = useCmsElementConfig(cmsElement);

        expect(getConfigValue("alignment")).toEqual("flex-start");
      });

      it("should return undefined if config value is undefined", () => {
        const { getConfigValue } = useCmsElementConfig({
          config: {
            alignment: {
              value: undefined,
            },
          },
        } as unknown as CmsElementBuyBox);

        expect(getConfigValue("alignment")).toBeUndefined();
      });

      it("should return undefined if config value is null", () => {
        const { getConfigValue } = useCmsElementConfig({
          config: {
            boxLayout: {
              value: null,
            },
          },
        } as unknown as CmsElementImage);

        expect(getConfigValue("boxLayout")).toEqual(null);
      });

      it("should return undefined if config value is null", () => {
        const cmsElement: CmsElementForm = {
          type: "form",
          slot: "qwe",
          config: {
            confirmationText: {
              source: "static",
              value: "qwe",
            },
            defaultMailReceiver: {
              source: "static",
              value: false,
            },
            mailReceiver: {
              source: "static",
              value: ["first", "second"],
            },
            title: {
              source: "static",
              value: "Cool mail",
            },
            type: {
              source: "static",
              value: "contact",
            },
          },
          customFields: [],
          data: [],
          _uniqueIdentifier: "qwe",
          locked: false,
          versionId: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
          extensions: [{}],
          id: "123",
          translated: {
            config: {
              content: {
                source: "static",
                value: "123",
              },
              verticalAlign: {
                source: "static",
                value: "flex-start",
              },
            },
          },
          translations: {},
          block: null,
          blockId: "123",
          fieldConfig: [],
          apiAlias: "cms_slot",
        };
        const { getConfigValue } = useCmsElementConfig(cmsElement);
        expect(getConfigValue("defaultMailReceiver")).toEqual(false);
        expect(getConfigValue("mailReceiver")).toEqual(["first", "second"]);
      });
    });
  });
});
