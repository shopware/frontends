import type { CustomFields } from "../../common/CustomField";
import type { ProductManufacturer } from "./ProductManufacturer";

/**
 * @public
 */
export type ProductManufacturerTranslation = {
  productManufacturerId: number;
  name: string | null;
  description: string | null;
  productManufacturer: ProductManufacturer | null;
  customFields: CustomFields;
};
