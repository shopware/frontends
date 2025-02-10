import { useSessionContext, useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";
import { cmsAssociations } from "../cms/cmsAssociations";

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
  const { currentSessionLanguageID } = useSessionContext();
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
        headers: {
          "sw-language-id": currentSessionLanguageID.value,
        },
      },
    );
    return result.data;
  };

  return {
    search,
  };
}
