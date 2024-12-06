import type { CustomFields } from "../../common/CustomField";
import type { Rule } from "./Rule";

/**
 * @public
 */
export type RuleCondition = {
  type: string;
  ruleId: string;
  parentId: string | null;
  value: [] | null;
  rule: Rule | null;
  children: RuleCondition | null;
  parent: RuleCondition | null;
  position: number;
  customFields: CustomFields;
};
