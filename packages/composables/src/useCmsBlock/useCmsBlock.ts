import { toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

import type { Schemas } from "#shopware";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type UseCmsBlockReturn = {
  /**
   * Cms block content, as it was when the composable was called.
   */
  block: Schemas["CmsBlock"];
  /**
   * Get slot content by slot name (identifier).
   *
   * Reads the block on every call, so it follows a `ref` or getter passed as
   * `content`.
   *
   * A block does not have to carry every slot its layout allows: the lookup
   * returns `undefined` at runtime for a slot that is not there, which the
   * return type does not express yet. Guard on the result.
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
  content: MaybeRefOrGetter<BLOCK_TYPE>,
): UseCmsBlockReturn {
  function getSlotContent(slotName: ArrayElement<BLOCK_TYPE["slots"]>["slot"]) {
    return toValue(content).slots.find(
      (slot) => slot.slot === slotName,
    ) as ArrayElement<BLOCK_TYPE["slots"]>;
  }

  return {
    block: toValue(content),
    getSlotContent,
  };
}
