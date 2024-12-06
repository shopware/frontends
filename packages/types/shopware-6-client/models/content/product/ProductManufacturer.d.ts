import type { CustomFields } from "../../common/CustomField";
import type { Media } from "../../content/media/Media";
import type { Product } from "./Product";
import type { ProductManufacturerTranslation } from "./ProductManufacturerTranslation";
/**
 * @public
 */
export type ProductManufacturer = {
  createdAt: Date;
  customFields: CustomFields;
  description: string | null;
  id: string;
  link: string | null;
  media: Media;
  mediaId: string | null;
  name: string | null;
  products: Product[];
  translations: ProductManufacturerTranslation | null;
  translated: ProductManufacturerTranslation | null;
  updatedAt: Date;
  versionId: string;
};
