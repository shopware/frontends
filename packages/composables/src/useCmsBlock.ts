import type { Schemas } from "#shopware";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type UseCmsBlockReturn = {
  /**
   * Cms block content
   */
  block: Schemas["CmsBlock"];
  /**
   * Get slot content by slot name (identifier)
   * @example getSlotContent("main")
   */
  getSlotContent(slotName: string): ArrayElement<Schemas["CmsBlock"]["slots"]>;
};

/**
 * Composable to get cms block content
 * @public
 * @category CMS (Shopping Experiences)
 */
export function useCmsBlock<BLOCK_TYPE extends Schemas["CmsBlock"]>(
  content: BLOCK_TYPE,
): UseCmsBlockReturn {
  function getSlotContent(slotName: ArrayElement<BLOCK_TYPE["slots"]>["slot"]) {
    return content.slots.find((slot) => slot.slot === slotName) as ArrayElement<
      BLOCK_TYPE["slots"]
    >;
  }

  return {
    block: content,
    getSlotContent,
  };
}
