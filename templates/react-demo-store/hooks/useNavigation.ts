import { apiClient } from "@/app/apiClient";
export function useNavigation() {
  const loadNavigationElements = () => {
    return apiClient.invoke(
      "readNavigation post /navigation/{activeId}/{rootId} sw-include-seo-urls",
      {
        depth: 2,
        activeId: "footer-navigation",
        rootId: "footer-navigation",
      }
    );
  };

  return { loadNavigationElements };
}
// export type StoreNavigationType =
//   | "main-navigation"
//   | "footer-navigation"
//   | "service-navigation";
