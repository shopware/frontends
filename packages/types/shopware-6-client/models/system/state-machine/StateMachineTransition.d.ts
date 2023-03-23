import { StateMachineState } from "./StateMachineState";
import { CustomFields } from "../../common/CustomField";

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
