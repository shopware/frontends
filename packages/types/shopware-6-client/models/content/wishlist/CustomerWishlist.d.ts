import type { CustomFields } from "../../common/CustomField";
import type { Product } from "../product/Product";

export type CustomerWishlist = {
  customerId: string;
  _uniqueIdentifier: string;
  versionId: null | string;
  translated: string[];
  createdAt: string;
  updatedAt: Date | string | null;
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
