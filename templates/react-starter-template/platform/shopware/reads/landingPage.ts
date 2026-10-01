import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas, operations } from "#shopware";

import { createShopwareClient } from "../client";
import { cmsAssociations } from "./cmsAssociations";

type ReadLandingPageGetQuery = NonNullable<
  operations["readLandingPageGet get /landing-page/{landingPageId}"]["query"]
> & { _criteria?: string };

export async function readLandingPage(
  landingPageId: string,
): Promise<Schemas["LandingPage"]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(`sw:landing:${landingPageId}`);

  const response = await createShopwareClient().invoke(
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
