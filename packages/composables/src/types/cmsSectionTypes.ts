import { CmsBlock, CmsSection } from "@shopware-pwa/types";

// Section Default can have only one container for blocks: main (full page)
export type CmsSectionDefault = CmsSection & {
  type: "default";
  blocks: Array<CmsBlock & { sectionPosition: "main" }>;
};

// Section Sidebar can have blocks in two different containers: sidebar (left), and main (right)
export type CmsSectionSidebar = CmsSection & {
  type: "sidebar";
  blocks: Array<CmsBlock & { sectionPosition: "sidebar" | "main" }>;
};
