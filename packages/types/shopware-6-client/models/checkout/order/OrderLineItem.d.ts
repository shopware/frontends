import { CalculatedPrice } from "../cart/price/CalculatedPrice";
import { PriceDefinitionInterface } from "../cart/price/PriceDefinitionInterface";
import { Order } from "./Order";
import { OrderDeliveryPosition } from "./OrderDeliveryPosition";
import { Media } from "../../content/media/Media";
import { CustomFields } from "../../common/CustomField";
import { CartProductItem, Product } from "../../content/product/Product";
import { Promotion } from "../promotion/Promotion";
import { Downloads } from "./OrderDownloads";
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
