import type { MailTemplateMedia } from "./MailTemplateMedia";
import type { MailTemplateSalesChannel } from "./MailTemplateSalesChannel";
import type { MailTemplateTranslation } from "./MailTemplateTranslation";
import type { MailTemplateType } from "./MailTemplateType";

/**
 * @public
 */
export type MailTemplate = {
  mailTemplateTypeId: string | null;
  mailTemplateType: MailTemplateType | null;
  systemDefault: boolean;
  senderName: string | null;
  description: string | null;
  subject: string | null;
  contentHtml: string | null;
  contentPlain: string | null;
  salesChannels: MailTemplateSalesChannel[] | null;
  translations: MailTemplateTranslation[] | null;
  media: MailTemplateMedia[] | null;
};
