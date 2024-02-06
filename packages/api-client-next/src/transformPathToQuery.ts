type HttpMethod = "post" | "get" | "put" | "delete" | "patch";

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

  for (const paramName of headerParamnames) {
    headers[paramName] = params[paramName] as string;
  }

  const query: Record<string, unknown> = {};
  for (const paramName of queryParamNames) {
    // API takes array params as `paramName[]`, so multiple params have shape ?paramName[]=1&paramName[]=2
    // to improve DX we do not require user to add [] to param name, we do it here
    let queryParamName = paramName;
    if (Array.isArray(params[paramName]) && !queryParamName.includes("[]")) {
      queryParamName += "[]";
    }
    query[queryParamName] = params[paramName];
  }
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

  if (!params) {
    return [requestPathWithParams, returnOptions];
  }

  for (const key of Object.keys(params)) {
    if (
      !pathParams.includes(key) &&
      !queryParamNames.includes(key) &&
      !headerParamnames.includes(key)
    ) {
      returnOptions.body ??= {} as T;
      Reflect.set(returnOptions.body, key, params[key]);
    }
  }

  // Exception for unknown type of FormData - multipart/form-data MIME type
  // pass as it is
  if (params instanceof FormData) {
    returnOptions.body ??= params as T;
  }

  return [requestPathWithParams, returnOptions];
}
