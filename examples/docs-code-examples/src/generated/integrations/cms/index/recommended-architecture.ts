export type CmsRouteContext = {
  path: string;
  locale: string;
  salesChannelId?: string;
};

export type CmsBlock = {
  id: string;
  type: string;
  props: Record<string, unknown>;
};

export type CmsPage = {
  title?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  blocks: CmsBlock[];
};

export type CmsAdapter = {
  resolvePage(context: CmsRouteContext): Promise<CmsPage | null>;
};
