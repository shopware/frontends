import { Media } from "../media/Media";
import { Product } from "./Product";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type ProductMedia = {
  productId: string;
  mediaId: string;
  position: number;
  media: Media;
  customFields: null | CustomFields;
  _uniqueIdentifier?: string;
  versionId: string;
  translated: [];
  createdAt: string;
  updatedAt: Date | string | null;
  extensions?: unknown;
  id: string;
  apiAlias: "product_media";
};
