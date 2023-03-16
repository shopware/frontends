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
  salutationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  comment: string;
  navigationId?: string;
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
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<void> {
  await contextInstance.invoke.post(getContactFormEndpoint(), params);
}

/**
 * @category Forms
 * @public
 */
export interface NewsletterSubscribeData {
  email: string;
  salutationId?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  option: "direct" | "subscribe" | "confirmSubscribe" | "unsubscribe";
  storefrontUrl: string;
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
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<void> {
  await contextInstance.invoke.post(
    getStoreNewsletterSubscribeEndpoint(),
    Object.assign({}, { option: "subscribe" }, params)
  );
}

/**
 * Unsuscribes from newsletter
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
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<void> {
  await contextInstance.invoke.post(
    getStoreNewsletterUnsubscribeEndpoint(),
    params
  );
}
