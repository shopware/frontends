import type { Schemas } from "#shopware";
import { Order } from "../../checkout/order/Order";
import { OrderDelivery } from "../../checkout/order/OrderDelivery";
import { OrderTransaction } from "../../checkout/order/OrderTransaction";
import { CustomFields } from "../../common/CustomField";
import { StateMachine } from "./StateMachine";
import { StateMachineHistory } from "./StateMachineHistory";
import { StateMachineStateTranslation } from "./StateMachineStateTranslation";
import { StateMachineTransition } from "./StateMachineTransition";

/**
 * @deprecated - use Schema["StateMachineState"] instead from import "#shopware"
 */
export type StateMachineState = Schemas["StateMachineState"];
// export type StateMachineState = {
//   name: string;
//   technicalName: string;
//   stateMachine: StateMachine | null;
//   fromStateMachineTransitions: StateMachineTransition[] | null;
//   toStateMachineTransitions: StateMachineTransition[] | null;
//   translations: StateMachineStateTranslation[];
//   orders: Order[] | null;
//   orderTransactions: OrderTransaction[] | null;
//   orderDeliveries: OrderDelivery[] | null;
//   fromStateMachineHistoryEntries: StateMachineHistory[] | null;
//   toStateMachineHistoryEntries: StateMachineHistory[] | null;
//   customFields: CustomFields;
// };
