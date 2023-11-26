type Category<T = unknown> = T & {
  name: string;
  translated: { name: string };
  media: { url: string };
  type: string;
};

const isCategory = (category: Partial<Category>): boolean => {
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
export function getCategoryImageUrl(category: Partial<Category>): string {
  return isCategory(category) ? category?.media?.url || "" : "";
}
