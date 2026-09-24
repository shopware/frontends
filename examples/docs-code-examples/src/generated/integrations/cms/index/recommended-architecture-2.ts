import type { CmsAdapter, CmsRouteContext } from "./recommended-architecture";

export function createCmsResolver(adapter: CmsAdapter) {
  return async (context: CmsRouteContext) => {
    const page = await adapter.resolvePage(context);

    if (!page) return null;

    return {
      ...page,
      blocks: page.blocks.filter((block) => Boolean(block.type)),
    };
  };
}
