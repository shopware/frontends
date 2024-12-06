import type { CustomFields } from "../../common/CustomField";
import type { SalesChannel } from "./SalesChannel";

/**
 * @public
 */
export type SalesChannelTranslation = {
  salesChannelId: string;
  name: string | null;
  salesChannel: SalesChannel | null;
  customFields: CustomFields;
};
