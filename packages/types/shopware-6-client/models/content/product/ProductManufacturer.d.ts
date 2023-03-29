import { Product } from "./Product";
import { ProductManufacturerTranslation } from "./ProductManufacturerTranslation";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type ProductManufacturer = {
  mediaId: string | null;
  name: string | null;
  link: string | null;
  description: string | null;
  translations: ProductManufacturerTranslation | null;
  products: Product[];
  customFields: CustomFields;
};
