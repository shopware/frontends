import type { Schemas } from "#shopware";

import type { CmsContext } from "../../context";
import { getImageSizes } from "../../helpers/imageSizes";
import { getCmsLayout } from "../../helpers/layout";
import {
  createCmsElement,
  getCmsComponentName,
  resolveCmsComponent,
} from "../../registry";
import { CmsNoComponent } from "./CmsNoComponent";

export type CmsGenericBlockProps = {
  content: Schemas["CmsBlock"];
  ctx: CmsContext;
};

export function CmsGenericBlock({ content, ctx }: CmsGenericBlockProps) {
  if (!resolveCmsComponent(ctx.registry, content)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[CMS] Block type "${content.type}" is not implemented.\n  → Create a component named "${getCmsComponentName(content)}" and register it under blocks["${content.type}"].\n  📖 Docs: https://developer.shopware.com/frontends/guides/cms/create-blocks`,
      );
      return <CmsNoComponent content={content} />;
    }
    return null;
  }

  const slotCount = content.slots?.length || 1;
  const blockCtx: CmsContext = {
    ...ctx,
    slotCount,
    imageSizes: getImageSizes(slotCount, ctx.config.imageSizes),
  };
  const layout = getCmsLayout(content, {
    backgroundImage: ctx.config.backgroundImage,
  });

  return (
    <div style={layout.background}>
      {createCmsElement(ctx.registry, {
        content,
        ctx: blockCtx,
        className: layout.className || undefined,
        style: layout.margins,
      })}
    </div>
  );
}
