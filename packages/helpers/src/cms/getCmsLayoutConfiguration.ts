// CmsBlock make as a generic type
type GenericCms = {
  visibility?: {
    [key in CmsVisibility]?: boolean;
  };
  cssClass?: string | null;
  backgroundColor?: string | null;
  backgroundMedia?: { url: string } | null;
  backgroundMediaMode?: string | null;
  sizingMode?: string | null;
  marginBottom?: string | null;
  marginLeft?: string | null;
  marginRight?: string | null;
  marginTop?: string | null;
};
type CmsBlock = GenericCms & { apiAlias: "cms_block" };
type CmsSection = GenericCms & { apiAlias: "cms_section" };
type CmsSlot = GenericCms & { apiAlias: "cms_slot" };
type CmsVisibility = "mobile" | "tablet" | "desktop" | string;

/**
 * @beta
 */
export type LayoutConfiguration = {
  layoutStyles: {
    backgroundColor?: string | null;
    backgroundImage?: string | null;
    backgroundSize?: string | null;
    sizingMode?: string | null;
    marginBottom?: string | null | undefined;
    marginLeft?: string | null | undefined;
    marginRight?: string | null | undefined;
    marginTop?: string | null | undefined;
  };
  cssClasses: {
    [cssClass: string]: boolean;
  } | null;
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

/**
 * Get CSS classes for visibility based on device type.
 *
 *  i.e. if tablet device is set to hidden, the output class will be "md:max-lg:hidden"
 *
 *  @internal
 */
export function _getVisibilityClasses(
  content: CmsBlock | CmsSection | CmsSlot,
): Record<string, boolean> {
  const visibilityCssClasses: Record<string, boolean> = {};

  if (isCmsSlot(content) || !content?.visibility) {
    return visibilityCssClasses;
  }

  const visibilityMap: Record<CmsVisibility, string> = {
    mobile: "max-md:hidden", // TODO: #549 - create exported helper classes to be included in safelist
    tablet: "md:max-lg:hidden",
    desktop: "lg:hidden",
  };

  Object.entries(content.visibility).forEach(([device, isVisible]) => {
    if (!isVisible && visibilityMap[device]) {
      visibilityCssClasses[visibilityMap[device]] = true;
    }
  });

  return visibilityCssClasses;
}

/**
 * Get layout configuration for CMS content
 *
 * @param content CMS content
 *
 * @category CMS (Shopping Experiences)
 */
export function getCmsLayoutConfiguration<
  T extends CmsBlock | CmsSection | CmsSlot,
>(content: T): LayoutConfiguration {
  if (!content || isCmsSlot(content)) {
    return {
      cssClasses: null,
      layoutStyles: {},
    } as LayoutConfiguration;
  }
  const visibilityCssClasses = _getVisibilityClasses(content);
  // convert css classes string into object in format { "css-class-name": true }
  const mappedCssClasses =
    typeof content.cssClass === "string"
      ? {
          ...content.cssClass.split(" ").reduce((accumulator, cssClass) => {
            return { ...accumulator, [cssClass]: true };
          }, {}),
        }
      : {};

  // append visibility classes to the css classes object
  const cssClasses = Object.keys(visibilityCssClasses).length
    ? Object.assign({}, mappedCssClasses, visibilityCssClasses)
    : mappedCssClasses;

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
