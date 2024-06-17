import {
  getContactFormEndpoint,
  getStoreNewsletterSubscribeEndpoint,
  getStoreNewsletterUnsubscribeEndpoint,
} from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";

/**
 * @category Forms
 * @public
 */
export interface ContactFormData {
  cmsPageType?: string;
  /** The message of the contact form */
  comment: string;
  /** Email address */
  email: string;
  /** Entity name for slot config */
  entityName?: string;
  /** Firstname. This field may be required depending on the system settings. */
  firstName?: string;
  /** Lastname. This field may be required depending on the system settings. */
  lastName?: string;
  /**
   * Identifier of the navigation page. Can be used to override the configuration.
   * Take a look at the settings of a category containing a concact form in the administration.
   */
  navigationId?: string;
  /** Phone. This field may be required depending on the system settings. */
  phone?: string;
  /** Identifier of the salutation. Use `/api/salutation` endpoint to fetch possible values. */
  salutationId: string;
  /** Identifier of the cms element */
  slotId?: string;
  /** The subject of the contact form. */
  subject: string;
}

/**
 * Sends contact form
 *
 * @param {ContactFormData} params contact form data
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @category Forms
 * @public
 */
export async function sendContactForm(
  params: ContactFormData,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  await contextInstance.invoke.post(getContactFormEndpoint(), params);
}

/**
 * @category Forms
 * @public
 */
export interface NewsletterSubscribeData {
  /** City */
  city?: string;
  /** Custom field data that should be added to the subscription. */
  customFields?: string;
  /** Email address that will receive the confirmation and the newsletter. */
  email: string;
  /** First name */
  firstName?: string;
  /** Identifier of the language. */
  languageId?: string;
  /** Last name */
  lastName?: string;
  /** Defines what should be done. */
  option: string;
  /** Identifier of the salutation. */
  salutationId?: string;
  /** Url of the storefront of the shop. This will be used for generating the link to the /newsletter/confirm inside the confirm email. */
  storefrontUrl: string;
  /** Street */
  street?: string;
  /** Zip code */
  tags?: string;
  /** Zip code */
  zipCode?: string;
}
/**
 * Subscribes to newsletter
 *
 * @param {NewsletterSubscribeData} params newsletter subscribe data
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @category Forms
 * @public
 */
export async function newsletterSubscribe(
  params: NewsletterSubscribeData,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  await contextInstance.invoke.post(
    getStoreNewsletterSubscribeEndpoint(),
    Object.assign({}, { option: "subscribe" }, params),
  );
}

/**
 * Unsubscribe from newsletter
 *
 * @param {NewsletterSubscribeData} params newsletter subscribe data: email
 *
 * @category Forms
 * @public
 */
export async function newsletterUnsubscribe(
  params: {
    email: string;
  },
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  await contextInstance.invoke.post(
    getStoreNewsletterUnsubscribeEndpoint(),
    params,
  );
}
