import { ShippingMethod } from "./ShippingMethod";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type ShippingMethodTranslation = {
  shippingMethodId: string;
  name: string | null;
  description: string | null;
  shippingMethod: ShippingMethod | null;
  customFields: CustomFields;
};
