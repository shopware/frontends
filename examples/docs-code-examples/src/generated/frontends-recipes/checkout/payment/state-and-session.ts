import {
  useDefaultOrderAssociations,
  useShopwareContext,
} from "@shopware/composables";

const { apiClient } = useShopwareContext();
const deepLinkCode = "deep-link-code";
const email = "customer@example.com";
const zipcode = "12345";

export const response = await apiClient.invoke("readOrder post /order", {
  body: {
    filter: [{ type: "equals", field: "deepLinkCode", value: deepLinkCode }],
    email,
    zipcode,
    associations: useDefaultOrderAssociations(),
    checkPromotion: true,
  },
});
