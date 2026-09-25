import type { Schemas } from "#shopware";

export function useProductJsonLD(
  product: Schemas["Product"],
  additionalData: Record<string, unknown> = {},
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.translated?.name ?? product.name,
    ...additionalData,
  };
}
