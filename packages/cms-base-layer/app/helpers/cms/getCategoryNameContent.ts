import type { CmsElementCategoryName } from "@shopware/composables";

import { getTextElementContent } from "./getTextElementContent";

export function getCategoryNameContent(
  element: CmsElementCategoryName,
): string {
  const content = getTextElementContent(element);

  if (!content || element.config?.content?.source !== "mapped") {
    return content;
  }

  return `<h1 class="cms-element-category-name-headline">${content}</h1>`;
}
