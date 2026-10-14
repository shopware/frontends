import { encodeForQuery } from "@shopware/api-client/helpers";
import type {
  CmsFindVariantInput,
  CmsFindVariantResult,
} from "@shopware/cms-base-layer-react/client";

import type { ApiClient, Schemas, operations } from "#shopware";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import { hasApiErrorCode } from "@/features/wishlist/wishlistApi";
import { hasUnsafePathChar, toSeoPath } from "@/platform/routing/paths";

export const FIND_VARIANT =
  "searchProductVariantIdsGet get /product/{productId}/find-variant";
export const READ_SEO_URL = "readSeoUrlGet get /seo-url";
export const VARIANT_NOT_FOUND = "CONTENT__PRODUCT_VARIANT_NOT_FOUND";

export type VariantClient = Pick<ApiClient, "invoke">;

type FindVariantGetQuery = operations[typeof FIND_VARIANT]["query"];

type FoundCombination = Schemas["FindProductVariantRouteResponse"] & {
  variantId?: string;
};

export function findVariantQuery(
  options: Record<string, string>,
  switchedGroup?: string,
): FindVariantGetQuery {
  const query: Record<string, string> = {};
  for (const [groupId, optionId] of Object.entries(options)) {
    query[`options[${groupId}]`] = optionId;
  }
  if (switchedGroup) query.switchedGroup = switchedGroup;
  return query as unknown as FindVariantGetQuery;
}

export function variantSeoUrlCriteria(variantId: string): Schemas["Criteria"] {
  return {
    filter: [
      { type: "equals", field: "routeName", value: "frontend.detail.page" },
      { type: "equals", field: "foreignKey", value: variantId },
    ],
    includes: { seo_url: ["seoPathInfo"] },
    limit: 1,
  };
}

function foundVariantId(data: FoundCombination | null | undefined): string {
  const variantId = data?.variantId || data?.foundCombination?.variantId;
  if (!variantId) {
    throw new Error("[Variants] the find-variant answer has no variant id");
  }
  return variantId;
}

async function readVariantId(
  client: VariantClient,
  productId: string,
  { options, switchedGroup, signal }: CmsFindVariantInput,
): Promise<string | null> {
  try {
    const { data } = await client.invoke(FIND_VARIANT, {
      pathParams: { productId },
      query: findVariantQuery(options, switchedGroup),
      fetchOptions: { timeout: READ_TIMEOUT_MS, signal },
    });
    return foundVariantId(data);
  } catch (error) {
    if (hasApiErrorCode(error, VARIANT_NOT_FOUND)) return null;
    throw error;
  }
}

async function readVariantPath(
  client: VariantClient,
  variantId: string,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const { data } = await client.invoke(READ_SEO_URL, {
      query: { _criteria: encodeForQuery(variantSeoUrlCriteria(variantId)) },
      fetchOptions: { timeout: READ_TIMEOUT_MS, signal },
    });
    const seoPathInfo = data.elements?.[0]?.seoPathInfo;
    return seoPathInfo && !hasUnsafePathChar(seoPathInfo)
      ? toSeoPath(seoPathInfo)
      : null;
  } catch (error) {
    if (signal?.aborted) throw error;
    console.error(
      "[Variants] reading the SEO URL of the variant failed",
      error,
    );
    return null;
  }
}

export async function findProductVariant(
  getClient: () => Promise<VariantClient>,
  input: CmsFindVariantInput,
): Promise<CmsFindVariantResult> {
  if (Object.keys(input.options).length === 0) {
    return { ok: false, notFound: true };
  }
  try {
    const client = await getClient();
    const variantId = await readVariantId(
      client,
      input.parentId ?? input.productId,
      input,
    );
    if (variantId === null) return { ok: false, notFound: true };
    const url = await readVariantPath(client, variantId, input.signal);
    return {
      ok: true,
      variant: url ? { productId: variantId, url } : { productId: variantId },
    };
  } catch (error) {
    if (input.signal?.aborted) return { ok: false, cancelled: true };
    console.error("[Variants] finding the variant failed", error);
    return { ok: false };
  }
}
