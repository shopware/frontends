import type { SalesChannel } from "../../system/sales-channel/SalesChannel";
import type { Product } from "./Product";

/**
 * @public
 */
export type ProductVisibility = {
  visibility: number;
  productId: string;
  salesChannelId: string;
  product: Product | null;
  salesChannel: SalesChannel | null;
};
