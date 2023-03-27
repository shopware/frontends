import { ShippingMethod } from "../../checkout/shipping/ShippingMethod";
import { CustomFields } from "../../common/CustomField";

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
