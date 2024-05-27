import { type FetchResponse, ofetch } from "ofetch";
import type { operations } from "../../api-gen/api-types/apiTypes";
import { ClientHeaders, createHeaders } from "./defaultHeaders";
import { errorInterceptor } from "./errorInterceptor";
import { type Hookable, createHooks } from "hookable";
import defu from "defu";
import { createPathWithParams, getPathParams } from "./transformPathToQuery";

type SimpleUnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

type SimpleUnionPick<T, K extends keyof T> = T extends unknown
  ? Pick<T, K>
  : never;

type RenameByT<T, U> = {
  [K in keyof U as K extends keyof T
    ? T[K] extends string
      ? T[K]
      : never
    : K]: K extends keyof U ? U[K] : never;
};

export type RequestReturnType<
  CURRENT_OPERATION extends {
    response: unknown;
    responseCode: number;
  },
> = RenameByT<
  { response: "data"; responseCode: "status" },
  SimpleUnionPick<CURRENT_OPERATION, "response" | "responseCode">
>;

export type RequestParameters<CURRENT_OPERATION> = SimpleUnionOmit<
  CURRENT_OPERATION,
  "response" | "responseCode"
>;

export type ApiClientHooks = Hookable<{
  onContextChanged: (newContextToken: string) => void;
  onResponseError: (response: FetchResponse<ResponseType>) => void;
  onSuccessResponse: (response: FetchResponse<ResponseType>) => void;
}>;

export function createAPIClient<
  OPERATIONS extends Record<string, any> = operations,
  PATHS extends string | number | symbol = keyof OPERATIONS,
>(params: {
  baseURL?: string;
  /**
   * @deprecated this method is only for store-api, for admin API use `createAdminAPIClient`. Remove this param
   */
  apiType?: "store-api" | "admin-api";
  accessToken?: string;
  contextToken?: string;
  /**
   *
   * @deprecated use `apiClient.hook("contextChanged". handler)` instead
   */
  onContextChanged?: (newContextToken: string) => void;
  defaultHeaders?: ClientHeaders;
}) {
  const defaultHeaders = createHeaders({
    "sw-access-key": params.accessToken,
    Accept: "application/json",
    "sw-context-token": params.contextToken,
    ...params.defaultHeaders,
  });

  // Create a hookable instance
  const apiClientHooks = createHooks<{
    onContextChanged: (newContextToken: string) => void;
    onResponseError: (response: FetchResponse<ResponseType>) => void;
    onSuccessResponse: (response: FetchResponse<ResponseType>) => void;
  }>();

  const apiFetch = ofetch.create({
    baseURL: params.baseURL,
    // async onRequest({ request, options }) {},
    // async onRequestError({ request, options, error }) {},
    async onResponse(context) {
      apiClientHooks.callHook("onSuccessResponse", context.response);
      if (
        context.response.headers.has("sw-context-token") &&
        defaultHeaders["sw-context-token"] !==
          context.response.headers.get("sw-context-token")
      ) {
        const newContextToken = context.response.headers.get(
          "sw-context-token",
        ) as string;
        defaultHeaders["sw-context-token"] = newContextToken;
        if (params.onContextChanged) {
          console.error(
            "DEPRECATED: onContextChanged is deprecated. Use apiClient.hook('contextChanged', handler) instead",
          );
          params.onContextChanged?.(newContextToken);
        }
        apiClientHooks.callHook("onContextChanged", newContextToken);
      }
    },
    async onResponseError({ request, response, options }) {
      apiClientHooks.callHook("onResponseError", response);
      errorInterceptor(response);
    },
  });
  /**
   * Invoke API request based on provided path definition.
   */
  async function invoke<
    INVOKE_PATH extends PATHS,
    OPERATION_NAME extends string = INVOKE_PATH extends `${infer R}`
      ? R extends string
        ? R
        : never
      : never,
    CURRENT_OPERATION extends
      OPERATIONS[OPERATION_NAME] = OPERATION_NAME extends keyof OPERATIONS
      ? OPERATIONS[OPERATION_NAME]
      : never,
  >(
    pathParam: OPERATION_NAME extends keyof OPERATIONS ? OPERATION_NAME : never,
    ...params: SimpleUnionOmit<
      CURRENT_OPERATION,
      "response" | "responseCode"
    > extends
      | {
          body: unknown;
        }
      | {
          query: unknown;
        }
      | {
          header: unknown;
        }
      | {
          pathParams: unknown;
        }
      ? [SimpleUnionOmit<CURRENT_OPERATION, "response" | "responseCode">]
      : [SimpleUnionOmit<CURRENT_OPERATION, "response" | "responseCode">?]
  ): Promise<RequestReturnType<CURRENT_OPERATION>> {
    const [name, method, requestPath] = pathParam.split(" ") as [
      string,
      string,
      string,
    ];

    const currentParams =
      params[0] || ({} as RequestParameters<CURRENT_OPERATION>);

    const requestPathWithParams = createPathWithParams(
      requestPath,
      currentParams.pathParams,
    );

    const resp = await apiFetch.raw<
      SimpleUnionPick<CURRENT_OPERATION, "response">
    >(requestPathWithParams, {
      method,
      body: currentParams.body,
      headers: defu(defaultHeaders, currentParams.header) as HeadersInit,
      query: currentParams.query,
    });

    return {
      data: resp._data,
      status: resp.status,
    } as RequestReturnType<CURRENT_OPERATION>;
  }

  return {
    invoke,
    /**
     * Default headers used in every client request (if not overriden in specific request).
     */
    defaultHeaders,
    hook: apiClientHooks.hook as ApiClientHooks["hook"],
  };
}
