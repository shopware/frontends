import { ofetch } from "ofetch";
import type {
  operations as defaultOperations,
  paths as defaultPaths,
} from "../api-types";
import type {
  operations as defaultAdminOperations,
  paths as defaultAdminPaths,
} from "../admin-api-types";
import { errorInterceptor } from "./errorInterceptor";
import { transformPathToQuery } from "./transformPathToQuery";
import { defu } from "defu";
import { createHeaders } from "./defaultHeaders";
import type { ClientHeaders } from "./defaultHeaders";

type Operations = Record<string, unknown>;

// type Paths = {
//   [path: string]: {
//     [method: string]: unknown;
//   };
// };

// type PathDefinition<
//   OPERATION_NAME extends string,
//   METHOD_NAME extends HttpMethod,
//   PATH_NAME extends string
// > = `${OPERATION_NAME} ${METHOD_NAME} ${PATH_NAME}`;

type GetInferKey<T, NAME extends string> = T extends { [key in NAME]: infer R }
  ? R
  : never;

export type RequestParameters<
  OPERATION_NAME extends keyof OPERATIONS,
  OPERATIONS = defaultOperations,
> = (OPERATIONS[OPERATION_NAME] extends {
  parameters?: { query?: infer R };
}
  ? R
  : {}) &
  (OPERATIONS[OPERATION_NAME] extends {
    parameters?: { path?: infer R };
  }
    ? R
    : {}) &
  (OPERATIONS[OPERATION_NAME] extends {
    requestBody?: { content?: { "application/json"?: infer R } };
  }
    ? R
    : {}) &
  (OPERATIONS[OPERATION_NAME] extends {
    requestBody?: { content?: { "multipart/form-data"?: infer R } };
  }
    ? R
    : {}) &
  (OPERATIONS[OPERATION_NAME] extends {
    parameters?: { header?: infer R };
  }
    ? R
    : {});

export type RequestReturnType<
  T extends keyof OPERATIONS,
  OPERATIONS = defaultOperations,
> =
  | GetInferKey<
      GetInferKey<
        GetInferKey<GetInferKey<OPERATIONS[T], "responses">, "200">,
        "content"
      >,
      "application/json"
    >
  | GetInferKey<
      GetInferKey<
        GetInferKey<GetInferKey<OPERATIONS[T], "responses">, "200">,
        "content"
      >,
      "application/octet-stream"
    >;

export function createAPIClient<
  OPERATIONS extends Operations = defaultOperations,
  PATHS = defaultPaths,
>(params: {
  baseURL?: string;
  /**
   * @deprecated this method is only for store-api, for admin API use `createAdminAPIClient`. Remove this param
   */
  apiType?: "store-api" | "admin-api";
  accessToken?: string;
  contextToken?: string;
  onContextChanged?: (newContextToken: string) => void;
  defaultHeaders?: ClientHeaders;
}) {
  const defaultHeaders = createHeaders({
    "sw-access-key": params.accessToken,
    Accept: "application/json",
    "sw-context-token": params.contextToken,
    ...params.defaultHeaders,
  });

  const apiFetch = ofetch.create({
    baseURL: params.baseURL,
    // async onRequest({ request, options }) {},
    // async onRequestError({ request, options, error }) {},
    async onResponse(context) {
      if (
        context.response.headers.has("sw-context-token") &&
        defaultHeaders["sw-context-token"] !==
          context.response.headers.get("sw-context-token")
      ) {
        const newContextToken = context.response.headers.get(
          "sw-context-token",
        ) as string;
        defaultHeaders["sw-context-token"] = newContextToken;
        params.onContextChanged?.(newContextToken);
      }
    },
    async onResponseError({ request, response, options }) {
      errorInterceptor(response);
    },
  });

  /**
   * Invoke API request based on provided path definition.
   */
  async function invoke<
    INVOKE_PATH extends PATHS,
    OON = INVOKE_PATH extends `${infer R} ${string}` ? R : never,
    OPERATION_NAME extends keyof OPERATIONS = OON extends keyof OPERATIONS
      ? OON
      : never,
  >(
    pathParam: INVOKE_PATH extends string ? INVOKE_PATH : never,
    ...params: keyof RequestParameters<OPERATION_NAME, OPERATIONS> extends never
      ? [Record<PropertyKey, never>?]
      : [RequestParameters<OPERATION_NAME, OPERATIONS>]
  ): Promise<RequestReturnType<OPERATION_NAME, OPERATIONS>> {
    const [requestPath, options] = transformPathToQuery(
      pathParam,
      params?.[0] as Record<string, string>,
    );
    return apiFetch<RequestReturnType<OPERATION_NAME, OPERATIONS>>(
      requestPath,
      defu(options, { headers: defaultHeaders }),
    );
  }

  return {
    invoke,
    /**
     * Default headers used in every client request (if not overriden in specific request).
     */
    defaultHeaders,
  };
}

/**
 * Session data entity for admin API client.
 */
export type AdminSessionData = {
  accessToken: string;
  refreshToken?: string;
  expirationTime: number;
};

function createAuthorizationHeader(token: string) {
  if (!token) return "";
  if (token.startsWith("Bearer ")) return token;
  return `Bearer ${token}`;
}

export function createAdminAPIClient<
  OPERATIONS extends Operations = defaultAdminOperations,
  PATHS = defaultAdminPaths,
>(params: {
  baseURL: string;
  /**
   * If you pass `credentials` object, it will be used to authenticate the client whenever session expires.
   * You don't need to manually invoke `/token` endpoint first.
   */
  credentials?: RequestParameters<"token", defaultAdminOperations>;
  sessionData?: AdminSessionData;
  onAuthChange?: (params: AdminSessionData) => void;
  defaultHeaders?: ClientHeaders;
}) {
  const isTokenBasedAuth =
    params.credentials?.grant_type === "client_credentials";

  const sessionData: AdminSessionData = {
    accessToken: params.sessionData?.accessToken || "",
    refreshToken: params.sessionData?.refreshToken || "",
    expirationTime: Number(params.sessionData?.expirationTime || 0),
  };

  const defaultHeaders = createHeaders({
    Authorization: createAuthorizationHeader(sessionData.accessToken),
    Accept: "application/json",
  });

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
      params.onAuthChange?.(dataCopy);
    }
  }

  function setSessionData(data: AdminSessionData): AdminSessionData {
    sessionData.accessToken = data.accessToken;
    sessionData.refreshToken = data.refreshToken || "";
    sessionData.expirationTime = data.expirationTime;

    return getSessionData();
  }

  function getSessionData() {
    return { ...sessionData };
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
            options.headers = {
              ...options.headers,
              Authorization: createAuthorizationHeader(
                context.response._data.access_token,
              ),
            };
          },
        });
      }
    },
    async onResponse(context) {
      updateSessionData(context.response._data);
    },
    async onResponseError({ request, response, options }) {
      errorInterceptor(response);
    },
  });

  /**
   * Invoke API request based on provided path definition.
   */
  async function invoke<
    INVOKE_PATH extends PATHS,
    OON = INVOKE_PATH extends `${infer R} ${string}` ? R : never,
    OPERATION_NAME extends keyof OPERATIONS = OON extends keyof OPERATIONS
      ? OON
      : never,
  >(
    pathParam: INVOKE_PATH extends string ? INVOKE_PATH : never,
    params: RequestParameters<OPERATION_NAME, OPERATIONS>,
  ): Promise<RequestReturnType<OPERATION_NAME, OPERATIONS>> {
    const [requestPath, options] = transformPathToQuery(
      pathParam,
      params as Record<string, string>,
    );
    return apiFetch<RequestReturnType<OPERATION_NAME, OPERATIONS>>(
      requestPath,
      defu(options, { headers: defaultHeaders }),
    );
  }

  return {
    /**
     * Invoke API request based on provided path definition.
     */
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
  };
}

export { ApiClientError } from "./errorInterceptor";
export type { ApiError } from "./errorInterceptor";
