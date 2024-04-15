import { FetchResponse, ofetch } from "ofetch";
import type { operations } from "../../api-gen/apiTypes";
import { ClientHeaders, createHeaders } from "./defaultHeaders";
import { errorInterceptor } from "./errorInterceptor";
import { createHooks } from "hookable";

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
    pathParam: OPERATION_NAME,
    ...params: SimpleUnionOmit<
      CURRENT_OPERATION,
      "response" | "responseCode"
    > extends {
      body: unknown;
    }
      ? [SimpleUnionOmit<CURRENT_OPERATION, "response" | "responseCode">]
      : [SimpleUnionOmit<CURRENT_OPERATION, "response" | "responseCode">?]
  ) {
    const [name, method, requestPath] = pathParam.split(" ") as [
      string,
      string,
      string,
    ];

    const resp = await apiFetch.raw<
      SimpleUnionPick<CURRENT_OPERATION, "response">
    >(requestPath, {
      method,
      body: params[0]?.body,
      headers: defaultHeaders as any,
    });

    type ReturnType = SimpleUnionPick<
      CURRENT_OPERATION,
      "response" | "responseCode"
    >;

    return {
      data: resp._data,
      status: resp.status,
    } as RenameByT<{ response: "data"; responseCode: "status" }, ReturnType>;
  }

  return {
    invoke,
    /**
     * Default headers used in every client request (if not overriden in specific request).
     */
    defaultHeaders,
    hook: apiClientHooks.hook,
  };
}
