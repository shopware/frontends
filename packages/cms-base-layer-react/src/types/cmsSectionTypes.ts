import type { Schemas } from "#shopware";

export type CmsSectionBlock<
  TYPE extends Schemas["CmsSection"]["type"],
  SECTION_POSITIONS,
> = Schemas["CmsSection"] & {
  type: TYPE;
  blocks: Array<Schemas["CmsBlock"] & { sectionPosition: SECTION_POSITIONS }>;
};

export type CmsSectionDefaultContent = CmsSectionBlock<"default", "main">;

export type CmsSectionSidebarContent = CmsSectionBlock<
  "sidebar",
  "sidebar" | "main"
>;
