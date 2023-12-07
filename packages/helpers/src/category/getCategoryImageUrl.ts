const isCategory = <T extends { type: string }>(category: T): boolean => {
  return (
    category?.type === "page" ||
    category?.type === "link" ||
    category?.type === "folder"
  );
};

/**
 * gets the cover image
 *
 * @param {Category} category category entity
 *
 * @public
 */
export function getCategoryImageUrl<
  T extends {
    media?: { url: string };
    type: string;
  },
>(category: T): string {
  return isCategory(category) ? category?.media?.url || "" : "";
}
