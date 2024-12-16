import type { CustomFields } from "../../common/CustomField";
import type { Language } from "../../framework/language/Language";
import type { SalesChannel } from "../../system/sales-channel/SalesChannel";
import type { Salutation } from "../../system/salutation/Salutation";
import type { Tag } from "../../system/tag/Tag";

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
  updatedAt: Date | string | null;
  tags: Tag[] | null;
};
