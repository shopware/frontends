import type { CustomFields } from "../../common/CustomField";
import type { SalesChannel } from "./SalesChannel";
import type { SalesChannelTypeTranslation } from "./SalesChannelTypeTranslation";

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
