import type { CustomFields } from "../../common/CustomField";
import type { StateMachineState } from "./StateMachineState";

/**
 * @public
 */
export type StateMachineStateTranslation = {
  name: string | null;
  stateMachineStateId: string;
  stateMachineState: StateMachineState | null;
  customFields: CustomFields;
};
