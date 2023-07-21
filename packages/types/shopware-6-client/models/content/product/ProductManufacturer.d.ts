import { Product } from "./Product";
import { ProductManufacturerTranslation } from "./ProductManufacturerTranslation";
import { CustomFields } from "../../common/CustomField";
import { Media } from "../../content/media/Media";
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
