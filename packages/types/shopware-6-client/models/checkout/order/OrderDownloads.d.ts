import type { CustomFields } from "../../common/CustomField";
import type { Media } from "../../content/media/Media";

/**
 * @public
 */
export type Downloads = {
  versionId: string;
  translated: { [key: string]: string };
  createdAt: Date;
  updatedAt: Date | string | null;
  orderLineItemId: string;
  orderLineItemVersionId: string;
  mediaId: string;
  position: number;
  media: Media;
  accessGranted: boolean;
  id: string;
  customFields: CustomFields | null;
  apiAlias: string;
};
