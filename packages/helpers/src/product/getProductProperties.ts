import { Product } from "@shopware-pwa/types";
import { UiProductProperty } from "../ui-interfaces";
import { getTranslatedProperty } from "../getTranslatedProperty";

/**
 * Get product properties as ui-interfaces
 *
 * @public
 *
 * @category Product
 */
export function getProductProperties({
  product,
}: { product?: Product } = {}): UiProductProperty[] {
  const propertyList = product?.properties?.map((property) => ({
    name: getTranslatedProperty(property.group, "name"),
    value: getTranslatedProperty(property, "name"),
  }));

  return propertyList || [];
}
