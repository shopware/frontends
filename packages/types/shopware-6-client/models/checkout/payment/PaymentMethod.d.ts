import { Media } from "../../content/media/Media";
import { Plugin } from "../../framework/plugin/Plugin";
import { Customer } from "../customer/Customer";
import { SalesChannel } from "../../system/sales-channel/SalesChannel";
import { Rule } from "../../content/rule/Rule";
import { PaymentMethodTranslation } from "./PaymentMethodTranslation";
import { OrderTransaction } from "../order/OrderTransaction";
import { CustomField } from "../../common/CustomField";

/**
 * @beta
 */
export type PaymentMethod = {
  id: string;
  pluginId: string | null;
  handlerIdentifier: string;
  name: string | null;
  description: string | null;
  position: number;
  active: boolean;
  plugin: Plugin | null;
  translations: PaymentMethodTranslation[] | null;
  translated: PaymentMethodTranslation | null;
  orderTransactions: OrderTransaction[] | null;
  customers: Customer[] | null;
  salesChannelDefaultAssignments: SalesChannel[] | null;
  availabilityRule: Rule | null;
  availabilityRuleId: string;
  mediaId: string | null;
  media: Media | null;
  customFields: CustomField[];
  formattedHandlerIDentifier: string;
  createdAt: string;
  updatedAt: string | null;
  distinguishableName: string;
  afterOrderEnabled: boolean;
  shortName: string;
  synchronous: boolean;
  asynchronous: boolean;
  prepared: boolean;
  refundable: boolean;
  apiAlias: "payment_method";
};
