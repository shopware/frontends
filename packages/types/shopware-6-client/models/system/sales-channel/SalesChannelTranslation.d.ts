import { SalesChannel } from "./SalesChannel";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type SalesChannelTranslation = {
  salesChannelId: string;
  name: string | null;
  salesChannel: SalesChannel | null;
  customFields: CustomFields;
};
