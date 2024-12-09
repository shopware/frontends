import type { CustomFields } from "../../common/CustomField";
import type { PaymentMethod } from "./PaymentMethod";

/**
 * @public
 */
export type PaymentMethodTranslation = {
  paymentMethodId: string;
  name: string | null;
  description: string | null;
  paymentMethod: PaymentMethod | null;
  customFields: CustomFields;
};
