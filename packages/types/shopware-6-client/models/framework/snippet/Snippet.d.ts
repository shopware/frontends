import { SnippetSet } from "./SnippetSet";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type Snippet = {
  setId: string;
  translationKey: string;
  value: string;
  author: string;
  set: SnippetSet | null;
  customFields: CustomFields | null;
};
