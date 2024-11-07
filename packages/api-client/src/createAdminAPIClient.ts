import { ofetch } from "ofetch";
import type { FetchOptions, FetchResponse } from "ofetch";
import type { operations } from "../api-types/adminApiTypes";
import { ClientHeaders, createHeaders } from "./defaultHeaders";
import { errorInterceptor } from "./errorInterceptor";
import { createHooks } from "hookable";
import defu from "defu";
import { createPathWithParams } from "./transformPathToQuery";
import type { InvokeParameters } from "./createAPIClient";

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

/**
 * Session data entity for admin API client.
 */
export type AdminSessionData = {
  accessToken: string;
  refreshToken?: string;
  expirationTime: number;
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

function createAuthorizationHeader(token: string) {
  if (!token) return "";
  if (token.startsWith("Bearer ")) return token;
  return `Bearer ${token}`;
}

export type AdminApiClientHooks = {
  onAuthChange: (authData: AdminSessionData) => void;
  onResponseError: (response: FetchResponse<ResponseType>) => void;
  onSuccessResponse: (response: FetchResponse<ResponseType>) => void;
  onDefaultHeaderChanged: <T>(headerName: string, value?: T) => void;
};

export function createAdminAPIClient<
  OPERATIONS extends Record<string, any> = operations,
  PATHS extends string | number | symbol = keyof OPERATIONS,
>(params: {
  baseURL?: string;
  /**
   * If you pass `credentials` object, it will be used to authenticate the client whenever session expires.
   * You don't need to manually invoke `/token` endpoint first.
   */
  credentials?: OPERATIONS["token"]["body"];
  sessionData?: AdminSessionData;
  defaultHeaders?: ClientHeaders;
}) {
  const isTokenBasedAuth =
    params.credentials?.grant_type === "client_credentials";

  // Create a hookable instance
  const apiClientHooks = createHooks<AdminApiClientHooks>();

  const sessionData: AdminSessionData = {
    accessToken: params.sessionData?.accessToken || "",
    refreshToken: params.sessionData?.refreshToken || "",
    expirationTime: Number(params.sessionData?.expirationTime || 0),
  };

  const defaultHeaders = createHeaders(
    {
      Authorization: createAuthorizationHeader(sessionData.accessToken),
      Accept: "application/json",
    },
    (key, value) => {
      apiClientHooks.callHook("onDefaultHeaderChanged", key, value);
    },
  );

  function getSessionData() {
    return { ...sessionData };
  }

  function setSessionData(data: AdminSessionData): AdminSessionData {
    sessionData.accessToken = data.accessToken;
    sessionData.refreshToken = data.refreshToken || "";
    sessionData.expirationTime = data.expirationTime;

    return getSessionData();
  }

  function updateSessionData(responseData: {
    access_token?: string;
    refresh_token: string;
    expires_in: number;
  }) {
    if (responseData?.access_token) {
      defaultHeaders.Authorization = createAuthorizationHeader(
        responseData.access_token,
      );

      const dataCopy = setSessionData({
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token,
        expirationTime: Date.now() + responseData.expires_in * 1000,
      });
      apiClientHooks.callHook("onAuthChange", dataCopy);
    }
  }

  const apiFetch = ofetch.create({
    baseURL: params.baseURL,
    async onRequest({ request, options }) {
      const isExpired = sessionData.expirationTime <= Date.now();
      if (isExpired && !request.toString().includes("/oauth/token")) {
        if (
          !params.credentials &&
          !isTokenBasedAuth &&
          !sessionData.refreshToken
        ) {
          console.warn(
            "[ApiClientWarning] No `credentials` or `sessionData` provided. Provide at least one of them to ensure authentication.",
          );
        }

        const body =
          params.credentials && !sessionData.refreshToken
            ? params.credentials
            : {
                grant_type: "refresh_token",
                client_id: "administration",
                refresh_token: sessionData.refreshToken,
              };

        // Access session expired, first we need to refresh it with refresh token
        await ofetch("/oauth/token", {
          baseURL: params.baseURL,
          method: "POST",
          body,
          headers: defaultHeaders as HeadersInit,
          onResponseError({ response }) {
            // if resfesh is expired we get 401 and we're throwing it without invoking the original request
            errorInterceptor(response);
          },
          onResponse(context) {
            if (!context.response._data) return;

            updateSessionData(context.response._data);
            // pass enhanced (Authorization) headers to the next request
            options.headers.append(
              "Authorization",
              createAuthorizationHeader(sessionData.accessToken),
            );
          },
        });
      }
    },
    async onResponse(context) {
      apiClientHooks.callHook("onSuccessResponse", context.response);
      updateSessionData(context.response._data);
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

    const requestPathWithParams = createPathWithParams(
      requestPath,
      params[0]?.pathParams,
    );

    const fetchOptions: FetchOptions<"json"> = {
      ...(params[0]?.fetchOptions || {}),
    };

    const resp = await apiFetch.raw<
      SimpleUnionPick<CURRENT_OPERATION, "response">
    >(requestPathWithParams, {
      ...fetchOptions,
      method,
      body: params[0]?.body,
      headers: defu(params[0]?.headers, defaultHeaders) as HeadersInit,
      query: params[0]?.query,
    });

    return {
      data: resp._data,
      status: resp.status,
    } as RequestReturnType<CURRENT_OPERATION>;
  }

  return {
    invoke,
    /**
     * Enables to change session data in runtime. Useful for testing purposes.
     * Setting session data with this method will **not** fire `onAuthChange` hook.
     */
    setSessionData,
    /**
     * Returns current session data. Useful for testing purposes, as in most cases you'll want to use `onAuthChange` hook for that.
     */
    getSessionData,
    /**
     * Default headers used in every client request (if not overriden in specific request).
     */
    defaultHeaders,
    /**
     * Available hooks for the client.
     */
    hook: apiClientHooks.hook,
  };
}
