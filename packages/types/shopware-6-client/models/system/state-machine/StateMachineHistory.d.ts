import type { Customer } from "../../checkout/customer/Customer";
import type { StateMachine } from "./StateMachine";
import type { StateMachineState } from "./StateMachineState";

/**
 * @public
 */
export type StateMachineHistory = {
  stateMachineId: string;
  stateMachine: StateMachine | null;
  entityName: string;
  entityId: [];
  fromStateId: string;
  fromStateMachineState: StateMachineState | null;
  toStateId: string;
  toStateMachineState: StateMachineState | null;
  userId: string;
  user: Customer | null;
};
