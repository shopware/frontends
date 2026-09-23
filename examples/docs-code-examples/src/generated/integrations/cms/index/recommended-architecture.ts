type CmsRouteContext = {
  path: string;
  locale: string;
  salesChannelId?: string;
};

type CmsBlock = {
  id: string;
  type: string;
  props: Record<string, unknown>;
};

type CmsPage = {
  title?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  blocks: CmsBlock[];
};

type CmsAdapter = {
  resolvePage(context: CmsRouteContext): Promise<CmsPage | null>;
};
