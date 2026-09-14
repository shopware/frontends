import type { createAPIClient } from "@shopware/api-client";
import {
  encodeForQuery,
  mergeRequestHeaders,
} from "@shopware/api-client/helpers";
import { injectLocal } from "@vueuse/core";
import type { Ref } from "vue";

import { useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";

type GetTwin<OPERATION> = OPERATION extends `${infer NAME} post ${infer PATH}`
  ? `${NAME}Get get ${PATH}` & keyof operations
  : never;

/**
 * POST reads with a cacheable GET twin. `query`: body keys sent as plain query
 * params.
 */
export const cacheableReadRoutes = {
  "readCategoryList post /category": {
    get: "readCategoryListGet get /category",
  },
  "readCategory post /category/{navigationId}": {
    get: "readCategoryGet get /category/{navigationId}",
  },
  "readCountry post /country": {
    get: "readCountryGet get /country",
  },
  "readLanguages post /language": {
    get: "readLanguagesGet get /language",
  },
  "readNavigation post /navigation/{activeId}/{rootId}": {
    get: "readNavigationGet get /navigation/{activeId}/{rootId}",
    query: ["buildTree", "depth"],
  },
  "readProduct post /product": {
    get: "readProductGet get /product",
  },
  "readProductDetail post /product/{productId}": {
    get: "readProductDetailGet get /product/{productId}",
  },
  "readProductReviews post /product/{productId}/reviews": {
    get: "readProductReviewsGet get /product/{productId}/reviews",
  },
  "readSalutation post /salutation": {
    get: "readSalutationGet get /salutation",
  },
  "readSeoUrl post /seo-url": {
    get: "readSeoUrlGet get /seo-url",
  },
} satisfies {
  [OPERATION in keyof operations]?: {
    get: GetTwin<OPERATION>;
    query?: string[];
  };
};

type CacheableReadOperation = keyof typeof cacheableReadRoutes;

export type UseCacheableReadReturn = {
  /**
   * Same as `apiClient.invoke` for a POST read. Uses the GET twin for fresh
   * default guests.
   */
  invokeRead: ReturnType<
    typeof createAPIClient<Pick<operations, CacheableReadOperation>>
  >["invoke"];
};

type SessionContext = Schemas["SalesChannelContext"] & {
  // sent by the backend, missing in the schema
  shippingLocation?: { state?: Schemas["CountryState"] | null };
};

type ReadParams = {
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
};

function isDefaultGuest(
  session: SessionContext,
  headers: Record<string, unknown>,
) {
  const { salesChannel } = session;
  return (
    !!salesChannel &&
    !session.customer &&
    (headers["sw-currency-id"] ||
      (session.context?.currencyId ?? session.currency?.id)) ===
      salesChannel.currencyId &&
    session.shippingLocation?.country?.id === salesChannel.countryId &&
    !session.shippingLocation?.state &&
    session.paymentMethod?.id === salesChannel.paymentMethodId &&
    session.shippingMethod?.id === salesChannel.shippingMethodId &&
    (headers["sw-language-id"] || session.context?.languageIdChain?.[0]) ===
      salesChannel.languageId
  );
}

export function canUseCacheableGet({
  headers,
  session,
  cart,
  guestServerRender,
}: {
  headers: Record<string, unknown>;
  session?: SessionContext;
  cart?: Schemas["Cart"];
  guestServerRender?: boolean;
}): boolean {
  const token = headers["sw-context-token"];
  if (
    session
      ? !isDefaultGuest(session, headers)
      : headers["sw-language-id"] || headers["sw-currency-id"]
  ) {
    return false;
  }
  // no token: the backend answers as a fresh guest
  if (!token) return true;
  // session unknown, or not refreshed after a token change
  if (session?.token !== token) return false;
  // guest server render: the cart is empty
  if (guestServerRender) return true;
  return cart?.token === token && !cart.lineItems?.length;
}

/**
 * Uses the cacheable GET route for fresh default guests. Everything else stays
 * POST.
 *
 * @public
 * @category Context & Language
 */
export function useCacheableRead(): UseCacheableReadReturn {
  const { apiClient, cacheableReads, guestServerRender } = useShopwareContext();
  // not useContext: it creates an empty ref
  const session = injectLocal<Ref<SessionContext | undefined> | null>(
    "swSessionContext",
    null,
  );
  const cart = injectLocal<Ref<Schemas["Cart"] | undefined> | null>(
    "swCart",
    null,
  );

  const invoke = apiClient.invoke as unknown as (
    operation: string,
    ...params: [ReadParams?]
  ) => Promise<unknown>;

  function invokeRead(
    operation: CacheableReadOperation,
    ...params: [ReadParams?]
  ) {
    const canUseGet =
      cacheableReads &&
      canUseCacheableGet({
        headers: mergeRequestHeaders(
          params[0]?.headers,
          apiClient.defaultHeaders,
        ),
        session: session?.value,
        cart: cart?.value,
        guestServerRender,
      });
    if (!canUseGet) return invoke(operation, ...params);

    const route: { get: string; query?: string[] } =
      cacheableReadRoutes[operation];
    const { body, ...rest } = params[0] ?? {};
    const criteria = { ...body };
    const plainQuery: Record<string, unknown> = {};
    for (const key of route.query ?? []) {
      plainQuery[key] = criteria[key];
      delete criteria[key];
    }

    return invoke(route.get, {
      ...rest,
      headers: { ...rest.headers, "sw-context-token": "" },
      query: {
        ...rest.query,
        _criteria: body && encodeForQuery(criteria),
        ...plainQuery,
      },
    });
  }

  return {
    invokeRead: invokeRead as unknown as UseCacheableReadReturn["invokeRead"],
  };
}
