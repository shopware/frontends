import { defu } from "defu";
import { useDefaultOrderAssociations, useShopwareContext } from "#imports";

import type { Schemas } from "#shopware";

export type UseOrderDataProviderReturn = {
  /**
   * Get order object including additional associations.
   * useDefaults describes what order object should look like.
   */
  loadOrderDetails(
    orderSearchData: { keyValue: string; field?: string },
    associations?: Schemas["Criteria"]["associations"],
  ): Promise<Schemas["Order"] | null>;

  /**
   * Get media content
   *
   * @param {string} downloadId
   * @returns {Blob}
   */
  getMediaFile: (orderId: string, downloadId: string) => Promise<Blob>;

  /**
   * Get order documents
   * @param {string} documentId
   * @param {string} deepLinkCode
   * @returns
   */
  getDocumentFile: (
    documentId: string,
    deepLinkCode: string,
  ) => Promise<Schemas["Document"]>;
};

export function useOrderDataProvider(): UseOrderDataProviderReturn {
  const { apiClient } = useShopwareContext();
  const orderAssociations = useDefaultOrderAssociations();

  async function loadOrderDetails(
    orderSearchData: { keyValue: string; field?: string },
    associations?: Schemas["Criteria"]["associations"],
  ) {
    const mergedAssociations = defu(
      orderAssociations,
      associations ? associations : {},
    );
    const params = {
      filter: [
        {
          type: "equals",
          field: orderSearchData.field ?? "id",
          value: orderSearchData.keyValue,
        },
      ],
      associations: mergedAssociations.associations,
      checkPromotion: true,
    } as Schemas["Criteria"];

    const orderDetailsResponse = await apiClient.invoke(
      "readOrder post /order",
      {
        body: params,
      },
    );
    return orderDetailsResponse.data.orders?.elements?.[0] ?? null;
  }

  async function getMediaFile(orderId: string, downloadId: string) {
    const response = await apiClient.invoke(
      "orderDownloadFile get /order/download/{orderId}/{downloadId}",
      {
        accept: "application/octet-stream",
        pathParams: {
          orderId,
          downloadId,
        },
      },
    );

    return response.data;
  }

  async function getDocumentFile(documentId: string, deepLinkCode: string) {
    const response = await apiClient.invoke(
      "download post /document/download/{documentId}/{deepLinkCode}",
      {
        pathParams: {
          documentId,
          deepLinkCode,
        },
      },
    );

    return response.data;
  }

  return { loadOrderDetails, getMediaFile, getDocumentFile };
}
