import { SalesChannel } from "./SalesChannel";
import { SalesChannelTypeTranslation } from "./SalesChannelTypeTranslation";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type SalesChannelType = {
  name: string | null;
  manufacturer: string | null;
  description: string | null;
  descriptionLong: string | null;
  coverUrl: string | null;
  iconName: string | null;
  screenshotUrls: [] | null;
  salesChannels: SalesChannel[] | null;
  translations: SalesChannelTypeTranslation[] | null;
  customFields: CustomFields;
};
