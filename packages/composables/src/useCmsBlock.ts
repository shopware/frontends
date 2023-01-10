import { CmsBlock } from "@shopware-pwa/types";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type UseCmsBlockReturn = {
  /**
   * Cms block content
   */
  block: CmsBlock;
  /**
   * Get slot content by slot name (identifier)
   * @example getSlotContent("main")
   */
  getSlotContent: (slotName: string) => ArrayElement<CmsBlock["slots"]>;
};

/**
 * Composable to get cms block content
 */
export function useCmsBlock<BLOCK_TYPE extends CmsBlock>(
  content: BLOCK_TYPE
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
