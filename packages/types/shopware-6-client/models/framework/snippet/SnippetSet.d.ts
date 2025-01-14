import type { CustomFields } from "../../common/CustomField";
import type { SalesChannelDomain } from "../../system/sales-channel/SalesChannelDomain";
import type { Snippet } from "./Snippet";

/**
 * @public
 */
export type SnippetSet = {
  name: string;
  baseFile: string;
  iso: string;
  snippets: Snippet[] | null;
  salesChannelDomains: SalesChannelDomain[] | null;
  customFields: CustomFields | null;
};
