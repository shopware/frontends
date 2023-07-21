import { ShippingMethod } from "../shipping/ShippingMethod";
import { Entity } from "../../common/Entity";
import { CustomFields } from "../../common/CustomField";

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
