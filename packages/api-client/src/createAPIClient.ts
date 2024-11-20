import { type FetchResponse, ofetch, FetchOptions } from "ofetch";
import type { operations } from "../api-types/storeApiTypes";
import { ClientHeaders, createHeaders } from "./defaultHeaders";
import { errorInterceptor } from "./errorInterceptor";
import { createHooks } from "hookable";
import defu from "defu";
import { createPathWithParams } from "./transformPathToQuery";

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
export type InvokeParameters<CURRENT_OPERATION> =
  RequestParameters<CURRENT_OPERATION> & {
  fetchOptions?: Pick<
    FetchOptions<"json">,
    | "cache"
    | "duplex"
    | "keepalive"
    | "priority"
    | "redirect"
    | "retry"
    | "retryDelay"
    | "retryStatusCodes"
    | "signal"
    | "timeout"
  >;
};

export type ApiClientHooks = {
  onContextChanged: (newContextToken: string) => void;
  onResponseError: (response: FetchResponse<ResponseType>) => void;
  onSuccessResponse: <T>(response: FetchResponse<T>) => void;
  onDefaultHeaderChanged: <T>(headerName: string, value?: T) => void;
};

export function createAPIClient<
  OPERATIONS extends Record<string, any> = operations,
  PATHS extends string | number | symbol = keyof OPERATIONS,
>(params: {
  baseURL?: string;
  accessToken?: string;
  contextToken?: string;
  defaultHeaders?: ClientHeaders;
  timeout?: number;
}) {
  // Create a hookable instance
  const apiClientHooks = createHooks<ApiClientHooks>();

  const defaultHeaders = createHeaders(
    {
      "sw-access-key": params.accessToken,
      accept: "application/json",
      "sw-context-token": params.contextToken,
      ...params.defaultHeaders,
    },
    (key, value) => {
      apiClientHooks.callHook("onDefaultHeaderChanged", key, value);
      if (key === "sw-context-token") {
        apiClientHooks.callHook("onContextChanged", value!);
      }
    },
  );

  const apiFetch = ofetch.create({
    baseURL: params.baseURL,
    timeout: params.timeout,
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
      }
    },
    async onResponseError({ response }) {
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
      ? [InvokeParameters<CURRENT_OPERATION>]
      : [InvokeParameters<CURRENT_OPERATION>?]
  ): Promise<RequestReturnType<CURRENT_OPERATION>> {
    const [, method, requestPath] = pathParam.split(" ") as [
      string,
      string,
      string,
    ];

    const currentParams =
      params[0] || ({} as InvokeParameters<CURRENT_OPERATION>);

    const requestPathWithParams = createPathWithParams(
      requestPath,
      currentParams.pathParams,
    );

    const fetchOptions: FetchOptions<"json"> = {
      ...(currentParams.fetchOptions || {}),
    };

    let mergedHeaders = defu(currentParams.headers, defaultHeaders);

    if (
      mergedHeaders?.["Content-Type"]?.includes("multipart/form-data") &&
      typeof window !== "undefined"
    ) {
      // multipart/form-data must not be set manually when it's used by the browser
      delete mergedHeaders["Content-Type"];
    }

    const resp = await apiFetch.raw<
      SimpleUnionPick<CURRENT_OPERATION, "response">
    >(requestPathWithParams, {
      ...fetchOptions,
      method,
      body: currentParams.body,
      headers: mergedHeaders as HeadersInit,
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
    hook: apiClientHooks.hook,
  };
}
