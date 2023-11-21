import type { Schemas } from "#shopware";

/**
 * @deprecated use {@link Schemas['LineItem']['type']} from "#shopware" import instead
 */
export type LineItemType = Schemas["LineItem"]["type"];

/**
 * @deprecated use {@link Schemas['LineItem']} from "#shopware" import instead
 */
export type LineItem = Schemas["LineItem"];
// export type LineItem = {
//   id: string;
//   referencedId: string | null;
//   label: string | null;
//   quantity: number;
//   type: LineItemType;
//   payload: Product | Promotion;
//   priceDefinition: PriceDefinitionInterface | null;
//   price: CalculatedPrice | null;
//   good: boolean;
//   description: string | null;
//   cover?: Media & { url: string };
//   deliveryInformation: DeliveryInformation | null;
//   children: LineItem[];
//   requirement: Rule | null;
//   removable: boolean;
//   stackable: boolean;
//   quantityInformation: QuantityInformation | null;
//   modified: boolean;
//   apiAlias: "line_item";
//   states: string[];
// };
