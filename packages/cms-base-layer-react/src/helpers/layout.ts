import {
  getBackgroundImageUrl,
  getCmsLayoutConfiguration,
} from "@shopware/helpers";
import type { BackgroundImageOptions } from "@shopware/helpers";
import type { CSSProperties } from "react";

import type { CmsContent } from "../registry";

export type CmsLayout = {
  className: string;
  sizingMode: string | null | undefined;
  margins: CSSProperties;
  background: CSSProperties;
};

export function getCmsLayout(
  content: CmsContent,
  options?: { backgroundImage?: BackgroundImageOptions },
): CmsLayout {
  const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(content);

  const className = Object.entries(cssClasses ?? {})
    .filter(([, enabled]) => enabled)
    .map(([name]) => name)
    .join(" ");

  const margins: CSSProperties = {};
  if (layoutStyles.marginTop) margins.marginTop = layoutStyles.marginTop;
  if (layoutStyles.marginRight) margins.marginRight = layoutStyles.marginRight;
  if (layoutStyles.marginBottom)
    margins.marginBottom = layoutStyles.marginBottom;
  if (layoutStyles.marginLeft) margins.marginLeft = layoutStyles.marginLeft;

  const background: CSSProperties = {};
  if (layoutStyles.backgroundColor)
    background.backgroundColor = layoutStyles.backgroundColor;
  if (layoutStyles.backgroundImage && content.apiAlias !== "cms_slot")
    background.backgroundImage = getBackgroundImageUrl(
      layoutStyles.backgroundImage,
      content,
      options?.backgroundImage,
    );
  if (layoutStyles.backgroundSize)
    background.backgroundSize = layoutStyles.backgroundSize;

  return {
    className,
    sizingMode: layoutStyles.sizingMode,
    margins,
    background,
  };
}

export function getSizingClassName(
  sizingMode: string | null | undefined,
): string {
  if (sizingMode === "boxed") return "max-w-screen-2xl w-full mx-auto";
  if (sizingMode === "full_width") return "w-full";
  return "";
}
