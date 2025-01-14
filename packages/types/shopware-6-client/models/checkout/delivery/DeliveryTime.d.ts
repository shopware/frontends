import type { CustomFields } from "../../common/CustomField";
import type { Entity } from "../../common/Entity";
import type { ShippingMethod } from "../shipping/ShippingMethod";

/**
 * @public
 */
export type DeliveryTime = {
  id: string;
  name: string | null;
  min: number;
  max: number;
  unit: string;
  shippingMethods?: ShippingMethod[] | null;
  translations?: Entity[];
  translated: TranslatedDeliveryTime;
  customFields: CustomFields | null;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  apiAlias: string;
};

/**
 * @public
 */
export type TranslatedDeliveryTime = {
  customFields: CustomFields;
  name: string;
};
