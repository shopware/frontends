import { AxiosResponse, AxiosError } from "axios";

/**
 * API error structure for incoming errors
 *
 * @public
 */
export type ShopwareError = {
  status: string;
  code: string;
  title: string;
  detail: string;
  source: unknown;
  meta: unknown;
};

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
 * @public
 */
export type ClientApiError = {
  messages: ShopwareError[];
  statusCode: number;
};
