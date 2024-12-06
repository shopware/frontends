import type { Schemas } from "#shopware";
import { CustomFields } from "../../common/CustomField";
import { StateMachineState } from "../../system/state-machine/StateMachineState";
import { CalculatedPrice } from "../cart/price/CalculatedPrice";
import { PaymentMethod } from "../payment/PaymentMethod";
import { Order } from "./Order";

/**
 * @public
 * @deprecated use Schemas['OrderTransaction'] from "#shopware" import instead
 */
export type OrderTransaction = Schemas["OrderTransaction"];
// export type OrderTransaction = {
//   orderId: string;
//   paymentMethodId: string;
//   amount: CalculatedPrice;
//   paymentMethod: PaymentMethod | null;
//   order: Order | null;
//   stateMachineState: StateMachineState | null;
//   stateId: string;
//   customFields: CustomFields;
// };
