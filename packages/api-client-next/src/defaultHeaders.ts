/**
 * Source: https://github.com/shopware/shopware/blob/trunk/src/Core/PlatformRequest.php#L16
 */
type RequestHeaderName =
  | "sw-context-token"
  | "sw-access-key"
  | "sw-language-id"
  | "sw-currency-id"
  | "sw-inheritance"
  | "sw-version-id"
  | "sw-include-seo-urls"
  | "sw-skip-trigger-flow"
  | "sw-app-integration-id"
  | "indexing-behavior"
  | "indexing-skip";

type LiteralUnion<T extends U, U = string> = T | (U & { _x?: never });

export type ClientHeaders = Partial<
  Record<LiteralUnion<RequestHeaderName>, string>
>;

export type ClientHeadersProxy = ClientHeaders & {
  /**
   * Set default headers for the client.
   * Default headers are added to every request.
   * If the header value is falsy, it will be removed from the headers.
   *
   * @example
   * ```ts
   * apiClient.defaultHeaders.apply({
   *  "sw-language-id": "my-language-id",
   * });
   * ```
   */
  readonly apply: (headers: ClientHeaders) => void;
};

export function createHeaders(init: ClientHeaders): ClientHeadersProxy {
  const _headers: ClientHeaders = {
    "Content-Type": "application/json",
  };

  const handler: ProxyHandler<ClientHeadersProxy> = {
    get: (target: ClientHeaders, prop: string) => {
      if (prop === "apply") {
        return apply;
      }
      return Reflect.get(target, prop);
    },
    set: (target: ClientHeaders, prop: string, value: string) => {
      if (prop === "apply") {
        throw new Error("Cannot override apply method");
      }
      return Reflect.set(target, prop, value);
    },
  };

  const headersProxy = new Proxy<ClientHeadersProxy>(
    _headers as ClientHeadersProxy,
    handler,
  );
  function apply(headers: ClientHeaders) {
    for (const [key, value] of Object.entries(headers)) {
      if (value) {
        headersProxy[key] = value;
      } else {
        delete headersProxy[key];
      }
    }
  }
  headersProxy.apply({ ...init });

  return headersProxy;
}
