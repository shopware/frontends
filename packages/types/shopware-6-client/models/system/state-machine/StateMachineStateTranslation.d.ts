import { StateMachineState } from "./StateMachineState";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type StateMachineStateTranslation = {
  name: string | null;
  stateMachineStateId: string;
  stateMachineState: StateMachineState | null;
  customFields: CustomFields;
};
