import "server-only";
import { createCmsContext } from "@/cms";
import type { CmsContext, CreateCmsContextInput } from "@/cms";

import { readSalesChannelContext } from "../shopware/reads/context";
import { cmsRegistry } from "./registry";

export type StorefrontCmsContextInput = Omit<
  CreateCmsContextInput,
  | "registry"
  | "locale"
  | "currencyCode"
  | "urlPrefix"
  | "taxState"
  | "navigationCategoryId"
  | "isLoggedIn"
>;

export async function createStorefrontCmsContext(
  input: StorefrontCmsContextInput,
): Promise<CmsContext> {
  const salesChannelContext = await readSalesChannelContext();
  return createCmsContext({
    registry: cmsRegistry,
    locale: "en-GB",
    urlPrefix: "",
    currencyCode: salesChannelContext.currency?.isoCode ?? "EUR",
    taxState: salesChannelContext.context?.taxState === "net" ? "net" : "gross",
    navigationCategoryId: salesChannelContext.salesChannel.navigationCategoryId,
    isLoggedIn: false,
    ...input,
  });
}
