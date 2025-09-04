interface ProductWithManufacturer {
  manufacturer?: {
    translated?: {
      name?: string;
    };
  };
}

/**
 * Gets the translated name of the product manufacturer
 */
export function getProductManufacturerName(
  product: ProductWithManufacturer | null | undefined,
): string {
  return product?.manufacturer?.translated?.name || "";
}
