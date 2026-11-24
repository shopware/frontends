import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import {
  getFrontendRouteName,
  getRouteFromPathInfo,
  isTechnicalPath,
} from "@shopware/helpers";
import { cacheLife, cacheTag } from "next/cache";

import type { CmsRouteName } from "@/cms";
import { sameSeoPath } from "@/platform/routing/paths";

import { createShopwareClient } from "../client";
import { isRenderedRouteName } from "../routeNames";
import { languageCacheTags } from "./cacheTags";
import { readSalesChannelContext } from "./context";

export type ResolvedRoute = {
  routeName: CmsRouteName;
  foreignKey: string;
  seoPathInfo?: string;
};

async function readSeoUrl(
  path: string,
  languageId: string | null,
): Promise<ResolvedRoute | null> {
  "use cache";
  cacheLife("seo");
  cacheTag(...languageCacheTags("sw:seo-url", languageId));

  const withoutLeadingSlash = path.replace(/^\/+/, "");
  const withoutTrailingSlash = withoutLeadingSlash.replace(/\/+$/, "");
  const response = await createShopwareClient({ languageId }).invoke(
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
          limit: 2,
        }),
      },
    },
  );

  const rows = response.data.elements ?? [];
  const seoUrl =
    rows.find(
      (row) =>
        typeof row.seoPathInfo === "string" &&
        sameSeoPath(row.seoPathInfo, path),
    ) ?? rows[0];
  const routeName = getFrontendRouteName(seoUrl?.routeName);
  if (!seoUrl || !isRenderedRouteName(routeName) || !seoUrl.foreignKey) {
    return null;
  }

  return {
    routeName,
    foreignKey: seoUrl.foreignKey,
    seoPathInfo: seoUrl.seoPathInfo,
  };
}

export async function resolveSeoPath(
  path: string,
  languageId: string | null,
): Promise<ResolvedRoute | null> {
  if (path === "/") {
    const context = await readSalesChannelContext(languageId);
    return {
      routeName: "frontend.navigation.page",
      foreignKey: context.salesChannel.navigationCategoryId,
    };
  }

  if (isTechnicalPath(path)) {
    return getRouteFromPathInfo(path);
  }

  return readSeoUrl(path, languageId);
}
