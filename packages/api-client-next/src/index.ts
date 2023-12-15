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
    requestBody?: { content?: { "application/octet-stream"?: infer R } };
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
> = GetInferKey<
  GetInferKey<
    GetInferKey<GetInferKey<OPERATIONS[T], "responses">, "200">,
    "content"
  >,
  "application/json"
>;

export function createAPIClient<
  OPERATIONS extends Operations = defaultOperations,
  PATHS = defaultPaths,
>(params: {
  baseURL: string;
  /**
   * @deprecated this method is only for store-api, for admin API use `createAdminAPIClient`. Remove this param
   */
  apiType?: "store-api" | "admin-api";
  accessToken: string;
  contextToken?: string;
  onContextChanged?: (newContextToken: string) => void;
}) {
  const defaultHeaders: Record<string, string> = {
    "sw-access-key": params.accessToken,
  };

  // protection from setting "null" or "undefined" as a token in API side
  if (params.contextToken) {
    defaultHeaders["sw-context-token"] = params.contextToken;
  }

  const apiFetch = ofetch.create({
    baseURL: params.baseURL,
    // async onRequest({ request, options }) {},
    // async onRequestError({ request, options, error }) {},
    async onResponse(context) {
      if (
        defaultHeaders["sw-context-token"] !==
        context.response.headers.get("sw-context-token")
      ) {
        const newContextToken =
          context.response.headers.get("sw-context-token") || "";
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
      Array.isArray(params) ? (params?.[0] as Record<string, string>) : params,
    );
    console.log("invoke with", requestPath, options);
    return apiFetch<RequestReturnType<OPERATION_NAME, OPERATIONS>>(
      requestPath,
      {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        } as HeadersInit,
      },
    );
  }

  return {
    invoke,
  };
}

/**
 * Session data entity for admin API client.
 */
export type AdminSessionData = {
  accessToken: string;
  refreshToken: string;
  expirationTime: number;
};

function createAuthorizationHeader(token: string) {
  if (!token) return null;
  if (token.startsWith("Bearer ")) return token;
  return `Bearer ${token}`;
}

export function createAdminAPIClient<
  OPERATIONS extends Operations = defaultAdminOperations,
  PATHS = defaultAdminPaths,
>(params: {
  baseURL: string;
  sessionData?: AdminSessionData;
  onAuthChange?: (params: AdminSessionData) => void;
}) {
  const sessionData: AdminSessionData = {
    accessToken: params.sessionData?.accessToken || "",
    refreshToken: params.sessionData?.refreshToken || "",
    expirationTime: Number(params.sessionData?.expirationTime || 0),
  };

  function updateSessionData(responseData: {
    access_token?: string;
    refresh_token: string;
    expires_in: number;
  }) {
    if (responseData?.access_token) {
      defaultHeaders.Authorization = createAuthorizationHeader(
        responseData.access_token,
      );

      sessionData.accessToken = responseData.access_token;
      sessionData.refreshToken = responseData.refresh_token;
      sessionData.expirationTime = Date.now() + responseData.expires_in * 1000;
      params.onAuthChange?.({
        ...sessionData,
      });
    }
  }

  function setSessionData(data: AdminSessionData): AdminSessionData {
    sessionData.accessToken = data.accessToken;
    sessionData.refreshToken = data.refreshToken;
    sessionData.expirationTime = data.expirationTime;

    return getSessionData();
  }

  function getSessionData() {
    return { ...sessionData };
  }

  const defaultHeaders = {
    Authorization: createAuthorizationHeader(sessionData.accessToken),
  };

  const apiFetch = ofetch.create({
    baseURL: params.baseURL,
    async onRequest({ request, options }) {
      const isExpired = sessionData.expirationTime <= Date.now();

      if (isExpired && !request.toString().includes("/oauth/token")) {
        // Access session expired, first we need to refresh it with refresh token
        await ofetch("/oauth/token", {
          baseURL: params.baseURL,
          method: "POST",
          body: {
            grant_type: "refresh_token",
            client_id: "administration",
            refresh_token: sessionData.refreshToken || "",
          },
          headers: defaultHeaders as HeadersInit,
          onResponseError({ response }) {
            // if resfesh is expired we get 401 and we're throwing it without invoking the original request
            errorInterceptor(response);
          },
          onResponse(context) {
            updateSessionData(context.response._data);
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
    console.log("invoke with", requestPath, options);
    return apiFetch<RequestReturnType<OPERATION_NAME, OPERATIONS>>(
      requestPath,
      {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        } as HeadersInit,
      },
    );
  }

  return {
    /**
     * Invoke API request based on provided path definition.
     */
    invoke,
    /**
     * Enables to change session data in runtime. Useful for testing purposes.
     * Setting session data with this methis will **not** fire `onAuthChange` hook.
     */
    setSessionData,
    /**
     * Returns current session data. Useful for testing purposes, as in most cases you'll want to use `onAuthChange` hook for that.
     */
    getSessionData,
  };
}

export { ApiClientError } from "./errorInterceptor";
export type { ApiError } from "./errorInterceptor";
