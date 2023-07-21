import { ProductManufacturer } from "./ProductManufacturer";
import { CustomFields } from "../../common/CustomField";

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
