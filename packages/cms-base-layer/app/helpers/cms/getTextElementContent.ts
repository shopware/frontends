type TextElementLike = {
  config?: {
    content?: { source?: string; value?: unknown } | null;
  } | null;
  data?: { content?: string | null } | null;
};

/**
 * The HTML a text-like element (`text`, `product-name`, `category-name`)
 * renders.
 *
 * Once the Store API resolved the slot, `data.content` is the only source: the
 * backend sanitized it, `config.content.value` is the raw input. The config is
 * read only for an element without `data`, which the API never sends but a
 * hand-built element may.
 */
export function getTextElementContent(
  element: TextElementLike | null | undefined,
): string {
  const config = element?.config?.content;

  if (!element?.data) {
    return config?.source !== "mapped" && typeof config?.value === "string"
      ? config.value
      : "";
  }

  const content = element.data.content ?? "";

  // The backend answers a mapping to a value that is not a string (an entity,
  // an array) with the mapping path itself, e.g. `category.customFields`.
  if (config?.source === "mapped" && content === config.value) {
    return "";
  }

  return content;
}
