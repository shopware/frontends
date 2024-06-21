import type { Schemas } from "#shopware";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type UseCmsSectionType = {
  /**
   * CMS section
   */
  section: Schemas["CmsSection"];
  /**
   * Position of the section
   */
  getPositionContent(
    position: ArrayElement<Schemas["CmsSection"]["blocks"]>["sectionPosition"],
  ): Array<Schemas["CmsBlock"]>;
};

/**
 * Composable to get cms section content
 * @public
 * @category CMS (Shopping Experiences)
 */
export function useCmsSection<SECTION_TYPE extends Schemas["CmsSection"]>(
  content: SECTION_TYPE,
): UseCmsSectionType {
  function getPositionContent(
    position: ArrayElement<SECTION_TYPE["blocks"]>["sectionPosition"],
  ) {
    return content.blocks.filter(
      (block) => block.sectionPosition === position,
    ) as Array<Schemas["CmsBlock"]>;
  }

  return {
    section: content,
    getPositionContent,
  };
}
