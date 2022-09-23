import { Tag } from "../../system/tag/Tag";
import { CustomField } from "../../common/CustomField";

/**
 * @public
 */
export type NewsletterInput = {
  email: string;
  option: "subscribe" | "unsubscribe";
  storefrontUrl?: string;
  salutationId?: string;
  firstName?: string;
  lastName?: string;
  zipCode?: string;
  city?: string;
  street?: string;
  tags?: Tag[];
  languageId?: string;
  customFields?: CustomField[];
};
