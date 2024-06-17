import type { operations } from "#shopware";

/**
 * @deprecated use `operations["subscribeToNewsletter post /newsletter/subscribe"]["body"]` from "#shopware" import instead
 */
export type NewsletterInput =
  operations["subscribeToNewsletter post /newsletter/subscribe"]["body"];
// export type NewsletterInput = {
//   email: string;
//   option: "subscribe" | "unsubscribe";
//   storefrontUrl?: string;
//   salutationId?: string;
//   firstName?: string;
//   lastName?: string;
//   zipCode?: string;
//   city?: string;
//   street?: string;
//   tags?: Tag[];
//   languageId?: string;
//   customFields?: CustomFields;
// };
