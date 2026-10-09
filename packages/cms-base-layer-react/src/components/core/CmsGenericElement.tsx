import type { CSSProperties } from "react";

import type { Schemas } from "#shopware";

import type { CmsContext } from "../../context";
import { cx } from "../../helpers/cx";
import { getCmsLayout } from "../../helpers/layout";
import {
  createCmsElement,
  getCmsComponentName,
  resolveCmsComponent,
} from "../../registry";
import { CmsNoComponent } from "./CmsNoComponent";

export type CmsGenericElementProps = {
  content?: Schemas["CmsSlot"];
  ctx: CmsContext;
  className?: string;
  style?: CSSProperties;
};

export function CmsGenericElement({
  content,
  ctx,
  className,
  style,
}: CmsGenericElementProps) {
  if (!content) return null;

  if (resolveCmsComponent(ctx.registry, content)) {
    const layout = getCmsLayout(content);
    return createCmsElement(ctx.registry, {
      content,
      ctx,
      className: cx(layout.className, className) || undefined,
      style: { ...layout.margins, ...style },
    });
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[CMS] Element type "${content.type}" is not implemented.\n  → Create a component named "${getCmsComponentName(content)}" and register it under elements["${content.type}"].\n  📖 Docs: https://developer.shopware.com/frontends/guides/cms/create-elements`,
    );
    return <CmsNoComponent content={content} />;
  }

  return null;
}
