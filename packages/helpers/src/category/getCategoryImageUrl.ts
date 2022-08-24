import { Category } from "@shopware-pwa/types";

export const isCategory = (category: Partial<Category>): boolean => {
  return (
    category?.type === "page" ||
    category?.type === "link" ||
    category?.type === "folder"
  );
};

/**
 * gets the cover image
 *
 * @public
 */
export function getCategoryImageUrl(category: Partial<Category>): string {
  return isCategory(category) ? category?.media?.url || "" : "";
}
