import { StateMachineState } from "./StateMachineState";
import { StateMachine } from "./StateMachine";
import { Customer } from "../../checkout/customer/Customer";

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
