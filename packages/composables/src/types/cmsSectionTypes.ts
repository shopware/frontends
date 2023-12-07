import type { CmsBlock, CmsSection, SectionType } from "@shopware-pwa/types";

export type CmsSectionBlock<
  TYPE extends SectionType,
  SECTION_POSITIONS,
> = CmsSection & {
  type: TYPE;
  blocks: Array<CmsBlock & { sectionPosition: SECTION_POSITIONS }>;
};

// Section Default can have only one container for blocks: main (full page)
export type CmsSectionDefault = CmsSectionBlock<"default", "main">;

// Section Sidebar can have blocks in two different containers: sidebar (left), and main (right)
export type CmsSectionSidebar = CmsSectionBlock<"sidebar", "sidebar" | "main">;
