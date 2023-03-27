import { Media } from "../media/Media";
import { PropertyGroupOption } from "../property/PropertyGroupOption";
import { Product } from "./Product";
import { CustomFields } from "../../common/CustomField";

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
