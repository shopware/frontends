import {
  CmsBlock,
  CmsSection,
  CmsSlot,
  CmsVisibility,
} from "@shopware-pwa/types";

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
  content: CmsBlock | CmsSection | CmsSlot,
): content is CmsSlot {
  return content.apiAlias === "cms_slot";
}

function isCmsBlock(
  content: CmsBlock | CmsSection | CmsSlot,
): content is CmsBlock {
  return content.apiAlias === "cms_block";
}

function isCmsSection(
  content: CmsBlock | CmsSection | CmsSlot,
): content is CmsSection {
  return content.apiAlias === "cms_section";
}

const deviceMap: { [key in CmsVisibility]: "md" | "xl" | "lg" } = {
  mobile: "md",
  tablet: "lg",
  desktop: "xl",
};

/**
 * Get css object for visibility classes
 *
 *  mobile  -> "md"
 *  tablet  -> "lg"
 *  desktop -> "xl"
 *
 *  i.e. if tablet device is set to hidden, the output class will be "lg:hidden"
 */
function getVisibilityClasses(content: CmsBlock | CmsSection | CmsSlot) {
  if (
    isCmsSlot(content) ||
    !content?.visibility ||
    Object.keys(content?.visibility).length === 0
  )
    return {};

  const visibilityCssClasses: {
    "md:hidden"?: boolean;
    "xl:hidden"?: boolean;
    "lg:hidden"?: boolean;
  } = {};

  Object.entries(content?.visibility)?.forEach(([device, isVisible]) => {
    if (!isVisible) {
      visibilityCssClasses[`${deviceMap[device]}:hidden`] = true;
    }
  });
  return visibilityCssClasses;
}

/**
 * Get layout configuration for CMS content
 *
 * @param {CmsBlock | CmsSection | CmsSlot} content CMS content
 *
 * @category CMS (Shopping Experiences)
 */
export function getCmsLayoutConfiguration(
  content: CmsBlock | CmsSection | CmsSlot,
): LayoutConfiguration {
  if (!content || isCmsSlot(content)) {
    return {
      cssClasses: null,
      layoutStyles: {},
    } as LayoutConfiguration;
  }

  const visibilityCssClasses = getVisibilityClasses(content);
  const cssClasses = Object.keys(visibilityCssClasses).length
    ? Object.assign({}, content.cssClass, visibilityCssClasses)
    : content.cssClass;

  return {
    cssClasses,
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
