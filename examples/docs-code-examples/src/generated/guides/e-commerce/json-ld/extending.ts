import { useProductJsonLD } from "#imports";
import type { Schemas } from "#shopware";

const productResponse = {
  value: {
    product: {} as Schemas["Product"],
  },
};

useProductJsonLD(productResponse.value.product, {
  brand: {
    "@type": "Brand",
    name: "Test",
  },
});
