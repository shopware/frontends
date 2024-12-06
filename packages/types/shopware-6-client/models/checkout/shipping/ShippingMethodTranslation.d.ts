import type { CustomFields } from "../../common/CustomField";
import type { ShippingMethod } from "./ShippingMethod";

/**
 * @public
 */
export type ShippingMethodTranslation = {
  shippingMethodId?: string | null;
  name: string | null;
  description: string | null;
  shippingMethod?: ShippingMethod | null;
  customFields: CustomFields;
  trackingUrl: string | null;
};
