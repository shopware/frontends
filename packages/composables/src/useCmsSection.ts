import { CmsBlock, CmsSection } from "@shopware-pwa/types";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function useCmsSection<SECTION_TYPE extends CmsSection>(
  content: SECTION_TYPE
) {
  function getPositionContent(
    position: ArrayElement<SECTION_TYPE["blocks"]>["sectionPosition"]
  ) {
    return content.blocks.filter(
      (block) => block.sectionPosition === position
    ) as Array<CmsBlock>;
  }

  return {
    section: content,
    getPositionContent,
  };
}
