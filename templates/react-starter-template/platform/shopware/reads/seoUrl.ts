import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import type { CmsRouteName } from "@shopware/cms-base-layer-react";
import { getRouteFromPathInfo, isTechnicalPath } from "@shopware/helpers";
import { cacheLife, cacheTag } from "next/cache";

import { createShopwareClient } from "../client";
import { readSalesChannelContext } from "./context";

export type ResolvedRoute = {
  routeName: CmsRouteName;
  foreignKey: string;
  seoPathInfo?: string;
};

const CMS_ROUTE_NAMES: CmsRouteName[] = [
  "frontend.navigation.page",
  "frontend.detail.page",
  "frontend.landing.page",
  "frontend.account.customer-group-registration.page",
];

function isCmsRouteName(value: string | undefined): value is CmsRouteName {
  return !!value && CMS_ROUTE_NAMES.includes(value as CmsRouteName);
}

async function readSeoUrl(path: string): Promise<ResolvedRoute | null> {
  "use cache";
  cacheLife("seo");
  cacheTag("sw:seo-url");

  const withoutLeadingSlash = path.replace(/^\/+/, "");
  const withoutTrailingSlash = withoutLeadingSlash.replace(/\/+$/, "");
  const response = await createShopwareClient().invoke(
    "readSeoUrlGet get /seo-url",
    {
      query: {
        _criteria: encodeForQuery({
          filter: [
            {
              type: "equalsAny",
              field: "seoPathInfo",
              value: [withoutTrailingSlash, `${withoutTrailingSlash}/`],
            },
          ],
          limit: 1,
        }),
      },
    },
  );

  const seoUrl = response.data.elements?.[0];
  if (!seoUrl || !isCmsRouteName(seoUrl.routeName) || !seoUrl.foreignKey) {
    return null;
  }

  return {
    routeName: seoUrl.routeName,
    foreignKey: seoUrl.foreignKey,
    seoPathInfo: seoUrl.seoPathInfo,
  };
}

export async function resolveSeoPath(
  path: string,
): Promise<ResolvedRoute | null> {
  if (path === "/") {
    const context = await readSalesChannelContext();
    return {
      routeName: "frontend.navigation.page",
      foreignKey: context.salesChannel.navigationCategoryId,
    };
  }

  if (isTechnicalPath(path)) {
    return getRouteFromPathInfo(path);
  }

  return readSeoUrl(path);
}
