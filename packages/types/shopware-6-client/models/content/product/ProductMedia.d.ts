import { Media } from "../media/Media";
import { Product } from "./Product";
import { CustomField } from "../../common/CustomField";

/**
 * @public
 */
export type ProductMedia = {
  productId: string;
  mediaId: string;
  position: number;
  media: Media;
  customFields: null | CustomField[];
  _uniqueIdentifier: string;
  versionId: string;
  translated: [];
  createdAt: string;
  updatedAt: string;
  extensions: unknown;
  id: string;
  apiAlias: "product_media";
};
