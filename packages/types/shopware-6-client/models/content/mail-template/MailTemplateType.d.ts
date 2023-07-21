import { MailTemplateSalesChannel } from "./MailTemplateSalesChannel";
import { MailTemplateTypeTranslation } from "./MailTemplateTypeTranslation";
import { CustomFields } from "../../common/CustomField";

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
