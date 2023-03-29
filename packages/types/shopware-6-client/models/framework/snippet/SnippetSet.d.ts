import { CustomFields } from "../../common/CustomField";
import { SalesChannelDomain } from "../../system/sales-channel/SalesChannelDomain";
import { Snippet } from "./Snippet";

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
