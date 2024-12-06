import type { CustomFields } from "../../common/CustomField";
import type { SnippetSet } from "./SnippetSet";

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
