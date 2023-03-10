import { CustomFields } from "../../common/CustomField";

export type MediaThumbnail = {
  width: number;
  height: number;
  url: string;
  mediaId: string;
  _uniqueIdentifier: string;
  versionId: null | string;
  translated: unknown;
  createdAt: string;
  updatedAt: null | string;
  extensions: unknown;
  id: string;
  customFields: CustomFields;
  apiAlias: "media_thumbnail";
};
