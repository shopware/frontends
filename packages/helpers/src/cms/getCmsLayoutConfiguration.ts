import type { HelpersCssClasses } from "./layoutClasses";

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

  const visibilityMap: Record<CmsVisibility, HelpersCssClasses> = {
    mobile: "max-md:hidden",
    tablet: "md:max-lg:hidden",
    desktop: "lg:hidden",
  };

  for (const [device, isVisible] of Object.entries(content.visibility)) {
    if (!isVisible && visibilityMap[device]) {
      visibilityCssClasses[visibilityMap[device]] = true;
    }
  }

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
  const result: LayoutConfiguration = {
    cssClasses: null,
    layoutStyles: {},
  };

  if (!content || isCmsSlot(content)) {
    return result;
  }
  const visibilityCssClasses = _getVisibilityClasses(content);
  // convert css classes string into object in format { "css-class-name": true }
  const mappedCssClasses =
    typeof content.cssClass === "string"
      ? content.cssClass.split(" ").reduce((accumulator, cssClass) => {
          return Object.assign(accumulator, { [cssClass]: true });
        }, {})
      : {};

  // append visibility classes to the css classes object
  const cssClasses = Object.keys(visibilityCssClasses).length
    ? Object.assign({}, mappedCssClasses, visibilityCssClasses)
    : mappedCssClasses;

  result.cssClasses = cssClasses;

  if (content.backgroundColor) {
    result.layoutStyles.backgroundColor = content.backgroundColor;
  }

  if (content.marginBottom) {
    result.layoutStyles.marginBottom = content.marginBottom;
  }
  if (content.marginLeft) {
    result.layoutStyles.marginLeft = content.marginLeft;
  }
  if (content.marginRight) {
    result.layoutStyles.marginRight = content.marginRight;
  }
  if (content.marginTop) {
    result.layoutStyles.marginTop = content.marginTop;
  }

  if (content.backgroundMedia) {
    result.layoutStyles.backgroundImage = `url("${content.backgroundMedia.url}")`;
  }
  if (content.backgroundMediaMode) {
    result.layoutStyles.backgroundSize = content.backgroundMediaMode;
  }
  if (content.sizingMode) {
    result.layoutStyles.sizingMode = content.sizingMode;
  }
  return result;
}
