import { useShopwareContext } from "#imports";
import { cmsAssociations } from "../cms/cmsAssociations";
import type { Schemas, operations } from "#shopware";

export type UseLandingSearchReturn = {
  /**
   * Search for landing page by ID
   * Accepts optional media associations
   */
  search(
    navigationId: string,
    options?: {
      withCmsAssociations?: boolean;
    },
  ): Promise<Schemas["LandingPage"]>;
};

/**
 * Composable for landing page search.
 * @public
 * @category Navigation & Routing
 */
export function useLandingSearch(): {
  search: (
    navigationId: string,
    options?: {
      withCmsAssociations?: boolean;
    },
  ) => Promise<Schemas["LandingPage"]>;
} {
  const { apiClient } = useShopwareContext();

  const search = async (
    navigationId: string,
    options?: {
      withCmsAssociations?: boolean;
    },
  ) => {
    const associations: operations["readLandingPage post /landing-page/{landingPageId}"]["body"]["associations"] =
      options?.withCmsAssociations ? cmsAssociations : {};
    const result = await apiClient.invoke(
      "readLandingPage post /landing-page/{landingPageId}",
      {
        pathParams: {
          landingPageId: navigationId,
        },
        body: {
          associations,
        },
      },
    );
    return result.data;
  };

  return {
    search,
  };
}
