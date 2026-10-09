import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas, operations } from "#shopware";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";
import { cmsAssociations } from "./cmsAssociations";

type ReadLandingPageGetQuery = NonNullable<
  operations["readLandingPageGet get /landing-page/{landingPageId}"]["query"]
> & { _criteria?: string };

export async function readLandingPage(
  landingPageId: string,
  languageId: string | null,
): Promise<Schemas["LandingPage"]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(...languageCacheTags(`sw:landing:${landingPageId}`, languageId));

  const response = await createShopwareClient({ languageId }).invoke(
    "readLandingPageGet get /landing-page/{landingPageId}",
    {
      pathParams: { landingPageId },
      query: {
        _criteria: encodeForQuery({ associations: cmsAssociations }),
      } as ReadLandingPageGetQuery,
    },
  );

  return response.data;
}
