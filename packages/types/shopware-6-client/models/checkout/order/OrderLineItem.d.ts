import type { CustomFields } from "../../common/CustomField";
import type { Media } from "../../content/media/Media";
import { type CartProductItem, Product } from "../../content/product/Product";
import { CalculatedPrice } from "../cart/price/CalculatedPrice";
import type { PriceDefinitionInterface } from "../cart/price/PriceDefinitionInterface";
import type { Promotion } from "../promotion/Promotion";
import type { Order } from "./Order";
import type { OrderDeliveryPosition } from "./OrderDeliveryPosition";
import type { Downloads } from "./OrderDownloads";
/**
 * @public
 */
export type OrderLineItem = {
  versionId: string;
  translated: string[];
  createdAt: string;
  updatedAt: null | string;
  orderId: string;
  identifier: string;
  referencedId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  label: string;
  description: null | string;
  good: string;
  removable: string;
  coverId: string;
  stackable: boolean;
  position: number;
  priceDefinition: PriceDefinitionInterface | null;
  payload: CartProductItem | Promotion;
  parentId: string | null;
  type: string | null;
  order: Order | null;
  orderDeliveryPosition: OrderDeliveryPosition[] | null;
  customFields: CustomFields;
  cover: (Media & { url: string }) | null;
  children: OrderLineItem[] | null;
  downloads: Downloads[] | null;
  states: string[];
  orderVersionId: string;
  productVersionId: string;
  parentVersionId: string;
  id: string;
  apiAlias: "order_line_item";
};
