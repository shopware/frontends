import { defaultInstance, ShopwareApiInstance } from "../apiService";
import { getOrderDownloadsEndpoint } from "../endpoints";

type GetUserCountryParams = {
  orderId: string;
  downloadId: string;
};

/**
 * Get order downloads (file)
 *
 * @param {GetUserCountryParams} data orderId and downloadId
 * @param {ShopwareApiInstance} contextInstance  instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @public
 */
export async function getOrderDownloads(
  data: GetUserCountryParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Blob> {
  const resp = await contextInstance.invoke.get(
    getOrderDownloadsEndpoint(data.orderId, data.downloadId),
    {
      responseType: "blob",
    },
  );
  return resp.data;
}
