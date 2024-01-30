import type { components } from "@shopware/api-client/api-types";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import { defu } from "defu";

interface UseProductJsonLD {}
type JsonLDObject = { [key: string]: JsonLDValue };
type JsonLDValue = string | number | JsonLDObject | JsonLDValue[];

export function useProductJsonLD(
  product: components["schemas"]["Product"],
  additionalData: JsonLDObject = {},
): UseProductJsonLD {
  const { currencyCode } = usePrice();

  const JsonLd = {
    "@context": "http://schema.org/",
    "@type": "Product",
    name: getTranslatedProperty(product, "name"),
    description: getTranslatedProperty(product, "description").replace(
      /(<([^>]+)>)/gi,
      "",
    ),
    ean: product.ean,
    image: [product.cover?.media?.url],
    offers: {
      "@type": "AggregateOffer",
      offerCount: product?.stock ?? 0,
      lowPrice: product.calculatedCheapestPrice?.unitPrice ?? 0,
      highPrice: product.calculatedPrice?.unitPrice ?? 0,
      priceCurrency: currencyCode.value,
    },
  };

  useHead(() => {
    return {
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify(defu(JsonLd, additionalData)),
        },
      ],
    };
  });

  return {};
}
