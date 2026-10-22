import type { createAPIClient } from "@shopware/api-client";
import {
  encodeForQuery,
  mergeRequestHeaders,
} from "@shopware/api-client/helpers";
import type { RequestHeaders } from "@shopware/api-client/helpers";
import { injectLocal } from "@vueuse/core";
import type { Ref } from "vue";

import { useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";

import { cacheableReadRoutes } from "./routes";

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
  headers?: RequestHeaders;
  query?: Record<string, unknown>;
};

// a missing id on either side is unknown, not a match
const sameId = (current: unknown, expected?: string) =>
  !!expected && current === expected;

function isDefaultSession(
  session: SessionContext,
  headers: Record<string, unknown>,
) {
  const { salesChannel } = session;
  return (
    !!salesChannel &&
    !session.customer &&
    !session.shippingLocation?.state &&
    sameId(
      headers["sw-currency-id"] ||
        (session.context?.currencyId ?? session.currency?.id),
      salesChannel.currencyId,
    ) &&
    sameId(session.shippingLocation?.country?.id, salesChannel.countryId) &&
    sameId(session.paymentMethod?.id, salesChannel.paymentMethodId) &&
    sameId(session.shippingMethod?.id, salesChannel.shippingMethodId) &&
    sameId(
      headers["sw-language-id"] || session.context?.languageIdChain?.[0],
      salesChannel.languageId,
    )
  );
}

export function canUseCacheableGet({
  headers,
  session,
  cart,
  ssrWithoutUserContext,
}: {
  headers: Record<string, unknown>;
  session?: SessionContext;
  cart?: Schemas["Cart"];
  ssrWithoutUserContext?: boolean;
}): boolean {
  const token = headers["sw-context-token"];
  if (
    session
      ? !isDefaultSession(session, headers)
      : headers["sw-language-id"] || headers["sw-currency-id"]
  ) {
    return false;
  }
  // no token: the backend answers as a fresh guest
  if (!token) return true;
  // session unknown, or not refreshed after a token change
  if (session?.token !== token) return false;
  // server render without user context: a cart that was never loaded is empty
  if (ssrWithoutUserContext && !cart) return true;
  return cart?.token === token && cart.lineItems?.length === 0;
}

/**
 * Uses the cacheable GET route for fresh default guests. Everything else stays
 * POST.
 *
 * @public
 * @category Context & Language
 */
export function useCacheableRead(): UseCacheableReadReturn {
  const { apiClient, cacheableReads, ssrWithoutUserContext } =
    useShopwareContext();
  // not useContext: it creates an empty ref
  const session = injectLocal<Ref<SessionContext | undefined> | null>(
    "swSessionContext",
    null,
  );
  const cart = injectLocal<Ref<Schemas["Cart"] | undefined> | null>(
    "swCart",
    null,
  );

  const invoke = apiClient.invoke as (
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
        ssrWithoutUserContext,
      });
    if (!canUseGet) return invoke(operation, ...params);

    const route: { get: string; query?: string[] } =
      cacheableReadRoutes[operation];
    const { body, ...rest } = params[0] ?? {};
    const criteria = { ...body };
    const plainQuery: Record<string, unknown> = {};
    for (const key of route.query ?? []) {
      if (criteria[key] === undefined) continue;
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
    invokeRead: invokeRead as UseCacheableReadReturn["invokeRead"],
  };
}
