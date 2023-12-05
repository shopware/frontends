import type { RequestParameters } from "#shopware";

/**
 * @deprecated use `RequestParameters<"subscribeToNewsletter">` from "#shopware" import instead
 */
export type NewsletterInput = RequestParameters<"subscribeToNewsletter">;
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
