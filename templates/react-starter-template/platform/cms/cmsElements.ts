import type { Schemas } from "#shopware";

export function hasCmsElement(
  cmsPage: Schemas["CmsPage"] | null | undefined,
  type: string,
): boolean {
  return (cmsPage?.sections ?? []).some((section) =>
    (section.blocks ?? []).some((block) =>
      (block.slots ?? []).some((slot) => slot.type === type),
    ),
  );
}
