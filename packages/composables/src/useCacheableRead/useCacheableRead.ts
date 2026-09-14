import type { createAPIClient } from "@shopware/api-client";
import { encodeForQuery } from "@shopware/api-client/helpers";
import { injectLocal } from "@vueuse/core";
import type { Ref } from "vue";

import { useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";

type GetTwin<OPERATION> = OPERATION extends `${infer NAME} post ${infer PATH}`
  ? `${NAME}Get get ${PATH}` & keyof operations
  : never;

/**
 * POST reads with a cacheable GET twin. `query` lists body keys the GET route
 * takes as plain query params instead of inside `_criteria`.
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
   * Same as `apiClient.invoke` for a POST read. Sent as the GET twin only when
   * `cacheableReads` is on and the session equals a fresh default guest.
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
  headers?: Record<string, unknown>;
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
  // without a token the backend answers for a fresh default guest
  if (!token) return true;
  // unknown session, or the token changed and the session is not refreshed yet
  if (session?.token !== token) return false;
  // the server render has no visitor session, so its cart is empty
  if (guestServerRender) return true;
  return cart?.token === token && !cart.lineItems?.length;
}

/**
 * Reads through the cacheable GET Store API route when the response is the
 * same for every fresh default guest. Everything else stays POST.
 *
 * @public
 * @category Context & Language
 */
export function useCacheableRead(): UseCacheableReadReturn {
  const { apiClient, cacheableReads, guestServerRender } = useShopwareContext();
  // not useContext: it would provide a new empty ref when none exists
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
        headers: { ...apiClient.defaultHeaders, ...params[0]?.headers },
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
