import { Rule } from "./Rule";
import { CustomField } from "../../common/CustomField";

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
  customFields: CustomField[];
};
