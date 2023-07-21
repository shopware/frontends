import { CalculatedPrice } from "../price/CalculatedPrice";
import { Media } from "../../../content/media/Media";
import { Rule } from "../../../content/rule/Rule";
import { DeliveryInformation } from "../../delivery/DeliveryInformation";
import { PriceDefinitionInterface } from "../price/PriceDefinitionInterface";
import { QuantityInformation } from "./QuantityInformation";
import { Product } from "../../../content/product/Product";
import { Promotion } from "../../promotion/Promotion";

/**
 * @beta
 */
export type LineItemType = "product" | "promotion" | "custom" | "credit";

/**
 * @beta
 */
export type LineItem = {
  id: string;
  referencedId: string | null;
  label: string | null;
  quantity: number;
  type: LineItemType;
  payload: Product | Promotion;
  priceDefinition: PriceDefinitionInterface | null;
  price: CalculatedPrice | null;
  good: boolean;
  description: string | null;
  cover: (Media & { url: string }) | null;
  deliveryInformation: DeliveryInformation | null;
  children: LineItem[];
  requirement: Rule | null;
  removable: boolean;
  stackable: boolean;
  quantityInformation: QuantityInformation | null;
  modified: boolean;
  apiAlias: "line_item";
};
