import { CmsBlock, CmsSection, CmsSlot } from "@shopware-pwa/types";

/**
 * @beta
 */
export type LayoutConfiguration = {
  layoutStyles: {
    backgroundColor: string | null;
    backgroundImage: string | null;
    backgroundSize?: string | null;
    sizingMode?: string | null;
    marginBottom?: string | null | undefined;
    marginLeft?: string | null | undefined;
    marginRight?: string | null | undefined;
    marginTop?: string | null | undefined;
  };
  cssClasses: string | null;
};

// predicate types
function isCmsSlot(
  content: CmsBlock | CmsSection | CmsSlot
): content is CmsSlot {
  return content.apiAlias === "cms_slot";
}

function isCmsBlock(
  content: CmsBlock | CmsSection | CmsSlot
): content is CmsBlock {
  return content.apiAlias === "cms_block";
}

function isCmsSection(
  content: CmsBlock | CmsSection | CmsSlot
): content is CmsSection {
  return content.apiAlias === "cms_section";
}
/**
 * @category CMS (Shopping Experiences)
 */
export function getCmsLayoutConfiguration(
  content: CmsBlock | CmsSection | CmsSlot
): LayoutConfiguration {
  if (!content || isCmsSlot(content)) {
    return {
      cssClasses: null,
      layoutStyles: {},
    } as LayoutConfiguration;
  }

  return {
    cssClasses: content.cssClass,
    layoutStyles: {
      backgroundColor: content.backgroundColor,
      backgroundImage: content.backgroundMedia
        ? `url("${content.backgroundMedia.url}")`
        : null,
      backgroundSize: isCmsSection(content)
        ? content.backgroundMediaMode
        : null,
      sizingMode: isCmsSection(content) ? content.sizingMode : null,
      marginBottom: isCmsBlock(content) ? content.marginBottom : null,
      marginLeft: isCmsBlock(content) ? content.marginLeft : null,
      marginRight: isCmsBlock(content) ? content.marginRight : null,
      marginTop: isCmsBlock(content) ? content.marginTop : null,
    },
  };
}
