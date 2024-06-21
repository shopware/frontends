import type { Schemas } from "#shopware";

export type CmsSectionBlock<
  TYPE extends Schemas["CmsSection"]["type"],
  SECTION_POSITIONS,
> = Schemas["CmsSection"] & {
  type: TYPE;
  blocks: Array<Schemas["CmsBlock"] & { sectionPosition: SECTION_POSITIONS }>;
};

// Section Default can have only one container for blocks: main (full page)
export type CmsSectionDefault = CmsSectionBlock<"default", "main">;

// Section Sidebar can have blocks in two different containers: sidebar (left), and main (right)
export type CmsSectionSidebar = CmsSectionBlock<"sidebar", "sidebar" | "main">;
