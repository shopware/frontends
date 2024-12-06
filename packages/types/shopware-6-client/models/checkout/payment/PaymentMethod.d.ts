import type { Schemas } from "#shopware";
import { CustomFields } from "../../common/CustomField";
import { Media } from "../../content/media/Media";
import { Rule } from "../../content/rule/Rule";
import { Plugin } from "../../framework/plugin/Plugin";
import { SalesChannel } from "../../system/sales-channel/SalesChannel";
import { Customer } from "../customer/Customer";
import { OrderTransaction } from "../order/OrderTransaction";
import { PaymentMethodTranslation } from "./PaymentMethodTranslation";

/**
 * @deprecated use Schemas['PaymentMethod'] from "#shopware" import instead
 */
export type PaymentMethod = Schemas["PaymentMethod"];

//  {
//   id: string;
//   pluginId: string | null;
//   handlerIdentifier: string;
//   name: string | null;
//   description: string | null;
//   position: number;
//   active: boolean;
//   plugin: Plugin | null;
//   translations: PaymentMethodTranslation[] | null;
//   translated: PaymentMethodTranslation | null;
//   orderTransactions: OrderTransaction[] | null;
//   customers: Customer[] | null;
//   salesChannelDefaultAssignments: SalesChannel[] | null;
//   availabilityRule: Rule | null;
//   availabilityRuleId: string;
//   mediaId: string | null;
//   media: Media | null;
//   customFields: CustomFields;
//   formattedHandlerIDentifier: string;
//   createdAt: string;
//   updatedAt: Date | string | null;
//   distinguishableName: string;
//   afterOrderEnabled: boolean;
//   shortName: string;
//   synchronous: boolean;
//   asynchronous: boolean;
//   prepared: boolean;
//   refundable: boolean;
//   apiAlias: "payment_method";
// };
