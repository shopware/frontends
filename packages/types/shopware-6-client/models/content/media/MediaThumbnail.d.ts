import type { CustomFields } from "../../common/CustomField";

export type MediaThumbnail = {
  width: number;
  height: number;
  url: string;
  mediaId: string;
  _uniqueIdentifier?: string;
  versionId?: null | string;
  translated: unknown;
  createdAt: string;
  updatedAt: Date | string | null;
  extensions?: unknown;
  id: string;
  customFields: CustomFields | null;
  apiAlias: "media_thumbnail";
};
