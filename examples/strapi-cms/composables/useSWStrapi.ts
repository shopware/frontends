export function useSWStrapi() {
  const getPage = async (route: string) => {
    const { findOne } = useStrapi();
    const response = await findOne("pages", undefined, {
      filters: {
        seoUrl: route,
      },
    });
    return response;
  };

  const resolveComponent = async (route: string) => {
    const page = await getPage(route);
    if (!page.data[0]) return null;
    console.log("page", page);
    return h("div", {}, page.data[0].attributes.text);
  };

  return {
    resolveComponent,
  };
}
