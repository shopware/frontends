import { CmsBlock } from "@shopware-pwa/commons";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function useCmsBlock<BLOCK_TYPE extends CmsBlock>(content: BLOCK_TYPE) {
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
