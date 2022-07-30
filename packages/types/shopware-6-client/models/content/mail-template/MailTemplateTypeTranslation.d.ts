import { MailTemplateType } from "./MailTemplateType";

/**
 * @public
 */
export type MailTemplateTypeTranslation = {
  mailTemplateTypeId: string;
  mailTemplateType: MailTemplateType | null;
  name: string | null;
};
