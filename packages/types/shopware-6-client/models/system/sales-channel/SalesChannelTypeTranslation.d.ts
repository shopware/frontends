import { SalesChannelType } from "./SalesChannelType";
import { CustomFields } from "../../common/CustomField";

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
