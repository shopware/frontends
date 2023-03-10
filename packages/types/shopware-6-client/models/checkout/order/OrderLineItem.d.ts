import { CalculatedPrice } from "../cart/price/CalculatedPrice";
import { PriceDefinitionInterface } from "../cart/price/PriceDefinitionInterface";
import { Order } from "./Order";
import { OrderDeliveryPosition } from "./OrderDeliveryPosition";
import { Media } from "../../content/media/Media";
import { CustomFields } from "../../common/CustomField";
import { Product } from "../../content/product/Product";
import { Promotion } from "../promotion/Promotion";
import { OrderDownloads } from "./OrderDownloads";
/**
 * @public
 */
export type OrderLineItem = {
  orderId: string;
  identifier: string;
  referenceId: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  label: string;
  description: string | null;
  good: boolean;
  removable: boolean;
  coverId: string | null;
  stackable: boolean;
  price: CalculatedPrice | null;
  priceDefinition: PriceDefinitionInterface | null;
  payload: Product | Promotion;
  parentId: string | null;
  type: string | null;
  order: Order | null;
  orderDeliveryPosition: OrderDeliveryPosition[] | null;
  customFields: CustomFields;
  cover: (Media & { url: string }) | null;
  children: OrderLineItem[] | null;
  apiAlias: "order_item";
  downloads: OrderDownloads | null;
};
