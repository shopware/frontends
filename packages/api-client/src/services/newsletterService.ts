import { getStoreNewsletterConfirmEndpoint } from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";

type NewsletterConfirmationParams = {
  em: string;
  hash: string;
};

/**
 * Confirmation from newsletter
 *
 * @param {NewsletterConfirmationParams} params
 * @param {ShopwareApiInstance} contextInstance
 * @returns
 */
export async function newsletterConfirmation(
  params: NewsletterConfirmationParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  const response = await contextInstance.invoke.post(
    getStoreNewsletterConfirmEndpoint(),
    params,
  );
  return response.data;
}
