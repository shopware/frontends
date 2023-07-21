import { Media } from "../../content/media/Media";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type Downloads = {
  versionId: string;
  translated: { [key: string]: string };
  createdAt: Date;
  updatedAt: Date;
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
