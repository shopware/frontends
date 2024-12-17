import type { CustomFields } from "../../common/CustomField";
import type { MailTemplateSalesChannel } from "./MailTemplateSalesChannel";
import type { MailTemplateTypeTranslation } from "./MailTemplateTypeTranslation";

/**
 * @public
 */
export type MailTemplateType = {
  name: string;
  technicalName: string;
  availableEntities: [] | null;
  translations: MailTemplateTypeTranslation[] | null;
  mailTemplates: MailTemplateType[] | null;
  customFields: CustomFields;
  salesChannels: MailTemplateSalesChannel[] | null;
  createdAt: Date;
  updatedAt: Date | string | null;
};
