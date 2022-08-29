import { AxiosResponse } from "axios";
import { defaultInstance, ShopwareApiInstance } from "../apiService";

/**
 * Invoke custom POST request to shopware API. Mostly for plugins usage.
 * You can skip domain and pass only endpoint ex. `/api/my/endpoint`
 * @throws ClientApiError
 * @public
 */
export function invokePost<T>(
  {
    address,
    payload,
  }: {
    address: string;
    payload?: unknown;
  },
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<AxiosResponse<T>> {
  return contextInstance.invoke.post(address, payload);
}

/**
 * Invoke custom GET request to shopware API. Mostly for plugins usage.
 * You can skip domain and pass only endpoint ex. `/api/my/endpoint`
 * @throws ClientApiError
 * @public
 */
export function invokeGet<T>(
  { address }: { address: string },
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<AxiosResponse<T>> {
  return contextInstance.invoke.get(address);
}
