import type { CustomFields } from "../../common/CustomField";
import type { StateMachineState } from "./StateMachineState";

/**
 * @public
 */
export type StateMachineTransition = {
  actionName: string;
  stateMachineId: string;
  stateMachine: StateMachineState | null;
  fromStateId: string;
  fromStateMachineState: StateMachineState | null;
  toStateId: string;
  toStateMachineState: StateMachineState | null;
  customFields: CustomFields;
};
