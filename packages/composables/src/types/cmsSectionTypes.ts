import { CmsBlock, CmsSection } from "@shopware-pwa/commons";

// Section Default can have only one container for blocks: content (full page)
export type CmsSectionDefault = CmsSection & {
  type: "default";
  blocks: Array<CmsBlock & { sectionPosition: "content" }>;
};

// Section Sidebar can have blocks in two different containers: sidebar (left), and content (right)
export type CmsSectionSidebar = CmsSection & {
  type: "sidebar";
  blocks: Array<CmsBlock & { sectionPosition: "sidebar" | "content" }>;
};
