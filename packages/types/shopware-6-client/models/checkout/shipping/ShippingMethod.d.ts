import { SalesChannel } from "../../system/sales-channel/SalesChannel";
import { DeliveryTime } from "../delivery/DeliveryTime";
import { OrderDelivery } from "../order/OrderDelivery";
import { Rule } from "../../content/rule/Rule";
import { ShippingMethodPrice } from "./ShippingMethodPrice";
import { Media } from "../../content/media/Media";
import { Tag } from "../../system/tag/Tag";
import { ShippingMethodTranslation } from "./ShippingMethodTranslation";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type ShippingMethod = {
  id: string;
  name: string | null;
  active: boolean;
  description: string | null;
  deliveryTimeId: string;
  deliveryTime: DeliveryTime | null;
  translations: ShippingMethodTranslation[] | null;
  translated: ShippingMethodTranslation | null;
  orderDeliveries: OrderDelivery[] | null;
  salesChannelDefaultAssignments: SalesChannel[] | null;
  salesChannels: SalesChannel[] | null;
  customFields: CustomFields;
  availabilityRule: Rule | null;
  availabilityRuleId: string;
  prices: ShippingMethodPrice[];
  mediaId: string | null;
  media: Media | null;
  tags: Tag[] | null;
};
