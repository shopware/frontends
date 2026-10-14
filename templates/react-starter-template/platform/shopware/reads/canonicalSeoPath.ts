import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import { cacheLife, cacheTag } from "next/cache";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";

export async function readCanonicalSeoPath(
  routeName: string,
  foreignKey: string,
  languageId: string,
): Promise<string | null> {
  "use cache";
  cacheLife("seo");
  cacheTag(...languageCacheTags("sw:seo-url", languageId));

  const { data } = await createShopwareClient({ languageId }).invoke(
    "readSeoUrlGet get /seo-url",
    {
      query: {
        _criteria: encodeForQuery({
          filter: [
            { type: "equals", field: "routeName", value: routeName },
            { type: "equals", field: "foreignKey", value: foreignKey },
          ],
          limit: 1,
          includes: { seo_url: ["seoPathInfo"] },
        }),
      },
    },
  );
  const seoPathInfo = data.elements?.[0]?.seoPathInfo;
  return typeof seoPathInfo === "string" && seoPathInfo !== ""
    ? seoPathInfo
    : null;
}
