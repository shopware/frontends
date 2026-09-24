const cmsAdapter: CmsAdapter = {
  async resolvePage(context) {
    const rawPage = await fetchFromYourCms(context);

    if (!rawPage) return null;

    return normalizeCmsPage(rawPage);
  },
};
