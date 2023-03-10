import { Media } from "../media/Media";
import { PropertyGroup } from "./PropertyGroup";
import { PropertyGroupOptionTranslation } from "./PropertyGroupOptionTranslation";
import { ProductConfiguratorSetting } from "../product/ProductConfiguratorSetting";
import { Product } from "../product/Product";
import { CustomFields} from "../../common/CustomField";

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
    [key: string]: unknown;
  };
  apiAlias: "property_group_option";
};
