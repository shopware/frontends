import type { CustomFields } from "../../common/CustomField";

export type OrderState = {
  name: string;
  technicalName: string;
  _uniqueIdentifier: string;
  versionId: string | null;
  translated: unknown;
  createdAt: Date;
  updatedAt: Date | string | null;
  extensions: unknown;
  customFields: CustomFields;
  apiAlias: string;
};
