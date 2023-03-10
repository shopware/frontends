import { Product } from "../product/Product";
import {CustomFields} from "../../common/CustomField";

export type CustomerWishlist = {
  customerId: string;
  _uniqueIdentifier: string;
  versionId: null | string;
  translated: string[];
  createdAt: string;
  updatedAt: null | string;
  extensions: unknown;
  id: string;
  customFields: CustomFields;
  apiAlias: string;
};

export type CustomerWishlistResponse = {
  apiAlias: string;
  wishlist: CustomerWishlist;
  products: CustomerWishlistResponseProducts;
};

export type CustomerWishlistResponseProducts = {
  elements: [Product];
  page: number;
  total: number;
  limit: number;
};
