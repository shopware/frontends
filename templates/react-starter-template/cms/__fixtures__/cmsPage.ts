import type { Schemas } from "#shopware";

export const textSlot = {
  id: "slot-text",
  apiAlias: "cms_slot",
  type: "text",
  slot: "content",
  blockId: "block-text",
  config: {
    content: { source: "static", value: "<p>Hello <b>CMS</b></p>" },
    verticalAlign: { source: "static", value: "" },
  },
  data: { content: "<p>Hello <b>CMS</b></p>", apiAlias: "cms_text" },
} as unknown as Schemas["CmsSlot"];

export const textBlock = {
  id: "block-text",
  apiAlias: "cms_block",
  type: "text",
  sectionId: "section-default",
  sectionPosition: "main",
  position: 0,
  cssClass: "custom-block",
  marginTop: "20px",
  visibility: { mobile: true, tablet: true, desktop: false },
  slots: [textSlot],
} as unknown as Schemas["CmsBlock"];

export const unknownBlock = {
  id: "block-unknown",
  apiAlias: "cms_block",
  type: "not-a-block",
  sectionId: "section-default",
  sectionPosition: "main",
  position: 1,
  slots: [],
} as unknown as Schemas["CmsBlock"];

export const defaultSection = {
  id: "section-default",
  apiAlias: "cms_section",
  type: "default",
  position: 0,
  sizingMode: "boxed",
  backgroundColor: "#ffffff",
  blocks: [textBlock, unknownBlock],
} as unknown as Schemas["CmsSection"];

export const cmsPage = {
  id: "page-1",
  apiAlias: "cms_page",
  type: "landingpage",
  name: "Fixture page",
  sections: [defaultSection],
} as unknown as Schemas["CmsPage"];
