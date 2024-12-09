import type { CustomFields } from "../../common/CustomField";
import type { Media } from "../media/Media";
import type { PropertyGroupOption } from "../property/PropertyGroupOption";
import type { Product } from "./Product";

/**
 * @public
 */
export type ProductConfiguratorSetting = {
  productId: number;
  optionId: number;
  mediaId: number;
  position: number;
  price: [] | null;
  option: PropertyGroupOption | null;
  media: Media | null;
  selected: boolean;
  product: Product | null;
  customFields: CustomFields;
};
