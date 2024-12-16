import type { CustomFields } from "../../common/CustomField";
import type { SalesChannelType } from "./SalesChannelType";

/**
 * @public
 */
export type SalesChannelTypeTranslation = {
  salesChannelTypeId: string;
  name: string | null;
  manufacturer: string | null;
  description: string | null;
  descriptionLong: string | null;
  salesChannelType: SalesChannelType | null;
  customFields: CustomFields;
};
