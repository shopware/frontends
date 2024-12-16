import type { ShippingMethod } from "../../checkout/shipping/ShippingMethod";
import type { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type PropertyGroupTranslation = {
  shippingMethodId: string;
  name: string | null;
  description: string | null;
  shippingMethod: ShippingMethod | null;
  customFields: CustomFields;
};
