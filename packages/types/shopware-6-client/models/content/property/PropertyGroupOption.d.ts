import type { CustomFields } from "../../common/CustomField";
import type { Media } from "../media/Media";
import type { Product } from "../product/Product";
import type { ProductConfiguratorSetting } from "../product/ProductConfiguratorSetting";
import type { PropertyGroup } from "./PropertyGroup";
import type { PropertyGroupOptionTranslation } from "./PropertyGroupOptionTranslation";

/**
 * @public
 */
export type PropertyGroupOption = {
  id: string;
  groupId: string;
  name: string | null;
  position: number;
  colorHexCode: string | null;
  mediaId: string | null;
  group: PropertyGroup;
  translations: PropertyGroupOptionTranslation[] | null;
  productConfiguratorSettings: ProductConfiguratorSetting[] | null;
  productProperties: Product[] | null;
  productOptions: Product[] | null;
  media: Media | null;
  customFields: CustomFields;
  translated: {
    [key: string]: string;
  };
  apiAlias: "property_group_option";
};
