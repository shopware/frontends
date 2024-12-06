import type { CustomFields } from "../../common/CustomField";
import type { StateMachineHistory } from "./StateMachineHistory";
import type { StateMachineState } from "./StateMachineState";
import type { StateMachineStateTranslation } from "./StateMachineStateTranslation";
import type { StateMachineTransition } from "./StateMachineTransition";

/**
 * @public
 */
export type StateMachine = {
  technicalName: string;
  name: string;
  transitions: StateMachineTransition[] | null;
  states: StateMachineState[] | null;
  initialStateId: string | null;
  translations: StateMachineStateTranslation[];
  historiEntries: StateMachineHistory[] | null;
  customFields: CustomFields;
};
