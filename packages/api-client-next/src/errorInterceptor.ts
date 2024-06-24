import type { FetchResponse } from "ofetch";
import type { ApiError } from "./ApiError";
import { ApiClientError } from "./ApiError";

export function errorInterceptor<T extends { errors: Array<ApiError> }>(
  response: FetchResponse<T>,
) {
  throw new ApiClientError(response);
}
