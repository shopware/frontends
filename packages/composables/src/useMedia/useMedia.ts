import { useShopwareContext } from "#imports";
import type { operations } from "#shopware";

interface UseMedia {
  /**
   * Fetches media by ids
   * @param {string[]} ids
   */
  fetchMedia(
    ids: string[],
  ): Promise<operations["readMedia post /media"]["response"]>;
}

/**
 *
 * Composable for media handling
 *
 * @returns {UseMedia} media composable
 */
export function useMedia(): UseMedia {
  const { apiClient } = useShopwareContext();

  const fetchMedia = async (ids: string[]) => {
    const result = await apiClient.invoke("readMedia post /media", {
      body: {
        ids,
      },
    });
    return result.data;
  };

  return {
    fetchMedia,
  };
}
