import { Language } from "../../framework/language/Language";
import { SalesChannel } from "../../system/sales-channel/SalesChannel";
import { Tag } from "../../system/tag/Tag";
import { Salutation } from "../../system/salutation/Salutation";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type NewsletterRecipient = {
  email: string;
  title: string | null;
  firstName: string | null;
  lastName: string | null;
  zipCode: string | null;
  city: string | null;
  street: string | null;
  status: string | null;
  hash: string;
  salutationId: string | null;
  salutation: Salutation | null;
  languageId: string;
  language: Language | null;
  salesChannelId: string;
  salesChannel: SalesChannel | null;
  customFields: CustomFields;
  confirmedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  tags: Tag[] | null;
};
