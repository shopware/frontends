import { getProductTierPrices } from "@shopware/helpers";
import type { TierPrice } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type ProductPrice = {
  price: Schemas["CalculatedPrice"] | undefined;
  totalPrice: number | undefined;
  unitPrice: number | undefined;
  referencePrice: Schemas["CalculatedPrice"]["referencePrice"] | undefined;
  displayFrom: boolean;
  displayFromVariants: number | false | undefined;
  tierPrices: TierPrice[];
  hasListPrice: boolean;
  regulationPrice: number | undefined;
};

export function getProductPrice(
  product: Schemas["Product"] | undefined,
): ProductPrice {
  const cheapest = product?.calculatedCheapestPrice;
  const calculatedPrices = product?.calculatedPrices ?? [];
  const real =
    calculatedPrices.length > 0
      ? calculatedPrices[0]
      : product?.calculatedPrice;

  const displayFrom = calculatedPrices.length > 1;

  const displayFromVariants =
    !!product?.parentId &&
    cheapest?.hasRange &&
    real?.unitPrice !== cheapest?.unitPrice &&
    cheapest?.unitPrice;

  const tierPrices = getProductTierPrices(product);

  const price =
    displayFrom && tierPrices.length > 1
      ? calculatedPrices.reduce((previous, current) =>
          current.unitPrice < previous.unitPrice ? current : previous,
        )
      : real;

  return {
    price,
    totalPrice: price?.totalPrice,
    unitPrice: price?.unitPrice,
    referencePrice: real?.referencePrice,
    displayFrom,
    displayFromVariants,
    tierPrices,
    hasListPrice: !!price?.listPrice?.percentage,
    regulationPrice: product?.calculatedPrice?.regulationPrice?.price,
  };
}
