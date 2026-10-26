import { toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

import type { Schemas } from "#shopware";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type UseCmsSectionType = {
  /**
   * CMS section, as it was when the composable was called.
   */
  section: Schemas["CmsSection"];
  /**
   * Blocks of the section placed on the given position.
   *
   * Reads the section on every call, so it follows a `ref` or getter passed as
   * `content`.
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
  content: MaybeRefOrGetter<SECTION_TYPE>,
): UseCmsSectionType {
  function getPositionContent(
    position: ArrayElement<SECTION_TYPE["blocks"]>["sectionPosition"],
  ) {
    return toValue(content).blocks.filter(
      (block) => block.sectionPosition === position,
    ) as Array<Schemas["CmsBlock"]>;
  }

  return {
    section: toValue(content),
    getPositionContent,
  };
}
