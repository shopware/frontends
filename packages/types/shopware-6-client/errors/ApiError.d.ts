import type { ApiError } from "@shopware/api-client";
import type { AxiosError, AxiosResponse } from "axios";
/**
 * API error structure for incoming errors
 *
 * @deprecated use ApiError type from "@shopware/api-client" instead
 */
export type ShopwareError = ApiError;
/**
 * API Error response from Shopware backend
 *
 * @public
 */
export type ShopwareApiError = AxiosError & {
  response: AxiosResponse<{
    errors: ShopwareError[];
  }>;
};

/**
 * API client error structure
 *
 * @deprecated use ApiClientError type from "@shopware/api-client" instead
 */
export type ClientApiError = {
  messages: ShopwareError[];
  statusCode: number;
};
