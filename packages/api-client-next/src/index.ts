import { ofetch } from "ofetch";
import {
  operations as defaultOperations,
  paths as defaultPaths,
} from "../api-types";

type Operations = Record<string, unknown>;

// type Paths = {
//   [path: string]: {
//     [method: string]: unknown;
//   };
// };

type HttpMethod = "post" | "get" | "put" | "delete" | "patch";

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
  : Record<string, unknown>) &
  (OPERATIONS[OPERATION_NAME] extends {
    parameters?: { path?: infer R };
  }
    ? R
    : Record<string, unknown>) &
  (OPERATIONS[OPERATION_NAME] extends {
    requestBody?: { content?: { "application/json"?: infer R } };
  }
    ? R
    : Record<string, unknown>) &
  (OPERATIONS[OPERATION_NAME] extends {
    parameters?: { header?: infer R };
  }
    ? R
    : Record<string, unknown>);

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
  apiType: "store-api" | "admin-api";
  accessToken: string;
  contextToken?: string;
  onContextChanged?: (newContextToken: string) => void;
}) {
  const defaultHeaders = {
    "sw-access-key": params.accessToken,
    "sw-context-token": params.contextToken,
  };

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
    // async onResponseError({ request, response, options }) {},
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
    // console.log("invoke with", requestPath, options);
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

export function transformPathToQuery<T extends Record<string, unknown>>(
  path: string,
  params: T,
): [
  string,
  {
    method: HttpMethod;
    query: Record<string, unknown>;
    headers: HeadersInit;
    body?: Partial<T>;
  },
] {
  // first param is operationName, not used here though
  const [, method, pathDefinition, headerParams] = path.split(" ");
  const [requestPath, queryParams] = pathDefinition.split("?");

  // get names in brackets
  const pathParams: string[] =
    requestPath
      .match(/{[^}]+}/g)
      //remove brackets
      ?.map((param) => param.substring(1, param.length - 1)) || [];
  const requestPathWithParams = pathParams.reduce((acc, paramName) => {
    return acc.replace(`{${paramName}}`, params[paramName] as string);
  }, requestPath);

  const queryParamNames = queryParams?.split(",") || [];

  const headerParamnames = headerParams?.split(",") || [];
  const headers: HeadersInit = {};
  headerParamnames.forEach((paramName) => {
    headers[paramName] = params[paramName] as string;
  });
  const query: Record<string, unknown> = {};
  queryParamNames.forEach((paramName) => {
    query[paramName] = params[paramName];
  });

  const returnOptions = {
    method: method.toUpperCase() as HttpMethod,
    headers,
    query,
  } as {
    method: HttpMethod;
    headers: HeadersInit;
    query: Record<string, unknown>;
    body?: Partial<T>;
  };
  Object.keys(params).forEach((key) => {
    if (
      !pathParams.includes(key) &&
      !queryParamNames.includes(key) &&
      !headerParamnames.includes(key)
    ) {
      returnOptions.body ??= {} as T;
      Reflect.set(returnOptions.body, key, params[key]);
    }
  });

  return [requestPathWithParams, returnOptions];
}
