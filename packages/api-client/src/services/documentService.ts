import { getDocumentDownloadEndpoint } from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";

type DocumentDownloadParams = {
  documentId: string;
  deepLinkCode: string;
};

/**
 * Download selected document
 *
 * @param {DocumentDownloadParams} params documentId and deepLinkCode
 *
 * @throws ClientApiError
 * @public
 */
export async function getDocumentDownload(
  params: DocumentDownloadParams,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<Blob> {
  const resp = await contextInstance.invoke.get(
    getDocumentDownloadEndpoint(params.documentId, params.deepLinkCode),
    {
      responseType: "blob",
    }
  );
  return resp.data;
}
