import { ShippingMethod } from "../shipping/ShippingMethod";
import { Entity } from "../../common/Entity";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type DeliveryTime = {
  name: string | null;
  min: number;
  max: number;
  unit: string;
  shippingMethods: ShippingMethod[] | null;
  translations: Entity[];
  customFields: CustomFields;
};
