import { getProductListingFromCmsPage } from "@shopware/helpers";
import { preload } from "react-dom";

import type { Schemas } from "#shopware";

import type { CmsContext } from "../../context";
import { cx } from "../../helpers/cx";
import { findFirstCmsImageUrl } from "../../helpers/findFirstCmsImageUrl";
import { getCmsLayout, getSizingClassName } from "../../helpers/layout";
import {
  createCmsElement,
  getCmsComponentName,
  resolveCmsComponent,
} from "../../registry";
import { CmsNoComponent } from "./CmsNoComponent";

export type CmsPageProps = {
  content: Schemas["CmsPage"];
  ctx: CmsContext;
};

function CmsSectionRenderer({
  content,
  ctx,
}: {
  content: Schemas["CmsSection"];
  ctx: CmsContext;
}) {
  if (!resolveCmsComponent(ctx.registry, content)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[CMS] Section type "${content.type}" is not implemented.\n  → Create a component named "${getCmsComponentName(content)}" and register it under sections["${content.type}"].`,
      );
      return <CmsNoComponent content={content} />;
    }
    return null;
  }

  const layout = getCmsLayout(content, {
    backgroundImage: ctx.config.backgroundImage,
  });

  return createCmsElement(ctx.registry, {
    content,
    ctx,
    className:
      cx(layout.className, getSizingClassName(layout.sizingMode)) || undefined,
    style: layout.background,
  });
}

export function CmsPage({ content, ctx }: CmsPageProps) {
  const sections = content.sections ?? [];

  const listing =
    ctx.listing ??
    (ctx.routeName === "frontend.navigation.page"
      ? (getProductListingFromCmsPage<Schemas["ProductListingResult"]>(
          content,
        ) ?? undefined)
      : undefined);
  const pageCtx: CmsContext = listing ? { ...ctx, listing } : ctx;

  if (pageCtx.config.lcpImagePreload) {
    const lcpImage = findFirstCmsImageUrl(
      sections,
      pageCtx.config.backgroundImage,
    );
    if (lcpImage) preload(lcpImage, { as: "image", fetchPriority: "high" });
  }

  return sections.map((section) => (
    <CmsSectionRenderer key={section.id} content={section} ctx={pageCtx} />
  ));
}
